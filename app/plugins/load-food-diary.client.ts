// plugins/load-food-diary.client.ts

import { useFoodDiaryStore } from "@/stores/foodDiary"; // Adjust path if needed

export default defineNuxtPlugin(async (nuxtApp) => {
  // This plugin only runs on the client-side where IndexedDB is available.
  if (process.server) {
    return;
  }

  // Get an instance of the food diary store.
  const foodDiaryStore = useFoodDiaryStore();

  // Call the action to load the food log from the database.
  // The plugin will wait for this action to complete before the app mounts.
  await foodDiaryStore.loadFoodLog();
});
