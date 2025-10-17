
import { GoogleGenAI } from "@google/genai";
import { Board, Subject } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development; in a real environment, the key should be set.
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateStudyMaterial = async (board: Board, subject: Subject, classNum: string, chapter: string): Promise<string> => {
    if (!API_KEY) {
        return Promise.resolve("<p>AI generation is disabled. API key not configured.</p>");
    }

    const model = 'gemini-2.5-flash';
    const prompt = `
    You are an expert educator creating study materials for students in India. Your task is to generate a comprehensive, well-structured, and easy-to-understand study guide.

    Board: ${board.toUpperCase()}
    Class: ${classNum}
    Subject: ${subject}
    Chapter: ${chapter}

    Please generate the study material based on the details above. The output must be in clean, semantic HTML format. 
    Use h1 for the main chapter title, h2 for main sections, h3 for sub-sections, p for paragraphs, ul/ol for lists, and strong/em for emphasis.
    Do NOT include <html>, <head>, or <body> tags. Start directly with the <h1> tag for the chapter title.
    The content should be detailed, accurate, and tailored to the specified curriculum (CBSE/ICSE). 
    Break down complex topics into simple points. Include definitions, key concepts, important formulas (if applicable), and examples.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content with Gemini API:", error);
        return `<p class="text-red-500">An error occurred while generating content: ${error instanceof Error ? error.message : 'Unknown error'}</p>`;
    }
};
