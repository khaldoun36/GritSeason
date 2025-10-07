// stores/foodDiary.js
import { defineStore } from "pinia";
import {
  saveFoodEntryToDB,
  getFoodLogFromDB,
  removeFoodEntryFromDB,
} from "@/utils/foodDiaryDB"; // 👈 Import new DB functions

export interface FoodEntry {
  id: string;
  names: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: number;
}

interface FoodDiaryState {
  foodLog: FoodEntry[];
  selectedDate: number;
  isLoading: boolean; // 👈 Add a loading state
}

export const useFoodDiaryStore = defineStore("foodDiary", {
  state: (): FoodDiaryState => ({
    foodLog: [], // 👈 Start with an empty log
    selectedDate: new Date().setHours(0, 0, 0, 0),
    isLoading: true, // 👈 Start in loading state
  }),

  getters: {
    // ... your getters remain unchanged
    entriesForSelectedDate(state): FoodEntry[] {
      const startOfDay = state.selectedDate;
      const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;
      return state.foodLog.filter(
        (entry) => entry.timestamp >= startOfDay && entry.timestamp <= endOfDay,
      );
    },
    logInReverseChrono(): FoodEntry[] {
      return [...this.entriesForSelectedDate].sort(
        (a, b) => b.timestamp - a.timestamp,
      );
    },
    totalCalories(): number {
      return this.entriesForSelectedDate.reduce(
        (total, entry) => total + entry.calories,
        0,
      );
    },
    totalProtein(): number {
      return this.entriesForSelectedDate.reduce(
        (total, entry) => total + entry.protein,
        0,
      );
    },
    totalCarbs(): number {
      return this.entriesForSelectedDate.reduce(
        (total, entry) => total + entry.carbs,
        0,
      );
    },
    totalFats(): number {
      return this.entriesForSelectedDate.reduce(
        (total, entry) => total + entry.fats,
        0,
      );
    },
  },

  actions: {
    /**
     * ✅ NEW: Loads the entire food log from IndexedDB into the store.
     */
    async loadFoodLog() {
      this.isLoading = true;
      try {
        const log = await getFoodLogFromDB();
        this.foodLog = log || []; // Ensure foodLog is an array
      } catch (error) {
        console.error("Failed to load food log:", error);
      } finally {
        this.isLoading = false;
      }
    },

    setSelectedDate(date: Date) {
      this.selectedDate = date.setHours(0, 0, 0, 0);
    },

    /**
     * Adds a food entry to the state and saves it to the database.
     */
    async addFood(food: Omit<FoodEntry, "id" | "timestamp">) {
      // 👇 Create a guaranteed plain object by deep cloning the input.
      const newEntry: FoodEntry = {
        ...JSON.parse(JSON.stringify(food)),
        id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
        timestamp: Date.now(),
      };

      // It's generally safer to save to the DB *first*, then update the state.
      try {
        await saveFoodEntryToDB(newEntry);
        // On success, push the (now plain) entry to the state.
        this.foodLog.push(newEntry);
      } catch (error) {
        console.error("Failed to save food entry:", error);
        // Handle the error, maybe show a notification to the user.
      }
    },

    /**
     * Removes a food entry from the state and the database.
     */
    async removeFood(foodId: string) {
      this.foodLog = this.foodLog.filter((entry) => entry.id !== foodId);

      try {
        await removeFoodEntryFromDB(foodId); // 👈 Remove from DB
      } catch (error) {
        console.error("Failed to remove food entry:", error);
      }
    },
  },
});
