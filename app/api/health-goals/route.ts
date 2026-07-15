import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel } from '../../../lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const model = getGeminiModel('gemini-1.5-flash');

    const { goals, progress, userProfile, action } = await request.json();

    const systemPrompt = `You are Baymax, an advanced AI health goals coach and motivation specialist.

PERSONALITY:
- Be encouraging, supportive, and motivational
- Provide realistic, achievable goal recommendations
- Use positive reinforcement and celebrate progress
- Focus on sustainable lifestyle changes

COACHING CAPABILITIES:
- Goal setting and planning
- Progress tracking and analysis
- Motivation and encouragement
- Milestone celebration
- Obstacle identification and solutions
- Habit formation strategies

RESPONSE GUIDELINES:
- Analyze current goals and progress
- Provide specific, actionable advice
- Celebrate achievements and milestones
- Identify potential obstacles and solutions
- Suggest goal adjustments if needed
- Offer motivation and encouragement
- Recommend new goals based on progress

Provide your response in this JSON format:
{
    "motivation": "Great job on your progress! You're doing amazing!",
    "progressAnalysis": "You've made excellent progress on your weight loss goal",
    "achievements": ["Lost 2kg this month", "Consistent daily steps", "Improved sleep quality"],
    "recommendations": ["Increase daily steps to 12,000", "Add strength training twice weekly", "Focus on protein intake"],
    "obstacles": ["Weekend consistency", "Stress eating"],
    "solutions": ["Plan weekend activities", "Practice stress management techniques"],
    "nextMilestones": ["Reach 67kg by next month", "Complete 30-day streak", "Add new fitness goal"],
    "encouragement": "You're on track to achieve your goals! Keep up the great work!"
}`;

    let userPrompt = '';
    
    switch (action) {
      case 'analyze_progress':
        userPrompt = `Analyze the progress on these health goals:

GOALS: ${JSON.stringify(goals)}
PROGRESS: ${JSON.stringify(progress)}
USER PROFILE: ${JSON.stringify(userProfile)}

Please provide progress analysis, motivation, and recommendations.`;
        break;
        
      case 'suggest_goals':
        userPrompt = `Suggest new health goals based on this user profile:

USER PROFILE: ${JSON.stringify(userProfile)}
CURRENT GOALS: ${JSON.stringify(goals)}
PROGRESS: ${JSON.stringify(progress)}

Please suggest 3-5 new achievable health goals.`;
        break;
        
      case 'celebrate_milestone':
        userPrompt = `Celebrate this milestone achievement:

MILESTONE: ${JSON.stringify(goals.find(g => g.id === progress.milestoneId))}
PROGRESS: ${JSON.stringify(progress)}
USER PROFILE: ${JSON.stringify(userProfile)}

Please provide celebration message and next steps.`;
        break;
        
      default:
        userPrompt = `Provide general health goal coaching for:

GOALS: ${JSON.stringify(goals)}
PROGRESS: ${JSON.stringify(progress)}
USER PROFILE: ${JSON.stringify(userProfile)}`;
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: { role: 'model', parts: [{ text: systemPrompt }] },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      }
    });

    const response = await result.response;
    const aiResponse = response.text();

    try {
      const parsedResponse = JSON.parse(aiResponse);
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      console.error('AI Goals API: Failed to parse JSON, using fallback.', parseError);
      return NextResponse.json({
        motivation: "You're doing great! Keep up the excellent work on your health journey!",
        progressAnalysis: "Your consistent efforts are paying off. Continue with your current approach.",
        achievements: ["Consistent goal tracking", "Positive health improvements"],
        recommendations: ["Maintain current healthy habits", "Set new challenging but achievable goals"],
        obstacles: ["Stay consistent during busy periods"],
        solutions: ["Plan ahead for busy days", "Set smaller daily targets"],
        nextMilestones: ["Continue current progress", "Add new health goals"],
        encouragement: "Every step forward is progress! You're building healthy habits that will last a lifetime!"
      });
    }
  } catch (error: any) {
    if (error.message && error.message.includes('GEMINI_API_KEY')) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error('AI Goals API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process health goals request. Please ensure your Gemini API key is correct.' },
      { status: 500 }
    );
  }
}
