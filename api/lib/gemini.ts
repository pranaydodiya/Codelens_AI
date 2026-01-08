/**
 * Google Gemini AI Client Wrapper
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GOOGLE_GEMINI_API_KEY is not set in environment variables');
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Use Gemini 2.5 Flash model
const MODEL_NAME = 'gemini-2.0-flash-exp';

export interface GeminiConfig {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
}

export interface GeminiResponse {
  text: string;
  usage?: {
    promptTokens?: number;
    candidatesTokens?: number;
    totalTokens?: number;
  };
}

/**
 * Generate text using Gemini AI
 */
export async function generateText(
  prompt: string,
  config: GeminiConfig = {}
): Promise<GeminiResponse> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: {
        temperature: config.temperature ?? 0.7,
        topP: config.topP ?? 0.95,
        topK: config.topK ?? 40,
        maxOutputTokens: config.maxOutputTokens ?? 8192,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract usage information if available
    const usage = response.usageMetadata ? {
      promptTokens: response.usageMetadata.promptTokenCount,
      candidatesTokens: response.usageMetadata.candidatesTokenCount,
      totalTokens: response.usageMetadata.totalTokenCount,
    } : undefined;

    return {
      text,
      usage,
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(
      error instanceof Error 
        ? `Gemini API error: ${error.message}`
        : 'Failed to generate text with Gemini AI'
    );
  }
}

/**
 * Generate structured JSON response from Gemini
 */
export async function generateStructuredJSON(
  prompt: string,
  schema?: string,
  config: GeminiConfig = {}
): Promise<unknown> {
  const structuredPrompt = schema
    ? `${prompt}\n\nReturn the response as valid JSON matching this schema:\n${schema}`
    : `${prompt}\n\nReturn the response as valid JSON.`;

  const response = await generateText(structuredPrompt, {
    ...config,
    temperature: config.temperature ?? 0.3, // Lower temperature for structured output
  });

  try {
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = response.text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      const lines = jsonText.split('\n');
      const startIndex = lines.findIndex(line => line.includes('```'));
      const endIndex = lines.findIndex((line, idx) => idx > startIndex && line.includes('```'));
      jsonText = lines.slice(startIndex + 1, endIndex).join('\n');
    }

    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    throw new Error('Failed to parse structured JSON response from Gemini');
  }
}

/**
 * Generate embeddings using text-embedding-004 (for RAG)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw new Error(
      error instanceof Error
        ? `Embedding error: ${error.message}`
        : 'Failed to generate embedding'
    );
  }
}

export default {
  generateText,
  generateStructuredJSON,
  generateEmbedding,
};

