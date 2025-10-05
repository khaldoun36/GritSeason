<template>
  <nav
    v-show="route.name !== 'onboarding'"
    class="fixed right-0 bottom-0 left-0 flex items-center justify-between border-t border-white/8 px-4 pt-1.5 pb-[4vh] backdrop-blur-lg"
  >
    <NuxtLink
      to="/"
      class="grid size-12 place-items-center-safe rounded-lg text-zinc-400 transition-transform active:scale-97"
    >
      <Icon name="ph:house" size="24px" />
      <span class="sr-only">Home</span>
    </NuxtLink>
    <NuxtLink
      to="/food-diary"
      class="grid size-12 place-items-center-safe rounded-lg text-zinc-400 transition-transform active:scale-97"
    >
      <Icon name="ph:cookie" size="24px" />
      <span class="sr-only">Food diary</span>
    </NuxtLink>
    <NuxtLink
      to="/"
      class="grid size-12 place-items-center-safe rounded-lg bg-white/8 text-zinc-200 transition-transform active:scale-97"
    >
      <Icon name="ph:plus" size="24px" />
      <span class="sr-only">Add new food</span>
    </NuxtLink>
    <NuxtLink
      to="/"
      class="grid size-12 place-items-center-safe rounded-lg text-zinc-400 transition-transform active:scale-97"
    >
      <Icon name="ph:notebook" size="24px" />
      <span class="sr-only">emails</span>
    </NuxtLink>
    <NuxtLink
      to="/"
      class="grid size-12 place-items-center-safe rounded-lg text-zinc-400 transition-transform active:scale-97"
    >
      <Icon name="ph:chart-line" size="24px" />
      <span class="sr-only">profile</span>
    </NuxtLink>
  </nav>
</template>

<script setup>
const route = useRoute();
</script>

<style scoped>
.router-link-active,
.router-link-exact-active {
  color: var(--color-zinc-200);
}
</style>
