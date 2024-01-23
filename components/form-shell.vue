
<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'Create New'
  }
})
</script>

<template>
  <section>
    <div class="w-full bg-rose-500 dark:bg-gray-500 h-20" />
    <p
      class="prose prose-2xl dark:prose-invert -mt-10 bg-rose-900 dark:bg-gray-500 text-rose-50 dark:text-white rounded-r-full w-fit px-10 py-4"
    >
      {{ title }}
    </p>
    <div class="px-10">
      <slot />
    </div>
  </section>
</template>

