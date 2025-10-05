<template>
  <article
    class="rounded-lg bg-white p-4 shadow-2xs outline outline-neutral-950/8"
  >
    <h3 class="text-base font-medium text-neutral-500">Macros</h3>
    <VueApexCharts
      type="radialBar"
      :options="chartOptions"
      :series="consumedMacrosPercentae"
    />

    <div class="divide-y divide-neutral-950/8">
      <p class="flex items-baseline-last justify-between gap-8 pb-2">
        <span class="label-sm text-neutral-500">Carbohydrates</span>
        <span
          :class="
            twMerge(
              'text-base font-medium text-lime-500',
              foodDiary.totalCarbs / userData.macros.carbs > 1 &&
                'text-red-500',
            )
          "
        >
          {{ foodDiary.totalCarbs + "g" + " / " + userData.macros.carbs }}
        </span>
      </p>
      <p class="flex items-baseline-last justify-between gap-8 py-2">
        <span class="label-sm text-neutral-500">Protein</span>
        <span
          :class="
            twMerge(
              'text-base font-medium text-amber-500',
              foodDiary.totalProtein / userData.macros.protein > 1 &&
                'text-red-500',
            )
          "
        >
          {{ foodDiary.totalProtein + "g" + " / " + userData.macros.protein }}
        </span>
      </p>
      <p class="flex items-baseline-last justify-between gap-8 pt-2">
        <span class="label-sm text-neutral-500">Fat</span>
        <span
          :class="
            twMerge(
              'text-base font-medium text-sky-500',
              foodDiary.totalFats / userData.macros.fats > 1 && 'text-red-500',
            )
          "
        >
          {{ foodDiary.totalFats + "g" + " / " + userData.macros.fats }}
        </span>
      </p>
    </div>
  </article>
</template>

<script setup>
import { twMerge } from "tailwind-merge";
import VueApexCharts from "vue3-apexcharts";
import { useFoodDiaryStore } from "@/stores/foodDiary";
import { useUserDataStore } from "@/stores/userData";

const foodDiary = useFoodDiaryStore();
const userData = useUserDataStore();

const consumedMacrosPercentae = computed(() => {
  return [
    Math.round((foodDiary.totalCarbs / userData.macros.carbs) * 100),
    Math.round((foodDiary.totalProtein / userData.macros.protein) * 100),
    Math.round((foodDiary.totalFats / userData.macros.fats) * 100),
  ];
});

const chartOptions = computed(() => ({
  chart: {
    type: "radialBar",
    sparkline: { enabled: true }, // Minimalist look
  },
  plotOptions: {
    radialBar: {
      hollow: { size: "25%" },
      track: {
        background: [
          "var(--color-lime-50)",
          "var(--color-amber-50)",
          "var(--color-sky-50)",
        ], // Dynamic track colors
        strokeWidth: "100%",
        margin: 5,
      },
      dataLabels: { show: false }, // Hide center percentage
    },
  },
  colors: [
    "var(--color-lime-500)",
    "var(--color-amber-500)",
    "var(--color-sky-500)",
  ], // Dynamic ring colors
  stroke: {
    lineCap: "round",
  },
  labels: ["p", "c", "f"], // For tooltips
}));
</script>
