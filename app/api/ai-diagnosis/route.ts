// ai-diagnosis/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel } from '../../../lib/gemini';

// api/ai-diagnosis/route.ts (updated function)
// ... (imports and initialization remain the same)

export async function POST(request: NextRequest) {
    try {
        const model = getGeminiModel('gemini-2.5-flash');

        const { symptoms, description, medicineType, images } = await request.json();

        // Build the request parts, including both text and images
        const parts: any[] = [{ text: `Symptoms: ${symptoms}\nDescription: ${description}` }];

        // Add Base64 images to the parts array in the correct format
        if (images && Array.isArray(images)) {
            images.forEach((base64Image: string) => {
                const [mimeType, data] = base64Image.split(';base64,');
                parts.push({
                    inlineData: {
                        mimeType: mimeType.replace('data:', ''),
                        data: data,
                    },
                });
            });
        }
        
        // Use a more detailed system prompt to guide the AI for visual diagnosis
// api/ai-diagnosis/route.ts (updated systemPrompt)
const systemPrompt = `You are Baymax, an AI medical assistant providing detailed symptom analysis.

IMPORTANT: You MUST respond with ONLY valid JSON. No additional text before or after the JSON.

RESPONSE FORMAT (strict JSON):
{
  "analysis": "Markdown formatted analysis text here",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "confidence": 75,
  "medicines": ["Medicine name (dosage)", "Medicine name (dosage)"]
}

ANALYSIS FIELD FORMATTING (use markdown):
- Start with **Main Heading** (bold)
- Use bullet points (-) for causes, symptoms, assessments
- Use **bold** for key medical terms and important points
- Use numbered lists for steps if needed
- Keep sections well-spaced

EXAMPLE ANALYSIS FORMAT:
"**Symptom Analysis**\n\n**Likely Causes:**\n- Cause 1 with **important term**\n- Cause 2\n- Cause 3\n\n**Assessment:**\n- Severity: **MODERATE**\n- Risk Level: **LOW-MODERATE**\n- Urgency: Routine\n\n**Key Observations:**\n- Observation 1\n- Observation 2\n\n**Next Steps:**\n1. Step one\n2. Step two"

STYLE GUIDELINES:
- Be clear, concise, and professional
- Use medical terminology appropriately
- Highlight urgent information with **bold**
- Structure information logically with headings and bullets
- Medicine type context: ${medicineType === 'english' ? 'Modern/Allopathic Medicine' : 'Ayurvedic/Traditional Medicine'}
- Visual analysis: ${images && images.length > 0 ? 'Images provided - analyze visual symptoms' : 'Text-only analysis'}

SAFETY:
- For emergencies: Use **bold** for urgent warnings and call 112 immediately
- Recommend professional consultation for severe symptoms or if symptoms persist/worsen

REMEMBER: Return ONLY valid JSON, no markdown code blocks, no explanation, just the JSON object.`;
        // Call the model with the combined parts
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: parts }],
            systemInstruction: { role: 'model', parts: [{ text: systemPrompt }] },
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1500,
            }
        });

        const response = await result.response;
        let aiResponse = response.text().trim();

        // Clean up the response - remove markdown code blocks if present
        aiResponse = aiResponse.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

        try {
            const parsedResponse = JSON.parse(aiResponse);
            
            // Ensure analysis has proper markdown formatting
            if (parsedResponse.analysis && typeof parsedResponse.analysis === 'string') {
                // Analysis should already have markdown, just ensure it's clean
                parsedResponse.analysis = parsedResponse.analysis.trim();
            }
            
            // Ensure recommendations is an array
            if (!Array.isArray(parsedResponse.recommendations)) {
                parsedResponse.recommendations = parsedResponse.recommendations 
                    ? [parsedResponse.recommendations] 
                    : [];
            }
            
            // Ensure confidence is a number
            if (typeof parsedResponse.confidence !== 'number') {
                parsedResponse.confidence = parsedResponse.confidence 
                    ? parseInt(parsedResponse.confidence) || 75 
                    : 75;
            }
            
            // Ensure medicines is an array
            if (!Array.isArray(parsedResponse.medicines)) {
                parsedResponse.medicines = parsedResponse.medicines 
                    ? [parsedResponse.medicines] 
                    : [];
            }
            
            return NextResponse.json(parsedResponse);
        } catch (parseError) {
            console.error('AI Diagnosis API: Failed to parse JSON, using formatted fallback.', parseError);
            console.error('Raw response:', aiResponse);
            
            // Create a well-formatted fallback with markdown
            const formattedAnalysis = `**Symptom Analysis**\n\n${aiResponse}\n\n**Recommendations:**\n- Consult a healthcare professional for proper diagnosis\n- Monitor symptoms and seek help if they worsen\n- Follow any prescribed treatment plans`;
            
            return NextResponse.json({
                analysis: formattedAnalysis,
                recommendations: [
                    "Consult a healthcare professional for proper diagnosis",
                    "Monitor symptoms and seek help if they worsen",
                    "Follow any prescribed treatment plans"
                ],
                confidence: 75,
                medicines: medicineType === 'english'
                    ? ["Paracetamol (for pain/fever)", "Ibuprofen (anti-inflammatory)", "Consult pharmacist for specific recommendations"]
                    : ["Turmeric (anti-inflammatory)", "Ginger (digestive support)", "Honey (cough relief)", "Consult Ayurvedic practitioner"]
            });
        }
    } catch (error: any) {
        if (error.message && error.message.includes('GEMINI_API_KEY')) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.error('AI Diagnosis API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process AI request. Please ensure your Gemini API key is correct.' },
            { status: 500 }
        );
    }
}