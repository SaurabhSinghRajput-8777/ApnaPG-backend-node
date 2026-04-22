import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

async function listModelsDirectly() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ No API Key found in .env");
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  console.log("📡 Fetching model list directly from Google API...");
  try {
    const response = await fetch(url);
    const data: any = await response.json();

    if (!response.ok) {
      console.error("❌ API ERROR:", data.error?.message || "Unknown error");
      console.error("Full Data:", JSON.stringify(data, null, 2));
      return;
    }

    if (data.models && data.models.length > 0) {
      console.log("✅ Models found for your key:");
      data.models.forEach((m: any) => {
        console.log(` - ${m.name} (supports: ${m.supportedGenerationMethods.join(", ")})`);
      });
      console.log("\n👉 Use the full 'name' string (e.g., 'models/gemini-1.5-flash') in your code.");
    } else {
      console.log("❌ No models found for this API key. This usually means the Generative Language API is not enabled for this project.");
    }
  } catch (error: any) {
    console.error("❌ Connection error:", error.message);
  }
}

listModelsDirectly();
