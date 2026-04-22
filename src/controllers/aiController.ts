import { Request, Response } from 'express';
import { generateAIResponse } from '../services/aiService.js';

/**
 * Handles AI chat requests from the frontend.
 */
export const handleAIChat = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`🤖 [AI REQUEST] User: [${req.user?._id}] Role: [${req.user?.role}] Prompt: "${prompt}"`);
    const assistantResponse = await generateAIResponse(prompt);
    
    return res.json({ response: assistantResponse });
  } catch (err: any) {
    console.error("❌ AI Controller Error:", err.message);
    return res.status(500).json({ 
      error: 'AI Service Error', 
      message: err.message || 'An unexpected error occurred during AI processing.' 
    });
  }
};
