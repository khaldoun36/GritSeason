// plugins/load-user-data.client.ts

import { useUserDataStore } from "@/stores/userData"; // Adjust path if needed

export default defineNuxtPlugin(async (nuxtApp) => {
  // Pinia is accessible through nuxtApp.$pinia

  // We need to ensure we are on the client-side, although the .client suffix
  // already does this. It's a good extra check.
  if (process.server) {
    return;
  }

  // Get an instance of your store
  const userDataStore = useUserDataStore();

  // Call the action to load data. The plugin will wait for this to
  // complete before moving on to mounting the app.
  await userDataStore.loadUserData();
});
