
import { GoogleGenAI, GenerateContentResponse, Chat, Part, Content } from "@google/genai";
import { ChatMessage } from '../types';
import { ChatRole, GEMINI_API_KEY_INFO, GEMINI_MODEL_NAME } from '../constants';

let ai: GoogleGenAI | null = null;
let chatInstance: Chat | null = null;

if (GEMINI_API_KEY_INFO) {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY_INFO });
} else {
  console.warn("Gemini API Key not found. Please set the API_KEY environment variable.");
}

const getAiInstance = () => {
  if (!ai) {
    throw new Error("Gemini AI SDK not initialized. API_KEY might be missing.");
  }
  return ai;
}

export const isGeminiAvailable = (): boolean => !!ai;

const MEDIBUDDY_SYSTEM_INSTRUCTION = `You are MediBuddy, a friendly and empathetic AI virtual health assistant from HERE AND NOW AI.
Your purpose is to provide general health information, answer health-related queries, and offer support.
You are NOT a doctor and CANNOT give medical advice, diagnoses, or prescriptions.
ALWAYS remind the user to consult a healthcare professional for any medical concerns or before making any health decisions.
Keep responses concise, clear, and easy to understand.
If a question is outside your scope (e.g., not health-related, too complex, requires personal medical knowledge), politely decline and suggest consulting a professional or seeking information from a trusted medical source.
If the user seems in distress or mentions a serious emergency, strongly advise them to contact emergency services or a doctor immediately.
Do not ask for Personally Identifiable Information (PII) or Protected Health Information (PHI).
If the user asks about your capabilities, mention you can help with general health questions, medication information (general, not specific to their prescription), symptom explanations (general), and healthy lifestyle tips.
You are "designed with passion for innovation" by HERE AND NOW AI.
Do not provide information that could be harmful.
Be cautious with drug information; provide general info (e.g., common uses, side effects from public knowledge) but always state that this is not a substitute for advice from their doctor or pharmacist.
When asked for FAQs or health information, provide it in a structured way if possible (e.g., bullet points for symptoms).
`;

export const startChat = (): void => {
  if (!isGeminiAvailable()) return;
  const currentAi = getAiInstance();
  chatInstance = currentAi.chats.create({
    model: GEMINI_MODEL_NAME,
    config: {
      systemInstruction: MEDIBUDDY_SYSTEM_INSTRUCTION,
    },
    history: [],
  });
};

const formatChatHistoryForGemini = (messages: ChatMessage[]): Content[] => {
  return messages.map(msg => ({
    role: msg.role === ChatRole.USER ? 'user' : 'model', // Gemini uses 'user' and 'model'
    parts: [{ text: msg.text }],
  }));
};


export const generateChatResponse = async (
  prompt: string,
  history: ChatMessage[]
): Promise<string> => {
  if (!isGeminiAvailable()) {
    return "The AI assistant is currently unavailable. Please ensure the API key is configured.";
  }
  const currentAi = getAiInstance();

  // If chatInstance is not initialized or history is empty, start a new one.
  // This is a simplified approach. For a persistent chat, you'd manage chatInstance state better.
  if (!chatInstance || history.length === 0) {
     chatInstance = currentAi.chats.create({
      model: GEMINI_MODEL_NAME,
      config: {
        systemInstruction: MEDIBUDDY_SYSTEM_INSTRUCTION,
      },
      // Pass the current history, excluding the latest user prompt as that's the new message
      history: formatChatHistoryForGemini(history.filter(m => m.role !== ChatRole.SYSTEM)), 
    });
  }
  
  // Update chat history for chatInstance if it exists and history has changed
  // This is tricky because sendMessage also updates history.
  // For simplicity, we are creating a new chat or using existing one.
  // A robust solution would manage history explicitly with chatInstance.history.

  try {
    const response: GenerateContentResponse = await chatInstance.sendMessage({ message: prompt });
    return response.text;
  } catch (error) {
    console.error("Error generating chat response:", error);
    if (error instanceof Error && error.message.includes('API_KEY_INVALID')) {
        return "The provided API key is invalid. Please check your configuration.";
    }
    return "Sorry, I encountered an error while processing your request. Please try again later.";
  }
};


export const getHealthInformation = async (query: string): Promise<string> => {
  if (!isGeminiAvailable()) {
    return "The AI assistant is currently unavailable for providing health information.";
  }
  const currentAi = getAiInstance();
  try {
    const response: GenerateContentResponse = await currentAi.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ role: "user", parts: [{text: query}] }],
      config: {
        systemInstruction: `${MEDIBUDDY_SYSTEM_INSTRUCTION} The user is asking for general health information or has a question. Provide a helpful, informative, and safe response.`,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching health information:", error);
    return "Sorry, I couldn't fetch health information at the moment.";
  }
};
