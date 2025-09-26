import { embed } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Initialize Google client with your API key
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!, // must be set in .env.local
});

export async function getEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error("Text must not be empty.");
  }

  try {
    const { embedding } = await embed({
      model: google.textEmbeddingModel("text-embedding-004"),
      value: text,
    });
    // console.log("embedding", embedding);
    return embedding;
  } catch (error) {
    console.error(" Failed to generate embedding:", error);
    throw new Error("Embedding generation failed");
  }
}
