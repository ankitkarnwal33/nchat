import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const getGeminiResponse = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error(error);
    throw new Error(error as string);
  }
};
