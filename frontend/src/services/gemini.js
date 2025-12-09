import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

console.log("My Key is:", API_KEY); // Add this temporarily
// Initialize the model
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export const getAIReview = async (text) => {
  if (!text) return null;

  try {
    const prompt = `
      You are a study assistant. Analyze the following note and provide a structured review:
      
      NOTE CONTENT:
      "${text}"
      
      OUTPUT FORMAT:
      Please provide the response in these 4 distinct sections:
      1. **Summary**: A concise summary of the note.
      2. **Missing Concepts**: 2-3 key concepts that are relevant but missing from the note.
      3. **Quiz Question**: A single multiple-choice question to test understanding.
      4. **Related Topics**: List 3 related topics the user should study next.
      
      Keep the tone helpful and encouraging.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate review");
  }
};