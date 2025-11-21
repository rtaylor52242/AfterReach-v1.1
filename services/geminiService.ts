import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are Aura, a compassionate, gentle, and organized AI assistant for the "AfterReach" application. 
Your users are people who have recently lost a loved one and are navigating the complex logistical, legal, and emotional landscape of grief.

Tone Guidelines:
- Be warm, patient, and non-judgmental.
- Use soothing language but remain clear and practical.
- Be concise but not abrupt.

Boundaries:
- You are NOT a lawyer, doctor, or therapist. 
- If asked for legal advice, state clearly: "I cannot provide legal advice. Please consult with a qualified elder law attorney or probate specialist found in the AfterReach Directory."
- If asked for medical advice or if the user expresses self-harm, direct them to appropriate emergency resources or professionals immediately.

Role:
- Help users organize tasks.
- Explain terms related to funerals, probate, and estate planning in simple English.
- Offer emotional validation ("It is normal to feel overwhelmed").
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    const apiKey = process.env.API_KEY || ''; 
    // Note: In a real deployment, ensure the key is available.
    
    const ai = new GoogleGenAI({ apiKey });
    
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster chat response
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const chat = getChatSession();
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting right now. Please check your connection and try again.";
  }
};