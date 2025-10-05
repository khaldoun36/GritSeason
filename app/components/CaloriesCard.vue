<template>
  <article
    class="space-y-4 rounded-lg bg-white p-4 shadow-2xs outline outline-neutral-950/8"
  >
    <h3 class="text-base font-medium text-neutral-500">Calories</h3>
    <div class="grid grid-cols-1 grid-rows-1">
      <div
        class="col-start-1 row-start-1 h-12 w-full rounded-lg bg-neutral-950/8"
      />

      <div
        :class="
          twMerge(
            'col-start-1 row-start-1 flex h-12 items-center justify-end rounded-lg bg-gradient-to-bl from-neutral-950 to-neutral-800 pr-4',
            consumedPercentage > 100 && 'bg-red-500',
          )
        "
        :style="{ width: `${consumedPercentage}%` }"
      >
        <span v-show="consumedPercentage >= 15" class="label-lg text-white"
          >{{ foodDiary.totalCalories }}
        </span>
      </div>

      <p
        :class="
          twMerge(
            'label-lg col-start-1 row-start-1 pt-3 pr-4 text-end text-neutral-800',
            consumedPercentage > 85 && 'text-transparent',
          )
        "
      >
        {{ userData.goalCalories }}
      </p>
    </div>
  </article>
</template>

<script setup>
import { useFoodDiaryStore } from "@/stores/foodDiary";
import { useUserDataStore } from "@/stores/userData";
import { twMerge } from "tailwind-merge";

const foodDiary = useFoodDiaryStore();
const userData = useUserDataStore();

// Calculate the percentage of calories consumed
const consumedPercentage = computed(() => {
  if (userData.goalCalories === 0) return 0; // Avoid division by zero
  return (foodDiary.totalCalories / userData.goalCalories) * 100;
});
</script>
