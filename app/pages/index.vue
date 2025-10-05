<template>
  <div
    :class="
      twMerge('page-padding space-y-4', route.name !== 'onboarding' && 'mb-20')
    "
  >
    <DatesHeader />
    <CaloriesCard />
    <MacrosCard />
  </div>
</template>

<script setup>
import DatesHeader from "~/components/DatesHeader.vue";
import CaloriesCard from "~/components/CaloriesCard.vue";
import MacrosCard from "~/components/MacrosCard.vue";
import { twMerge } from "tailwind-merge";

const route = useRoute();
</script>
