<template>
  <div class="page-padding">
    <dates-header />
    <section class="mt-10 mb-16 space-y-4 overflow-y-auto">
      <!-- v-for="item in foodDiary.logInReverseChrono"
      :key="item.id" -->
      <DiaryEntryCard
        v-for="item in foodDiary.logInReverseChrono"
        :key="item.id"
        :entry="item"
      />
    </section>
  </div>
</template>

<script setup>
import DiaryEntryCard from "~/components/DiaryEntryCard.vue";
import { useFoodDiaryStore } from "@/stores/foodDiary";
import DatesHeader from "~/components/DatesHeader.vue";
const foodDiary = useFoodDiaryStore();
</script>
