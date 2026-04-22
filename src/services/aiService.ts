import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Generates a response from Gemini AI.
 * Acts as a PG assistant to help users with their queries.
 */
export const generateAIResponse = async (prompt: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.error("❌ Gemini API Key is missing or invalid in .env");
    throw new Error("Gemini API Key is not configured correctly on the server.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

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
    console.error("❌ [GEMINI SERVICE ERROR]:", error);
    // Log helpful details if it's a known API error
    if (error.response) {
      console.error("Details:", JSON.stringify(error.response, null, 2));
    }
    throw new Error(error.message || "Failed to generate AI response.");
  }
};
