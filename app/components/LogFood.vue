<template>
  <UDrawer
    v-model:open="uiStore.isOpen"
    class="min-h-[50vh] px-4 pb-4"
    title="Log Your Meal"
    description="Add the food you’ve just eaten to keep track of your meals."
  >
    <template #content>
      <div class="space-y-4 pt-4">
        <div v-if="isLoading" class="text-gray-500">Generating...</div>
        <pre v-if="responseJson" class="rounded-md p-3 text-sm">{{
          responseJson
        }}</pre>

        <UChatPrompt
          v-model="input"
          variant="subtle"
          @submit.prevent="handleSubmit"
        />
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { useFoodDiaryStore } from "@/stores/foodDiary";
import { ref } from "vue";
import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { useUiStore } from "@/stores/ui";

// 1. Configure your AI provider
const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

// 2. Define the Zod schema to match your original prompt
const nutritionSchema = z.object({
  names: z
    .array(z.string())
    .describe("An array containing the names of all detected food items"),
  calories: z
    .number()
    .describe("The AGGREGATE total calories for all food items"),
  protein: z
    .number()
    .describe("The AGGREGATE total protein in grams for all food items"),
  carbs: z
    .number()
    .describe("The AGGREGATE total carbohydrates in grams for all food items"),
  fats: z
    .number()
    .describe("The AGGREGATE total fats in grams for all food items"),
});

// 3. Define the system prompt (your original prompt)
const systemPrompt = `You are an expert nutrition data API. Your sole function is to process a user's food description and return a single, structured JSON object summarizing the nutritional information.

### CRITICAL RULES:
1.  **JSON ONLY:** Your entire response must be a single, raw, valid JSON object.
2.  **NO EXTRA TEXT:** Do not include any explanations, introductory phrases, or markdown formatting like \`\`\`json.
3.  **AGGREGATE VALUES:** Sum the nutritional values for all listed food items.

### JSON OUTPUT FORMAT:
{
  "names": ["<food_item_1>", "<food_item_2>", ...],
  "calories": <int>,
  "protein": <float>,
  "carbs": <float>,
  "fats": <float>
}`;

// 4. Component State
const uiStore = useUiStore();
const input = ref("");
const responseJson = ref<object | null>(null);
const isLoading = ref(false);

const foodDiaryStore = useFoodDiaryStore();

// 5. Handle form submission
const handleSubmit = async () => {
  if (!input.value.trim()) return;

  isLoading.value = true;
  responseJson.value = null;

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: nutritionSchema,
      system: systemPrompt,
      prompt: input.value,
    });
    responseJson.value = object;
    foodDiaryStore.addFood(object);
  } catch (error) {
    console.error("Error generating object:", error);
    responseJson.value = { error: "Failed to get a response." };
  } finally {
    isLoading.value = false;
  }
};
</script>
