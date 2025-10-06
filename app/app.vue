<template>
  <UApp>
    <div class="mx-auto grid min-h-dvh max-w-xl grid-rows-[auto_1fr_auto]">
      <VitePwaManifest />
      <div class="h-px w-full bg-transparent" />
      <NuxtPage />
      <div class="h-px w-full bg-transparent" />
      <LogFood />
      <TapBar />
    </div>
  </UApp>
</template>
<script setup>
import LogFood from "./components/LogFood.vue";
import TapBar from "./components/TapBar.vue";
</script>
