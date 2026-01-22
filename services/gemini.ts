
import { GoogleGenAI, Type } from "@google/genai";
import { Profile, CompatibilityResult } from "../types";

/**
 * Service to handle Gemini API interactions for compatibility analysis and verification.
 */

export const getMatchCompatibility = async (userProfile: Partial<Profile>, targetProfile: Profile): Promise<CompatibilityResult | null> => {
  // Always create a new instance right before making an API call.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze the compatibility between these two individuals for marriage in a South Indian (Tamil) context:
    
    Person 1 (User):
    Age: ${userProfile.age}, Occupation: ${userProfile.occupation}, Location: ${userProfile.location}, About: ${userProfile.about}
    
    Person 2 (Target):
    Name: ${targetProfile.name}, Age: ${targetProfile.age}, Occupation: ${targetProfile.occupation}, Education: ${targetProfile.education}, About: ${targetProfile.about}
    
    Evaluate them on:
    1. Shared Interests
    2. Values & Traditions
    3. Lifestyle & Career Compatibility
    
    Return a detailed breakdown including an overall percentage score, a summary, and specific explanations for each factor.
  `;

  try {
    const response = await ai.models.generateContent({
      // Complex reasoning task: use gemini-3-pro-preview.
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER, description: "Overall compatibility percentage from 0 to 100" },
            summary: { type: Type.STRING, description: "A high-level summary of the match" },
            factors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  explanation: { type: Type.STRING }
                },
                required: ["category", "score", "explanation"]
              }
            }
          },
          required: ["overallScore", "summary", "factors"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as CompatibilityResult;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const verifySelfie = async (base64Image: string): Promise<{ success: boolean; feedback: string }> => {
  // Always create a new instance right before making an API call.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image.split(',')[1],
    },
  };
  const textPart = {
    text: "Analyze this selfie for a matrimonial profile verification. Check if it's a clear, well-lit human face. Return JSON with 'success' (boolean) and 'feedback' (string explaining why it passed or failed)."
  };

  try {
    const response = await ai.models.generateContent({
      // Multimodal task: use gemini-3-flash-preview.
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
          },
          required: ["success", "feedback"]
        }
      }
    });
    // Extract text from GenerateContentResponse property directly.
    const result = JSON.parse(response.text || '{"success": false, "feedback": "Verification failed"}');
    return result;
  } catch (error) {
    console.error("Verification Error:", error);
    return { success: false, feedback: "AI verification system currently busy. Please try again later." };
  }
};
