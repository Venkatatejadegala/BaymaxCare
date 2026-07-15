import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { type, season, focus } = await request.json()
    
    // Get OpenAI API key from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY
    
    if (!openaiApiKey) {
      // Return fallback insights if no API key
      return NextResponse.json({
        dailyTip: "Winter is the perfect time for warming spices like ginger, cinnamon, and turmeric. These help balance Vata dosha and boost immunity.",
        herbOfTheDay: {
          name: "Ashwagandha",
          benefits: ["Stress relief", "Energy enhancement", "Immune support"],
          usage: "Take 1-2 capsules with warm milk before bed"
        },
        seasonalAdvice: "Focus on warm, cooked foods and avoid cold, raw foods during winter months.",
        doshaBalance: "Vata tends to be aggravated in winter. Focus on grounding practices and warm foods."
      })
    }

    const systemPrompt = `You are an expert Ayurvedic practitioner with deep knowledge of traditional Indian medicine. 

Generate personalized Ayurvedic insights based on:
- Type: ${type}
- Season: ${season}
- Focus: ${focus}

Provide insights in this JSON format:
{
  "dailyTip": "Practical daily Ayurvedic advice",
  "herbOfTheDay": {
    "name": "Herb name",
    "benefits": ["benefit1", "benefit2", "benefit3"],
    "usage": "How to use this herb"
  },
  "seasonalAdvice": "Season-specific Ayurvedic guidance",
  "doshaBalance": "Dosha balancing advice for current season"
}

Focus on:
- Traditional Ayurvedic wisdom
- Seasonal considerations
- Practical, actionable advice
- Safety and contraindications
- Integration with modern lifestyle`

    const userPrompt = `Generate Ayurvedic insights for ${type} during ${season} season, focusing on ${focus}.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || ''

    try {
      const parsedInsights = JSON.parse(aiResponse)
      return NextResponse.json(parsedInsights)
    } catch (parseError) {
      // Fallback to sample insights if parsing fails
      return NextResponse.json({
        dailyTip: "Practice mindful eating by chewing your food 32 times before swallowing. This aids digestion and helps you connect with your body's needs.",
        herbOfTheDay: {
          name: "Turmeric",
          benefits: ["Anti-inflammatory", "Antioxidant", "Immune support"],
          usage: "Add 1/2 teaspoon to warm milk or meals daily"
        },
        seasonalAdvice: "Maintain regular meal times and include all six tastes (sweet, sour, salty, bitter, pungent, astringent) in your diet.",
        doshaBalance: "Balance your doshas through proper diet, lifestyle, and seasonal practices."
      })
    }

  } catch (error) {
    console.error('Ayurvedic Insights API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate Ayurvedic insights' },
      { status: 500 }
    )
  }
}
