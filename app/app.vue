<template>
  <div class="px-4 py-10">
    <VitePwaManifest />
    <div
      v-for="n in 100"
      :key="n"
      class="w-full h-10 rounded-lg outline outline-black/10 mt-10"
    />
  </div>
</template>
