// server/api/generate.post.ts

import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// Get the API key securely from server-side environment variables
const apiKey = useRuntimeConfig().openaiApiKey;

if (!apiKey) {
  throw new Error("Missing OpenAI API key on the server.");
}

const openai = createOpenAI({
  apiKey: apiKey,
});

const nutritionSchema = z.object({
  names: z.array(z.string()).describe("Names of all detected food items"),
  calories: z.number().describe("AGGREGATE total calories"),
  protein: z.number().describe("AGGREGATE total protein in grams"),
  carbs: z.number().describe("AGGREGATE total carbohydrates in grams"),
  fats: z.number().describe("AGGREGATE total fats in grams"),
});

const systemPrompt = `You are a nutrition data API. Your function is to parse a food description and return a single, valid JSON object with the estimated – to the best of your knowledge – nutritional information.

**Rules:**
- Your entire response MUST be the raw JSON object and nothing else.
- Do NOT include markdown formatting like \`\`\`json.
- Do NOT include any explanations or conversational text.
- Aggregate the nutritional values for all food items mentioned.

**JSON Output Schema:**
- \`names\`: An array of strings identifying each food item with their quantity.
- \`calories\`: Total calories as a number.
- \`protein\`: Total protein in grams as a number.
- \`carbs\`: Total carbohydrates in grams as a number.
- \`fats\`: Total fats in grams as a number.

You will receive the \`id\` and \`timestamp\` from another source, so you must NOT include them in your JSON output.`;

export default defineEventHandler(async (event) => {
  // Get the user's prompt from the request body
  const { prompt } = await readBody(event);

  if (!prompt) {
    throw createError({
      statusCode: 400,
      statusMessage: "Prompt is required",
    });
  }

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: nutritionSchema,
      system: systemPrompt,
      prompt: prompt,
    });
    return object;
  } catch (error) {
    console.error("Error from OpenAI:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate nutrition data.",
    });
  }
});
