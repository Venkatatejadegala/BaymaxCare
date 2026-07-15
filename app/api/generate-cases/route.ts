// api/generate-cases/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel } from '../../../lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const model = getGeminiModel('gemini-2.5-flash');

        const { count = 6, categories = ['emergency', 'chronic', 'preventive', 'ayurvedic'] } = await request.json();

        const systemPrompt = `You are a medical AI assistant generating realistic case studies for a healthcare documentation system. 

Generate ${count} diverse medical case studies covering these categories: ${categories.join(', ')}.

For each case study, provide:
- Realistic patient scenarios
- Accurate medical symptoms
- Appropriate diagnoses
- Evidence-based treatments
- Realistic outcomes
- Confidence scores (70-95%)

Format as JSON array with these fields:
- id: unique identifier
- title: descriptive case title
- description: brief case overview
- symptoms: array of symptoms
- diagnosis: medical diagnosis
- treatment: treatment approach
- outcome: patient outcome
- confidence: confidence score (70-95)
- category: one of the specified categories
- timestamp: current timestamp

Make cases realistic, educational, and appropriate for medical documentation.`;

        const userPrompt = `Generate ${count} medical case studies covering: ${categories.join(', ')}`;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            systemInstruction: { role: 'model', parts: [{ text: systemPrompt }] },
            generationConfig: {
                maxOutputTokens: 2000,
                temperature: 0.7,
            }
        });

        const response = await result.response;
        const aiResponse = response.text();

        try {
            const parsedCases = JSON.parse(aiResponse);
            return NextResponse.json({ cases: parsedCases });
        } catch (parseError) {
            return NextResponse.json({
                cases: [
                    {
                        id: 'fallback-1',
                        title: 'AI-Generated Case Study',
                        description: 'AI-generated medical case study',
                        symptoms: ['Symptom 1', 'Symptom 2'],
                        diagnosis: 'AI Diagnosis',
                        treatment: 'AI Treatment Plan',
                        outcome: 'Positive outcome',
                        confidence: 85,
                        category: 'preventive',
                        timestamp: new Date().toISOString()
                    }
                ]
            });
        }
    } catch (error: any) {
        if (error.message && error.message.includes('GEMINI_API_KEY')) {
            return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
        }
        console.error('Case Generation API Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate case studies' },
            { status: 500 }
        );
    }
}