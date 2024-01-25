<script lang="ts" setup>
defineProps({
  errors: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div>
    <p v-for="error in errors" :key="error" class="text-xs text-red-900 dark:text-red-300 mt-1 pl-2">
      {{ error }}
    </p>
  </div>
</template>

<style scoped></style>
