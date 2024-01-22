<script lang="ts" setup>
const breadcrumb = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/home'
}, {
  label: 'User & Groups',
  icon: 'i-heroicons-user-group',
  to: '/auth'
}, {
  label: 'All Groups',
  icon: 'i-heroicons-user-group'
}]
const search = ref('')
const selected = ref([])
const toast = useToast()
const newGroupSlideover = ref(false)


const config = useRuntimeConfig()
const { data: groups, pending: pending, refresh, error } = useFetch(config.public.API_BASE_URL + '/groups/', {
  query: { search },
  watch: [search]
})
const columns = [{
  key: 'name',
  label: 'Group name'
}, {
  key: 'permissions',
  label: 'Permissions'
}, {
  key: 'total_users',
  label: 'Total Users'
},
{
  key: 'actions'
}
];
const action = (row) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    // click: () => console.log('Edit', row.id)
  }, {
    label: 'View',
    icon: 'i-heroicons-document-duplicate-20-solid',
    click: () => navigateTo('/auth/groups/' + row.id)
  }], [ {
    label: 'Add User',
    icon: 'i-heroicons-arrow-right-circle-20-solid',
    click: () => emit('addToGroup', row.id)
  },
  {
    label: 'Add permission',
    icon: 'i-heroicons-arrow-right-circle-20-solid',
    click: () => emit('addPermission', row.id)
  }
  ], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => emit('delete', row.id)
  }]
]

const addGroup = () => {
  newGroupSlideover.value = true
}

const groupCreated = () => {
  refresh()
  newGroupSlideover.value = false
}

</script>

<template>
  <section>
    <UBreadcrumb :links="breadcrumb" />
    <UPageHeader headline="Settings" title="ERP Groups" description="Manage groups of the ERP" />
    <UPageBody>
      <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 justify-between">
        <UInput v-model="search" placeholder="search groups..." />
        <UButton icon="i-heroicons-user-plus" label="Add Group" @click="addGroup" />
      </div>
      <TableSkeleton v-if="pending" />
      <div v-else-if="error" class="w-full h-96 flex flex-col justify-center items-center">
        <UIcon name="i-heroicons-exclamation-triangle" class=" h-36 w-36 animate-pulse font-thin text-rose-500" />
        {{ error }}
      </div>
      <UTable v-else v-model="selected" :rows="groups.data" :columns="columns">
        <template #name-data="{ row }">
          <p class="prose prose-lg dark:prose-invert font-semibold tracking-wider">
            {{ `${row.name}` }}
          </p>
          <p class="text-xs">
            Total Users {{ `${row.total_users}` }}
          </p>
        </template>


        <template #permissions-data="{ row }">
          <div class="flex gap-2 flex-wrap">
            <UBadge
              v-for="permission in row.permissions" :key="permission.id" :label="permission.name" color="white"
              variant="outline"
            />
          </div>
        </template>
        <template #actions-data="{ row }">
          <UDropdown :items="action(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-vertical-20-solid" />
          </UDropdown>
        </template>
      </UTable>
    </UPageBody>
    <USlideover v-model="newGroupSlideover">
      <NewGroup @user-created="groupCreated" />
    </USlideover>
  </section>
</template>

<style scoped></style>
