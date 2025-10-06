<script setup lang="ts">
import { format } from "date-fns";

// Define the shape of the expected prop for type safety
interface FoodLogEntry {
  id: string | number;
  timestamp: Date | number;
  names: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

defineProps<{
  entry: FoodLogEntry;
}>();
</script>

<template>
  <article class="rounded-lg border border-white/8 bg-zinc-800 p-4 shadow-2xs">
    <time
      class="block text-end text-base font-medium text-zinc-400"
      :datetime="entry.timestamp.toString()"
    >
      {{ format(entry.timestamp, "h:mm aaa") }}
    </time>

    <ul class="mt-3 list-disc space-y-1.5 pl-4">
      <li
        v-for="(foodItem, index) in entry.names"
        :key="index"
        class="text-base font-medium text-zinc-200"
      >
        {{ foodItem }}
      </li>
    </ul>

    <div class="mt-4 grid grid-cols-[1.25fr_1fr_1fr_1fr] gap-2">
      <p
        class="rounded-lg border-[0.5px] border-white/8 bg-zinc-700 py-2 text-center"
      >
        <span class="block text-xs font-semibold text-zinc-400">Calories</span>
        <span class="text-base font-medium text-zinc-200">{{
          entry.calories
        }}</span>
        <span class="text-xs font-semibold text-zinc-400"> Kcal</span>
      </p>

      <p
        class="rounded-lg border border-lime-100/8 bg-lime-900/40 py-2 text-center"
      >
        <span class="block text-xs font-semibold text-zinc-400">Protein</span>
        <span class="text-base font-medium text-zinc-200">{{
          entry.protein
        }}</span>
        <span class="text-xs font-semibold text-zinc-400"> g</span>
      </p>

      <p
        class="rounded-lg border border-amber-100/8 bg-amber-900/40 py-2 text-center"
      >
        <span class="block text-xs font-semibold text-zinc-400">Carbs</span>
        <span class="text-base font-medium text-zinc-200">{{
          entry.carbs
        }}</span>
        <span class="text-xs font-semibold text-zinc-400"> g</span>
      </p>

      <p
        class="rounded-lg border border-sky-100/8 bg-sky-900/40 py-2 text-center"
      >
        <span class="block text-xs font-semibold text-zinc-400">Fats</span>
        <span class="text-base font-medium text-zinc-200">{{
          entry.fats
        }}</span>
        <span class="text-xs font-semibold text-zinc-400"> g</span>
      </p>
    </div>
  </article>
</template>
