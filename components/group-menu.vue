<script lang="ts" setup>

const emit = defineEmits(['addUser','addPermission','deleteGroup'])
const links = [
  [
    {
      label: 'Add Users',
      icon: 'i-heroicons-user-plus',
      click: ()=> {emit('addUser')}
    }, {
      label: 'Add permission',
      icon: 'i-heroicons-key',
      click: ()=> {emit('addPermission')}
    }, 
  ],
  [
    {
      label: 'Delete',
      icon: 'i-heroicons-trash',
      class: 'text-red-500',
       click: ()=> {emit('deleteGroup')}
    },
    
  ]
]
</script>

<template>
  <UPopover mode="hover">
    <UButton color="white" trailing-icon="i-heroicons-ellipsis-vertical" />

    <template #panel>
      <div class="p-4">
        <UVerticalNavigation :links="links" />
      </div>
    </template>
  </UPopover>
</template>

<style scoped></style>
