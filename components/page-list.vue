<template>
  <fieldset>
    <div
      class="mt-4 divide-y divide-gray-200 dark:divide-gray-700 border-b border-t border-gray-200 dark:border-gray-700">
      <div v-for="(item) in items" :key="item.id" class="relative flex items-start py-4">
        <div class="min-w-0 flex-1 text-sm leading-6">
          <label :for="`item-${item.id}`" class="select-none font-medium text-gray-900 dark:text-gray-50">{{
            sentenceCase(item.name)
          }}</label>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script setup>
import { sentenceCase } from 'change-case';

defineProps({
  items: {
    type: Array,
    default: () => { }
  }
})
</script>