import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error('Gemini API Key is not configured. Please set the GEMINI_API_KEY environment variable.');
  }
  
  if (!genAI) {
    genAI = new GoogleGenerativeAI(geminiApiKey);
  }
  return genAI;
}

export function getGeminiModel(modelName: string = 'gemini-2.5-flash') {
  return getGeminiClient().getGenerativeModel({ model: modelName });
}
