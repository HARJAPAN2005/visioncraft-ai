import { StateGraph, END } from "@langchain/langgraph";
import { GoogleGenerativeAI } from "@google/generative-ai";

// DEBUG CHECK

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// --- 1. STATE ---
interface AgentState {
  userRequest: string;
  imageBase64: string;
  detectedFeatures?: string;
  finalPrompt?: string;
  generatedImageUrl?: string;
}

// --- 2. NODES ---

// NODE A: VISION (gemini-2.5-flash)
// This is your "Nano Gemini" vision scanner
async function analyzeProduct(state: AgentState) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const base64Data = state.imageBase64.replace(/^data:image\/\w+;base64,/, "");
    
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg",
      },
    };

    // Strict prompt to get facts, not poetry
    const prompt = "Analyze this product image for an e-commerce listing. 1. Identify the Brand Name and Flavor exactly. 2. Describe all text visible on the front of the can, including slogans. 3. Describe the exact colors and artwork style. Output facts only.";
    
    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    
    return { detectedFeatures: text };

  } catch (e) {
    console.error("❌ VISION ERROR:", e);
    return { detectedFeatures: "A commercial product container" };
  }
}

// NODE B: PROMPT ENGINEERING
async function createPrompt(state: AgentState) {
  
  // We construct a prompt that forces the model to be a replicator
  const specializedPrompt = `A precise, photorealistic product photograph of the exact item described here: ${state.detectedFeatures}. 
  The product is placed in this scene: ${state.userRequest}. 
  Crucial Constraints: The generated product must be an exact replica of the description. All text, logos, colors, and artwork must match perfectly. 
  Style: High-end e-commerce, 8k resolution, studio lighting, sharp focus.`;
  
  return { finalPrompt: specializedPrompt };
}

// NODE C: GENERATION (gemini-2.5-flash-image)
// This matches the "Nano Gemini" generation requirement
async function generateImage(state: AgentState) {
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${process.env.GOOGLE_API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
            parts: [{ text: state.finalPrompt }]
        }],
        // FIX: Removed 'generationConfig' entirely.
        // The model automatically returns the image in the response structure.
      })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Gemini API Error: ${err}`);
    }

    const data = await response.json();
    
    // The image is usually in candidates[0].content.parts[0].inlineData
    // @ts-ignore
    const imagePart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    
    if (imagePart) {
        return { generatedImageUrl: `data:image/jpeg;base64,${imagePart.inlineData.data}` };
    } else {
        throw new Error("No image data found in response. (Check console for raw output)");
    }

  } catch (error) {
      console.error("❌ GENERATION ERROR:", error);
      return { generatedImageUrl: null };
  }
}

// --- 3. GRAPH ---
const workflow = new StateGraph<AgentState>({
  channels: {
    userRequest: { reducer: (x, y) => y ?? x, default: () => "" },
    imageBase64: { reducer: (x, y) => y ?? x, default: () => "" },
    detectedFeatures: { reducer: (x, y) => y ?? x, default: () => "" },
    finalPrompt: { reducer: (x, y) => y ?? x, default: () => "" },
    generatedImageUrl: { reducer: (x, y) => y ?? x, default: () => "" },
  }
})
  .addNode("analyze", analyzeProduct)
  .addNode("prompt", createPrompt)
  .addNode("generate", generateImage)
  .addEdge("__start__", "analyze")
  .addEdge("analyze", "prompt")
  .addEdge("prompt", "generate")
  .addEdge("generate", END);

export const appAgent = workflow.compile();