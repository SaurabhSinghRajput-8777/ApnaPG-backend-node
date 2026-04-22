import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Manual dotenv load for standalone script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

async function verifyGeminiKey() {
  const apiKey = process.env.GEMINI_API_KEY;

  console.log("🔍 Checking API Key...");
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.error("❌ ERROR: GEMINI_API_KEY is missing or is still the placeholder in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    console.log("📂 Fetching all available models...");
    const modelsResult = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data: any = await modelsResult.json();
    
    if (!data.models) {
       console.error("❌ ERROR: Could not fetch models. Response:", JSON.stringify(data));
       return;
    }

    const candidateModels = data.models
      .filter((m: any) => m.supportedGenerationMethods.includes("generateContent"))
      .map((m: any) => m.name.replace("models/", ""));

    console.log(`🔎 Found ${candidateModels.length} candidate models. Testing each for quota...`);

    for (const modelId of candidateModels) {
      if (modelId.includes("vision") || modelId.includes("embedding")) continue;
      
      process.stdout.write(`⏳ Testing [${modelId}]... `);
      try {
        const model = genAI.getGenerativeModel({ model: modelId });
        const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: 'Hi' }] }] });
        const response = await result.response;
        console.log("✅ SUCCESS!");
        console.log(`\n🎉 WORKING MODEL FOUND: ${modelId}`);
        console.log(`Response: ${response.text()}`);
        return;
      } catch (err: any) {
        if (err.message?.includes("429")) {
          console.log("❌ Quota Exceeded (limit 0)");
        } else if (err.message?.includes("404")) {
          console.log("❌ Not Found");
        } else {
          console.log(`❌ ERROR: ${err.message.substring(0, 50)}...`);
        }
      }
    }
    console.log("\n❌ ALL models failed with 'limit 0' quota. This API key cannot be used for generation.");
  } catch (error: any) {
    console.error("❌ Critical Failure:", error.message);
  }
}

verifyGeminiKey();
