import { defineStore } from "pinia";
import { saveUserDataToDB, getUserDataFromDB } from "@/utils/userProfileDb";

/**
 * Interface defining the shape of the user data state.
 */
interface UserDataState {
  currentWeight: number | null;
  goalWeight: number | null;
  height: number | null;
  gender: string | null;
  activityLevel: string | null;
  age: number | null;
  isLoading: boolean;
}

/**
 * Interface for the payload of the updateDetails action.
 */
interface UserDetailsPayload {
  currentWeight: number;
  goalWeight: number;
  height: number;
  gender: string;
  activityLevel: string;
  age: number;
}

// Activity level multipliers for TDEE calculation
const activityMultipliers: { [key: string]: number } = {
  "Little or no exercise": 1.2,
  "Light: 1–3 workouts per week": 1.375,
  "Moderate: 3–5 workouts per week": 1.55,
  "Active: 6–7 workouts per week": 1.725,
  "Very Active: Daily intense exercise or physical job": 1.9,
};

/**
 * This Pinia store holds the user's physical details and calculates metabolic rates.
 */
export const useUserDataStore = defineStore("userData", {
  state: (): UserDataState => ({
    currentWeight: null,
    goalWeight: null,
    height: null,
    gender: null,
    activityLevel: null,
    age: null,
    isLoading: true, // Start in a loading state by default
  }),

  actions: {
    /**
     * Updates the store with validated data and saves it to the database.
     */
    async updateDetails(payload: UserDetailsPayload) {
      // Update the state in memory
      this.currentWeight = payload.currentWeight;
      this.goalWeight = payload.goalWeight;
      this.height = payload.height;
      this.gender = payload.gender;
      this.activityLevel = payload.activityLevel;
      this.age = payload.age;

      // Save the entire state to the database
      // The 'id' will be added by the db function
      try {
        await saveUserDataToDB(this.$state);
      } catch (error) {
        console.error("Failed to save user data:", error);
      }
    },

    /**
     * Loads user data from IndexedDB into the store.
     */
    // async loadUserData() {
    //   try {
    //     const userData = await getUserDataFromDB();
    //     // If data exists in the database, update the store's state
    //     if (userData) {
    //       this.$patch(userData);
    //     }
    //   } catch (error) {
    //     console.error("Failed to load user data:", error);
    //   }
    // },
    async loadUserData() {
      this.isLoading = true;
      try {
        const userData = await getUserDataFromDB();
        if (userData) {
          this.$patch(userData);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  getters: {
    /**
     * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation.
     * @returns {number} The calculated BMR, or 0 if data is incomplete.
     */
    bmr(state): number {
      const { goalWeight, height, age, gender } = state;

      if (!goalWeight || !height || !age || !gender) {
        return 100;
      }

      // Mifflin-St Jeor Equation
      const baseCalculation = 10 * goalWeight + 6.25 * height - 5 * age;

      let bmrResult = 0;
      if (gender === "Male") {
        bmrResult = baseCalculation + 5;
      } else if (gender === "Female") {
        bmrResult = baseCalculation - 161;
      }

      return Math.round(bmrResult);
    },

    /**
     * Calculates Total Daily Energy Expenditure (TDEE).
     * @returns {number} The calculated TDEE, or 0 if data is incomplete.
     */
    tdee(): number {
      if (!this.bmr || !this.activityLevel) {
        return 0;
      }

      const multiplier = activityMultipliers[this.activityLevel];
      if (!multiplier) {
        return 0;
      }

      return Math.round(this.bmr * multiplier);
    },

    /**
     * Adjusts TDEE based on weight goal (surplus for gain, deficit for loss).
     * @returns {number} The target daily calorie intake.
     */
    goalCalories(): number {
      if (!this.tdee || !this.goalWeight || !this.currentWeight) {
        return 0;
      }

      if (this.goalWeight === this.currentWeight) {
        return this.tdee;
      } else if (this.goalWeight >= this.currentWeight) {
        // 10% calorie surplus for weight gain
        return Math.round(this.tdee * 1.1);
      } else {
        // 10% calorie deficit for weight loss
        return Math.round(this.tdee * 0.9);
      }
    },

    /**
     * ✅ NEW: Calculates macronutrient needs in grams based on user-defined rules.
     * @returns {{protein: number, carbs: number, fats: number}} An object containing the grams for each macro.
     */
    macros(state): { protein: number; carbs: number; fats: number } {
      // Ensure all necessary data is available before calculating
      if (!this.goalCalories || !state.currentWeight || !state.activityLevel) {
        return { protein: 0, carbs: 0, fats: 0 };
      }

      const multiplier = activityMultipliers[state.activityLevel];
      if (!multiplier) {
        return { protein: 0, carbs: 0, fats: 0 };
      }

      // 1. Calculate Protein needs based on activity level
      const proteinMultiplier = multiplier <= 1.2 ? 1.2 : 1.8;
      const proteinGrams = state.currentWeight * proteinMultiplier;
      const proteinCalories = proteinGrams * 4;

      // 2. Determine remaining calories after accounting for protein
      const remainingCalories = this.goalCalories - proteinCalories;

      // Handle edge case where protein needs exceed goal calories
      if (remainingCalories < 0) {
        return { protein: Math.round(proteinGrams), carbs: 0, fats: 0 };
      }

      // 3. Split remaining calories between Carbs (40 parts) and Fats (30 parts)
      const totalParts = 40 + 30;
      const carbCalories = remainingCalories * (40 / totalParts);
      const fatCalories = remainingCalories * (30 / totalParts);

      // 4. Convert calories to grams (Carbs/Protein: 4 cal/g, Fats: 9 cal/g)
      const carbGrams = carbCalories / 4;
      const fatGrams = fatCalories / 9;

      return {
        protein: Math.round(proteinGrams),
        carbs: Math.round(carbGrams),
        fats: Math.round(fatGrams),
      };
    },
  },
});
