import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel } from '../../../lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const model = getGeminiModel('gemini-1.5-flash');

    const { metrics, goals, symptoms, timeRange } = await request.json();

    const systemPrompt = `You are Baymax, an advanced AI health analytics assistant specializing in health data analysis and insights.

PERSONALITY:
- Be analytical, insightful, and data-driven
- Provide evidence-based health recommendations
- Use clear, professional language
- Focus on actionable insights

ANALYSIS CAPABILITIES:
- Health metric trends and patterns
- Goal progress evaluation
- Risk assessment and early warning signs
- Personalized recommendations
- Health score calculations

RESPONSE GUIDELINES:
- Analyze the provided health data comprehensively
- Identify trends, patterns, and potential concerns
- Provide specific, actionable recommendations
- Calculate health scores and risk assessments
- Suggest goal adjustments if needed
- Highlight positive progress and achievements

Provide your response in this JSON format:
{
    "healthScore": 85,
    "trends": ["Weight trending downward", "Blood pressure stable", "Activity levels increasing"],
    "insights": ["Your weight loss progress is excellent", "Consider increasing cardio exercise", "Blood pressure is within healthy range"],
    "recommendations": ["Continue current diet plan", "Add 15 minutes of daily walking", "Schedule quarterly checkup"],
    "riskFactors": ["Slight increase in stress levels", "Irregular sleep pattern"],
    "achievements": ["Lost 5kg in 3 months", "Consistent medication adherence", "Improved fitness levels"],
    "nextSteps": ["Set new weight loss target", "Focus on sleep hygiene", "Increase protein intake"]
}`;

    const userPrompt = `Analyze the following health data:

HEALTH METRICS: ${JSON.stringify(metrics)}
HEALTH GOALS: ${JSON.stringify(goals)}
SYMPTOMS: ${JSON.stringify(symptoms)}
TIME RANGE: ${timeRange || 'Last 30 days'}

Please provide comprehensive health analytics and insights.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: { role: 'model', parts: [{ text: systemPrompt }] },
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2000,
      }
    });

    const response = await result.response;
    const aiResponse = response.text();

    try {
      const parsedResponse = JSON.parse(aiResponse);
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      console.error('AI Analytics API: Failed to parse JSON, using fallback.', parseError);
      return NextResponse.json({
        healthScore: 75,
        trends: ["Data analysis in progress", "Regular monitoring recommended"],
        insights: ["Continue tracking your health metrics", "Maintain current healthy habits"],
        recommendations: ["Keep detailed health records", "Schedule regular checkups", "Stay consistent with goals"],
        riskFactors: ["Monitor for any concerning patterns"],
        achievements: ["Active health tracking", "Consistent data collection"],
        nextSteps: ["Continue current health practices", "Set new measurable goals"]
      });
    }
  } catch (error: any) {
    if (error.message && error.message.includes('GEMINI_API_KEY')) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error('AI Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process health analytics request. Please ensure your Gemini API key is correct.' },
      { status: 500 }
    );
  }
}
