<template>
  <button
    class="flex h-8 select-none items-center rounded-md border-2 border-solid border-transparent py-0 px-4 text-base font-medium leading-4 tracking-tighter text-white no-underline outline-none"
    :class="
      primary
        ? 'bg-blue-500 focus:border-black/30 disabled:bg-black/30'
        : secondary
        ? 'border-black/80 bg-white tracking-normal text-black/80 focus:border-blue-500 disabled:bg-black/30 disabled:text-black/30'
        : tertiary
        ? 'border-1 cursor-pointer border-transparent bg-transparent p-0 font-normal tracking-normal text-blue-500 focus:underline disabled:cursor-default disabled:text-black/30'
        : ''
    "
  >
    <slot> Button </slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  primary: Boolean,
  secondary: Boolean,
  tertiary: Boolean,
  destructive: Boolean,
});
</script>
