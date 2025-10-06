<template>
  <UDrawer
    v-model:open="uiStore.isOpen"
    class="min-h-[80vh] px-4 pb-4"
    title="Log Your Meal"
    description="Add the food you’ve just eaten to keep track of your meals."
  >
    <template #content>
      <div class="space-y-8 pt-4">
        <UChatPrompt
          v-model="input"
          placeholder="e.g., 2 eggs and a slice of toast with butter"
          variant="subtle"
          @submit="handleSubmit"
          class="h-20"
        >
          <UButton
            icon="i-heroicons-paper-airplane-20-solid"
            color="primary"
            variant="solid"
            size="xl"
            :disabled="!input || isLoading"
            @click="handleSubmit"
          />
        </UChatPrompt>
        <div v-if="isLoading" class="flex items-center justify-center pt-4">
          <p class="text-gray-500">Generating...</p>
        </div>

        <div v-if="responseJson" class="space-y-3">
          <DiaryEntryCard :entry="responseJson" />
          <UButton
            label="Log food"
            size="xl"
            class="w-full"
            block
            @click="logFood"
          />
        </div>
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { useFoodDiaryStore } from "@/stores/foodDiary";
import { useUiStore } from "@/stores/ui";
import { ref } from "vue";
import DiaryEntryCard from "./DiaryEntryCard.vue";

interface FoodLogEntry {
  id: string | number;
  timestamp: Date | number;
  names: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const uiStore = useUiStore();
const foodDiaryStore = useFoodDiaryStore();

const input = ref("");
const responseJson = ref<FoodLogEntry | null>(null);
const isLoading = ref(false);

/**
 * Fetches food data from the API based on user input
 * and displays it for confirmation.
 */
const handleSubmit = async () => {
  if (!input.value) return;
  isLoading.value = true;
  responseJson.value = null; // Clear previous result before new fetch

  try {
    const result = await $fetch("/api/generate", {
      method: "POST",
      body: { prompt: input.value },
    });

    const completeEntry: FoodLogEntry = {
      ...result,
      id: Date.now(),
      timestamp: new Date(),
    };

    responseJson.value = completeEntry;
  } catch (error) {
    console.error("Error fetching food data:", error);
    // Consider adding user-facing error feedback here
  } finally {
    isLoading.value = false;
  }
};

/**
 * Logs the confirmed food entry to the store,
 * resets the UI, and closes the drawer.
 */
const logFood = () => {
  if (!responseJson.value) return;

  // 1. Add the food to your Pinia store
  foodDiaryStore.addFood(responseJson.value);

  // 2. Reset the input field
  input.value = "";

  // 3. Clear the displayed card
  responseJson.value = null;

  // 4. Close the drawer
  uiStore.isOpen = false;
};
</script>
