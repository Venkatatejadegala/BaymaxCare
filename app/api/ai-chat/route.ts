// ai-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel } from '../../../lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const model = getGeminiModel('gemini-2.5-flash');
    
    // The rest of your code remains unchanged.
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    const systemInstruction = "You are Baymax, an AI assistant that ONLY answers health, wellness, fitness, nutrition, medicines, symptoms, first aid, prevention, mental health, and Ayurveda-related questions. If the user asks about anything non-health, politely steer them back to health topics. \n\nFORMATTING RULES:\n- Use markdown formatting for better readability\n- Use **bold** for important terms and headings\n- Use bullet points (- or *) for lists\n- Use numbered lists (1. 2. 3.) for steps\n- Use proper spacing between sections\n\nRESPONSE STYLE:\n- Default to clear, well-structured answers with markdown formatting\n- Include likely causes and 2–4 actionable steps in bullet format\n- Use **bold** to highlight key points\n- When suggesting medications, use bullets with **bold** medication names\n- Keep safety notes short and use **bold** for warnings\n\nExample format:\n**Heading**\n- Point 1 with **important term**\n- Point 2\n\n**Next Section**\n- More details\n\nRespond with properly formatted markdown text (bullets, bold, lists) that will render beautifully in the chat interface.";
    console.log('Sending request to Gemini API...');

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: message }] }],
      systemInstruction: { role: 'model', parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1500,
      }
    });

    const response = await result.response;
    const responseText = response.text();

    console.log('Gemini API Response received.');
    
    // Ensure we return valid JSON with markdown-formatted response
    return NextResponse.json({ 
      response: responseText,
      format: 'markdown'
    }, { status: 200 });

  } catch (error: any) {
    if (error.message && error.message.includes('GEMINI_API_KEY')) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request. Please ensure your Gemini API key is correct.' },
      { status: 500 }
    );
  }
}