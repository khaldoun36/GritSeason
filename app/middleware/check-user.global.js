// middleware/check-user.global.js
import { getUserDataFromDB } from "@/utils/userProfileDb";

export default defineNuxtRouteMiddleware(async (to) => {
  // Only run on client (IndexedDB is browser-only)
  if (import.meta.server) return;

  try {
    const userData = await getUserDataFromDB();

    if (!userData && to.path !== "/onboarding") {
      // No user data → force onboarding
      return navigateTo("/onboarding");
    }

    if (userData && to.path === "/onboarding") {
      // Already has user data → prevent seeing onboarding
      return navigateTo("/");
    }
  } catch (err) {
    console.error("Error checking user data:", err);
    // fallback: send to onboarding
    if (to.path !== "/onboarding") {
      return navigateTo("/onboarding");
    }
  }
});
