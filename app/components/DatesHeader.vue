<template>
  <header class="dates-header sticky top-[41px] left-0 space-y-3 pb-5.5">
    <h1 class="text-3xl font-semibold text-zinc-200">
      {{ format(selectedDate, "EEE") }}
    </h1>

    <div class="relative grid grid-cols-7 gap-2">
      <button
        v-for="day in week"
        :key="day"
        :class="
          twMerge(
            'flex aspect-[3/4] flex-col items-center justify-center gap-0.5 rounded-lg text-center outline-[1.75px] outline-neutral-950/10',
            isSameDay(selectedDate, day) && 'bg-white/8 outline-white/10',
          )
        "
        @click="handleDateChange(day)"
      >
        <span
          :class="
            twMerge(
              'text-base font-medium text-zinc-200',
              isSameDay(selectedDate, day) && 'text-white',
            )
          "
        >
          {{ format(day, "d") }}</span
        >
        <span
          :class="
            twMerge(
              'text-sm font-medium text-zinc-400',
              isSameDay(selectedDate, day) && 'text-neutral-300',
            )
          "
        >
          {{ format(day, "eee") }}
        </span>
      </button>
    </div>
  </header>
</template>

<script setup>
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
} from "date-fns";

import { twMerge } from "tailwind-merge";
import { useFoodDiaryStore } from "@/stores/foodDiary";

const foodDiary = useFoodDiaryStore();

const currentDate = new Date();

const selectedDate = ref(new Date());

// Get the start of the week (Monday)
const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

// Get the end of the week (Sunday)
const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

// Create an array of all the dates in the week's interval
const week = eachDayOfInterval({
  start: weekStart,
  end: weekEnd,
});

const handleDateChange = (day) => {
  selectedDate.value = day;
  foodDiary.setSelectedDate(selectedDate.value);
};
</script>

<style scoped>
@reference "@/assets/css/main.css";

.dates-header::after {
  @apply absolute -top-10 -right-4 bottom-0 -left-4 -z-1 h-[calc(100%+40px)] border-b border-neutral-950/8 shadow-2xs backdrop-blur-lg content-[""];
}
</style>
