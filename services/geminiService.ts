
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

let ai: GoogleGenAI | null = null;
let currentApiKeyString: string | null = null; // To track the key used for initialization

/**
 * Initializes the GoogleGenAI client with the provided API key.
 * @param apiKey The API key string.
 * @returns True if initialization was successful, false otherwise.
 */
export function initializeGeminiClient(apiKey: string): boolean {
  if (!apiKey || apiKey.trim() === '') {
    console.error("API Key cannot be empty.");
    ai = null;
    currentApiKeyString = null;
    return false;
  }

  try {
    // Initialize or re-initialize if the key is different or client not set
    if (ai && currentApiKeyString === apiKey) {
      console.log("Gemini client already initialized with this key.");
      return true;
    }
    ai = new GoogleGenAI({ apiKey });
    currentApiKeyString = apiKey;
    console.log("Gemini client initialized successfully.");
    return true;
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
    ai = null;
    currentApiKeyString = null;
    return false;
  }
}

/**
 * Sends a prompt to the Gemini API and returns the response.
 * Requires initializeGeminiClient to have been called successfully first.
 * @param prompt The user's prompt string.
 * @returns The AI's text response or an error message.
 */
export async function getGeminiResponse(prompt: string): Promise<string> {
  if (!ai) {
    return "AI Service not initialized. Please provide a valid API Key first by sending it as a message.";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
    });
    
    const text = response.text;
    if (typeof text !== 'string') {
        console.error("Unexpected response format from Gemini API. Expected a string.", response);
        return "AI response format is unexpected. Please try again.";
    }
    return text;

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Check if it's an error object with a message property
    if (error && typeof (error as any).message === 'string') {
      return `Error from AI: ${(error as any).message}`;
    }
    return 'An unexpected error occurred while contacting the AI.';
  }
}
