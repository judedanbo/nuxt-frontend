<script lang="ts" setup>
import { capitalCase } from 'change-case'

const breadcrumb = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/home'
}, {
  label: 'User & Groups',
  icon: 'i-heroicons-user-group',
  to: '/auth'
}, {
  label: 'All groups',
  icon: 'i-heroicons-user-group',
  to: '/auth/users/'
},
{
  label: 'User',
  icon: 'i-heroicons-user-group',
  to: '/auth/users/'
}
]
const config = useRuntimeConfig()

const route = useRoute()
const selectedUsers = ref([])
const {
  data: group,
  pending,
  error,
  refresh,
} = await useFetch(
  config.public.API_BASE_URL +
  '/groups/' +
  route.params.id +
  '/',
  {
    lazy: true,
    server: false,
  }
)
const editgroupSlider = ref(false)
const openEditgroupSlider = () => {
  editgroupSlider.value = true
}
const update = () => {
  editgroupSlider.value = false
  refresh()
}
const openAddUserModel  = ref(false)
const openAddPermissionModel  = ref(false)
const openDeleteGroupModel  = ref(false)
const addPermission = () => {
  openAddUserModel.value = true
}
const addUser = () => {
  openAddPermissionModel.value = true
}
const deleteGroup = () => {
  openDeleteGroupModel.value = true
}
</script>

<template>
  <section>
    <UBreadcrumb :links="breadcrumb" />
    <div v-if="pending" class="w-full h-96 flex flex-col justify-center items-center">
      <UIcon name="i-heroicons-arrow-path" class=" h-36 w-36 animate-spin font-thin text-green-500 dark:text-green-100" />
    </div>
    <div v-else-if="error" class="w-full h-96 flex flex-col justify-center items-center">
      <UIcon name="i-heroicons-exclamation-triangle" class=" h-36 w-36 animate-pulse font-thin text-rose-500" />
      {{ error }}
    </div>
    <div v-else>
      <UPageHeader headline="Settings" :title="group.name " />

      <UPageBody>
        <div class=" flex gap-3 justify-end items-center">
          <div class="space-x-4">
            <UButton
              size="xl" :label="'Edit ' + group.name" variant="outline" icon="i-heroicons-user-group" color="white"
              @click="openEditgroupSlider"
            />
          </div>
          <GroupMenu @add-permission="addPermission" @add-user="addUser" @delete-group="deleteGroup" />
        </div>
        <UPageCard title="Users" class="mt-4">
          <!-- {{ group.users }} -->
          <UTable :rows="group.users" :empty-state="{ icon: 'i-heroicons-user-group', label: 'No users.' }" />
          <!-- <PageList :items="group.users" /> -->
          <template #is_active-data="{ row }">
            <UToggle v-model="row.is_active" size="xs" color="green" disabled="true" />
            row
          </template>
        </UPageCard>
        <UPageCard title="Permissions" class="mt-4">
          <PageList :items="group.permissions" />
        </UPageCard>
      </UPageBody>
    </div>
    <USlideover v-model="editgroupSlider">
      <!-- <group-update :group="group" @group-updated="update" /> -->
    </USlideover>
    <UModal v-model="openAddUserModel">
      <UPageCard 
        title="Add User to group"
        description="Add new user to the group"
        icon="i-heroicons-user-plus"
      >
        <UForm :state="state" class="space-y-4 mt-10" @submit="handleSubmit">
          <UFormGroup
            label="Select Users" name="users"
          >
            <USelectMenu
              v-model="selectedUsers" 
              multiple :options="group.users" searchable searchable-placeholder="Search permissions..." clear-search-on-close placeholder="Select permissions"
            />
          </UFormGroup>
          <UButton class="mt-20" type="submit">
          Submit
        </UButton>
        </UForm>
      </UPageCard>
    </UModal>
    <UModal v-model="openAddPermissionModel">
      <UPageCard 
        title="Add Permission to group"
        description="Add new permission  to the group"
        icon="i-heroicons-key"
      />
    </UModal>
    <UModal v-model="openDeleteGroupModel">
      <UPageCard 
        title="Add User to group"
        description="Delete this the group"
        icon="i-heroicons-trash"
      />
    </UModal>
  </section>
</template>

<style scoped></style>
