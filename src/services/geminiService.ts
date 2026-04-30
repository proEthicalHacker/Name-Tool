import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export interface BabyName {
  englishName: string;
  hindiName: string;
  phoneticSpelling: string;
  audioUrl: string;
  meaning: string;
  originTheme: string;
}

export async function generateBabyNames(
  gender: 'Boy' | 'Girl' | 'Any',
  startingLetter: string,
  theme: string,
  customKeywords: string = ''
): Promise<BabyName[]> {
  const prompt = `Generate a list of 6 beautiful, meaningful Hindi baby names.
  Preferences:
  - Gender: ${gender}
  - Starting Letter: ${startingLetter ? startingLetter : 'Any'}
  - Theme/Style: ${theme}
  ${customKeywords ? `- Custom Keywords/Meaning: ${customKeywords}` : ''}
  
  Please provide names that sound modern yet have deep cultural roots. For the audioUrl, assume a service provides this and return a placeholder URL like "https://api.example.com/audio/NAME.mp3".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              englishName: {
                type: Type.STRING,
                description: 'The name written in English alphabet',
              },
              hindiName: {
                type: Type.STRING,
                description: 'The name written in Devanagari script (Hindi)',
              },
              phoneticSpelling: {
                type: Type.STRING,
                description: 'A phonetic pronunciation guide for English speakers (e.g., "ah-NAH-ya")',
              },
              audioUrl: {
                type: Type.STRING,
                description: 'A placeholder URL for an audio file pronouncing the name (e.g., https://api.example.com/audio/...).',
              },
              meaning: {
                type: Type.STRING,
                description: 'The detailed meaning of the name in English',
              },
              originTheme: {
                type: Type.STRING,
                description: 'A short phrase describing its origin or theme (e.g., "Mythological, Name of Lord Shiva" or "Nature, Sanskrit origin")',
              },
            },
            required: ['englishName', 'hindiName', 'phoneticSpelling', 'audioUrl', 'meaning', 'originTheme'],
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }
    
    return JSON.parse(text) as BabyName[];
  } catch (error) {
    console.error("Error generating names:", error);
    throw error;
  }
}
