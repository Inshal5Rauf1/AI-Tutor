
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { VocabularyItem, ComprehensionQuestion, ChatMessage, WritingFeedback } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

export const generateSummary = async (text: string): Promise<string> => {
    const result = await ai.models.generateContent({
        model,
        contents: `Summarize the following text for an English language learner. Keep it simple and clear. Text: "${text}"`,
    });
    return result.text;
};

export const extractVocabulary = async (text: string, nativeLanguage: string): Promise<VocabularyItem[]> => {
    const result = await ai.models.generateContent({
        model,
        contents: `Extract up to 8 key vocabulary words from the following text for an English language learner. For each word, provide a simple English definition, an example sentence using the word in context, and its translation into ${nativeLanguage}. Text: "${text}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        word: { type: Type.STRING, description: "The vocabulary word." },
                        definition: { type: Type.STRING, description: "A simple English definition." },
                        example: { type: Type.STRING, description: "An example sentence." },
                        translation: { type: Type.STRING, description: `The translation of the word into ${nativeLanguage}.` }
                    },
                    required: ["word", "definition", "example", "translation"]
                }
            }
        }
    });
    
    const jsonResponse = JSON.parse(result.text);
    return jsonResponse as VocabularyItem[];
};

export const generateComprehensionQuestions = async (text: string): Promise<ComprehensionQuestion[]> => {
    const result = await ai.models.generateContent({
        model,
        contents: `Generate 5 multiple-choice comprehension questions based on the following text. For each question, provide 4 options, indicate the correct answer, and a brief explanation for why it's correct. Text: "${text}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        correctAnswer: { type: Type.STRING },
                        explanation: { type: Type.STRING, description: "A brief explanation for the correct answer."}
                    },
                    required: ["question", "options", "correctAnswer", "explanation"]
                }
            }
        }
    });

    const jsonResponse = JSON.parse(result.text);
    return jsonResponse as ComprehensionQuestion[];
};

export const checkGrammar = async (text: string): Promise<WritingFeedback> => {
    const result = await ai.models.generateContent({
        model,
        contents: `Act as an English teacher. Review the following text. Provide a corrected version. Then, list the corrections made with a brief, simple explanation for each. Text: "${text}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    correctedText: { type: Type.STRING, description: "The full text with all corrections applied." },
                    explanations: {
                        type: Type.ARRAY,
                        description: "An array of objects explaining each correction.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                original: { type: Type.STRING, description: "The original phrase or word with the error." },
                                correction: { type: Type.STRING, description: "The corrected phrase or word." },
                                reason: { type: Type.STRING, description: "A simple explanation of why the correction was needed."}
                            },
                             required: ["original", "correction", "reason"]
                        }
                    }
                },
                required: ["correctedText", "explanations"]
            }
        }
    });

    const jsonResponse = JSON.parse(result.text);
    return jsonResponse as WritingFeedback;
};

let chatInstance: Chat | null = null;

export const getTutorChat = (sourceText: string): Chat => {
    if (!chatInstance) {
        chatInstance = ai.chats.create({
            model,
            config: {
                systemInstruction: `You are a friendly and patient English tutor. Your goal is to help a student understand a text they have provided. Be encouraging and clear. The student's text is: "${sourceText}"`,
            }
        });
    }
    return chatInstance;
};

export const resetTutorChat = () => {
    chatInstance = null;
}

export const sendTutorMessage = async (chat: Chat, message: string): Promise<GenerateContentResponse> => {
    const response = await chat.sendMessage({ message });
    return response;
};
