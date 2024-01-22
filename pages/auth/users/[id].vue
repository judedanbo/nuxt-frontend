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
  label: 'All users',
  icon: 'i-heroicons-users',
  to: '/auth/users/'
},
{
  label: 'User',
  icon: 'i-heroicons-user',
  to: '/auth/users/'
}
]
const config = useRuntimeConfig()

const route = useRoute()

const {
  data: user,
  pending,
  error,
  refresh,
} = await useFetch(
  config.public.API_BASE_URL +
  '/authentication/user_detail/' +
  route.params.id +
  '/',
  {
    lazy: true,
    server: false,
  }
)
const editUserSlider = ref(false)
const openEditUserSlider = () => {
  editUserSlider.value = true
}
const update = () => {
  editUserSlider.value = false
  refresh()
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
      <UPageHeader headline="Settings" :title="capitalCase(user.first_name + ' ' + user.last_name)">
        <div class="mt-2">
          <UBadge v-if="user.is_active" label="Active" color="green" variant="outline" />
          <UBadge v-else label="Not active" variant="outline" />
        </div>
      </UPageHeader>

      <UPageBody>
        <div class=" flex justify-between items-center">
          <div class="flex gap-4 justify-between w-1/2">
            <UPageCard title="Phone Number" icon="i-heroicons-phone" :to="'tel:' + user.phone_number">
              <div class="flex gap-10">
                <p>
                  {{ user.phone_number }}
                </p>
              </div>
            </UPageCard>
            <UPageCard title="Email" icon="i-heroicons-at-symbol" :to="'email:' + user.email">
              <div class="flex gap-10">
                <p>
                  {{ user.email }}
                </p>
              </div>
            </UPageCard>
          </div>
          <div>
            <UButton
              size="xl" :label="'Edit ' + user.first_name" variant="outline" icon="i-heroicons-user" color="white"
              @click="openEditUserSlider"
            />
          </div>
        </div>
        <UPageCard title="Groups" class="mt-4">
          <PageList :items="user.groups" />
        </UPageCard>
        <UPageCard title="Additional Permissions" class="mt-4">
          <PageList :items="user.user_permissions" />
        </UPageCard>
      </UPageBody>
    </div>
    <USlideover v-model="editUserSlider">
      <user-update :user="user" @user-updated="update" />
    </USlideover>
  </section>
</template>

<style scoped></style>
