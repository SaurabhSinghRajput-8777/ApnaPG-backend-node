import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generates a response from Gemini AI.
 * Acts as a PG assistant to help users with their queries.
 */
export const generateAIResponse = async (prompt: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are the ApnaPG Assistant, a helpful and friendly AI specialized in helping people find the perfect Paying Guest (PG) accommodation. You can answer questions about PG life, general locations in India, what to look for in a PG, and help users navigate the ApnaPG platform. Keep your responses concise and professional."
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error: any) {
    console.error("❌ Gemini AI Error:", error.message);
    throw new Error("Failed to generate AI response. Please ensure your API key is valid.");
  }
};
