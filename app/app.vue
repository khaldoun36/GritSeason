<template>
  <UApp>
    <div class="mx-auto grid min-h-dvh max-w-xl grid-rows-[auto_1fr_auto]">
      <VitePwaManifest />
      <div class="h-px w-full bg-transparent" />
      <NuxtPage />
      <div class="h-px w-full bg-transparent" />
      <TapBar />
    </div>
  </UApp>
</template>
<script setup>
import TapBar from "./components/TapBar.vue";
</script>
