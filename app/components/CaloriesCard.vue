<template>
  <article
    class="space-y-4 rounded-lg bg-zinc-800 p-4 shadow-2xs outline outline-white/8"
  >
    <h3 class="text-base font-medium text-zinc-400">Calories</h3>
    <div class="grid grid-cols-1 grid-rows-1">
      <div class="col-start-1 row-start-1 h-12 w-full rounded-lg bg-zinc-700" />

      <div
        :class="
          twMerge(
            'col-start-1 row-start-1 flex h-12 items-center justify-end rounded-lg bg-zinc-300 pr-4',
            consumedPercentage > 100 && 'bg-red-500',
          )
        "
        :style="{ width: `${consumedPercentage}%` }"
      >
        <span
          v-show="consumedPercentage >= 15"
          class="text-base font-medium text-zinc-800"
          >{{ foodDiary.totalCalories }}
        </span>
      </div>

      <p
        :class="
          twMerge(
            'col-start-1 row-start-1 pt-3 pr-4 text-end text-base font-medium text-zinc-200',
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
