import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
  console.log("Checking available Google Models for your key...");

  try {
    // This fetches the list from Google
    // @ts-ignore
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`);
    const data = await response.json();

    if (data.models) {
        console.log("\n✅ YOU HAVE ACCESS TO THESE MODELS:");
        data.models.forEach((m: any) => {
            // We only care about models that generate content
            if (m.supportedGenerationMethods.includes("generateContent")) {
                console.log(`- ${m.name}`);
            }
        });
    } else {
        console.log("❌ No models found. Key might be invalid.");
        console.log(data);
    }

  } catch (error) {
    console.error("❌ Error listing models:", error);
  }
}

listModels();