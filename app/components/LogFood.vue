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
          placeholder="e.g., 2 eggs and a slice of toast with butter"
          variant="subtle"
          @submit="handleSubmit"
        />
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { useFoodDiaryStore } from "@/stores/foodDiary";
import { useUiStore } from "@/stores/ui";
import { ref } from "vue";

const uiStore = useUiStore();
const foodDiaryStore = useFoodDiaryStore();

const input = ref("");
const responseJson = ref<object | null>(null);
const isLoading = ref(false);

const handleSubmit = async () => {
  if (!input.value.trim()) return;

  isLoading.value = true;
  responseJson.value = null;

  try {
    // Call your own server endpoint
    const result = await $fetch("/api/generate", {
      method: "POST",
      body: { prompt: input.value },
    });

    responseJson.value = result;
    // Assuming the result matches the expected structure
    foodDiaryStore.addFood(result);
  } catch (error) {
    console.error("Error fetching from server route:", error);
    responseJson.value = { error: "Failed to get a response." };
  } finally {
    isLoading.value = false;
  }
};
</script>
