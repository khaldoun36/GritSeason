// stores/ui.ts
import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {
  // State
  state: () => ({
    isOpen: false,
  }),
  // Actions
  actions: {
    toggleDrawer() {
      this.isOpen = !this.isOpen;
    },
  },
});
