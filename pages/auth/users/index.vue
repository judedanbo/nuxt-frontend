<script lang="ts" setup>

const toast = useToast()

const emit = defineEmits(['activate', 'deactivate', 'delete', 'addToGroup', 'addPermission'])

const config = useRuntimeConfig()
const newUserSlideover = ref(false)
const editUserSlider = ref(false)


const search = ref('')

// const { data: users, pending: pending, refresh } = useFetchData('/authentication/userlist/')
const { data: users, pending: pending, refresh, error } = useFetch(config.public.API_BASE_URL + '/authentication/userlist/', {
  query: { search },
  watch: [search]
})
const breadcrumb = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/home'
}, {
  label: 'User & Groups',
  icon: 'i-heroicons-user-group',
  to: '/auth'
}, {
  label: 'All users',
  icon: 'i-heroicons-users'
}]
const columns = [{
  key: 'first_name',
  label: 'Name'
}, {
  key: 'phone_number',
  label: 'Phone Number'
}, {
  key: 'is_active',
  label: 'Active'
}, {
  key: 'groups',
  label: 'Groups'
}, {
  key: 'user_permissions',
  label: 'Additional Permission'
}, {
  key: 'actions'
}]
const action = (row) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => openEditSlideOver(row)
  }, {
    label: 'View',
    icon: 'i-heroicons-document-duplicate-20-solid',
    click: () => navigateTo('/auth/users/' + row.id)
  }], [{
    label: 'Activate',
    icon: 'i-heroicons-archive-box-20-solid',
    click: () => emit('activate', row.id)
  }, {
    label: 'Add to Group',
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
const selected = ref([])

// watch(search, useFetchData('authentication/userlist/?search=' + search,))

const addUser = () => {
  newUserSlideover.value = true
  // Add new User
}
const userCreated = () => {
  refresh()
  newUserSlideover.value = false
  toast.add({ title: 'New user has been added' })
}

const userUpdated = () => {
  refresh()
  editUserSlider.value = false
  toast.add({ title: 'New user has been updated' })
}
const user = ref()
const fetchingUser = ref(false)
const openEditSlideOver = async (user) => {
   const {data: selectedUser} = await useFetch(config.public.API_BASE_URL + '/authentication/user_detail/'+ user.id+'/',{
    onRequest(){
      fetchingUser.value = true
    },
    onResponse(){
      fetchingUser.value = false
    },
    onRequestError(){fetchingUser.value = true},
    onResponseError({error}){
      toast.add({title: 'The user details could not ne found', description: error?.message, color: 'gray'})
      fetchingUser.value = false
    }
  } )
  // console.log(user)
  user.value = await selectedUser
  editUserSlider.value = true
}

</script>

<template>
  <section>
    <UBreadcrumb :links="breadcrumb" />
    <UPageHeader headline="Settings" title="ERP Users" description="Manage Users ERP" />
    <UPageBody>
      <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 justify-between">
        <UInput v-model="search" placeholder="search users..." />
        <UButton icon="i-heroicons-user-plus" label="Add User" @click="addUser" />
      </div>
      <TableSkeleton v-if="pending" />
      <div v-else-if="error" class="w-full h-96 flex flex-col justify-center items-center">
        <UIcon name="i-heroicons-exclamation-triangle" class=" h-36 w-36 animate-pulse font-thin text-rose-500" />
        {{ error }}
      </div>
      <UTable v-else v-model="selected" :rows="users.data" :columns="columns">
        <template #first_name-data="{ row }">
          <p class="prose prose-lg dark:prose-invert font-semibold tracking-wider">
            {{ `${row.first_name} ${row.last_name}` }}
          </p>
          <p class="text-xs">
            {{ `${row.email}` }}
          </p>
        </template>
        <template #is_active-data="{ row }">
          <UToggle v-model="row.is_active" size="xs" color="green" disabled="true" />
        </template>
        <template #groups-data="{ row }">
          <UBadge v-for="group in row.groups" :key="group.id" :ui="{ rounded: 'rounded-full' }" variant="outline">
            {{
              group.name }}
          </UBadge>
        </template>
        <template #user_permissions-data="{ row }">
          <div class="flex gap-2 flex-wrap">
            <UBadge
              v-for="permission in row.user_permissions" :key="permission.id" :label="permission.name" color="white"
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
    <USlideover v-model="newUserSlideover">
      <NewUser @user-created="userCreated" />
    </USlideover>
    <!-- <USlideover v-model="editUserSlider">
      <div v-if="fetchingUser" class="w-full h-96 flex flex-col justify-center items-center">
        <UIcon name="i-heroicons-arrow-path" class=" h-36 w-36 animate-spin font-thin text-green-500 dark:text-green-100" />
      </div>
      {{ user }}
      <user-update :user="user" @user-updated="userUpdated" />
    </USlideover> -->
  </section>
</template>

