import { defineStore } from "pinia";

// Interface for a single food entry for type safety
export interface FoodEntry {
  id: string;
  names: string[]; // Changed from 'name: string' to 'names: string[]'
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: number; // Stored as a UTC timestamp
}

// Interface for the store's state
interface FoodDiaryState {
  foodLog: FoodEntry[];
  selectedDate: number; // Timestamp for the start of the selected day
}

export const useFoodDiaryStore = defineStore("foodDiary", {
  // State: The single source of truth for our data
  state: (): FoodDiaryState => {
    // Timestamps for different days relative to Sep 30, 2025
    const todayLunch = new Date("2025-09-30T13:00:00Z").getTime();
    const todaySnack = new Date("2025-09-30T16:00:00Z").getTime();
    const yesterdayDinner = new Date("2025-09-29T19:30:00Z").getTime();
    const yesterdayLunch = new Date("2025-09-29T12:45:00Z").getTime();
    const tomorrowBreakfast = new Date("2025-10-01T08:30:00Z").getTime();

    return {
      // Default selectedDate to the start of today (Sep 30, 2025)
      selectedDate: new Date().setHours(0, 0, 0, 0),
      foodLog: [
        // --- September 29, 2025 (Yesterday) ---
        {
          id: "yesterday-1",
          names: ["Salmon Fillet"], // Now an array
          calories: 206,
          protein: 22,
          carbs: 0,
          fats: 12,
          timestamp: yesterdayDinner,
        },
        {
          id: "yesterday-2",
          names: ["Quinoa Salad", "Greek Yogurt"], // Combined entry
          calories: 280, // 180 + 100
          protein: 23, // 6 + 17
          carbs: 31, // 25 + 6
          fats: 7, // 7 + 0
          timestamp: yesterdayLunch,
        },

        // --- September 30, 2025 (Today) ---
        {
          id: "today-1",
          names: ["Chicken Breast", "Brown Rice"], // Combined entry
          calories: 276, // 165 + 111
          protein: 33.6, // 31 + 2.6
          carbs: 23, // 0 + 23
          fats: 4.5, // 3.6 + 0.9
          timestamp: todayLunch,
        },
        {
          id: "today-3",
          names: ["Apple"], // Now an array
          calories: 95,
          protein: 0.5,
          carbs: 25,
          fats: 0.3,
          timestamp: todaySnack,
        },

        // --- October 1, 2025 (Tomorrow) ---
        {
          id: "tomorrow-1",
          names: ["Oatmeal", "Banana"], // Combined entry
          calories: 255, // 150 + 105
          protein: 6.3, // 5 + 1.3
          carbs: 54, // 27 + 27
          fats: 2.9, // 2.5 + 0.4
          timestamp: tomorrowBreakfast,
        },
      ],
    };
  },

  // Getters: No changes needed here, they work as before.
  getters: {
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

  // Actions: Updated 'addFood' to align with the new interface.
  actions: {
    setSelectedDate(date: Date) {
      this.selectedDate = date.setHours(0, 0, 0, 0);
    },
    /**
     * Adds a new food entry to the log.
     * @param food - An object with names (array), calories, and macro details.
     */
    addFood(food: Omit<FoodEntry, "id" | "timestamp">) {
      const newEntry: FoodEntry = {
        ...food,
        id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
        timestamp: Date.now(),
      };
      this.foodLog.push(newEntry);
    },
    removeFood(foodId: string) {
      this.foodLog = this.foodLog.filter((entry) => entry.id !== foodId);
    },
  },
});
