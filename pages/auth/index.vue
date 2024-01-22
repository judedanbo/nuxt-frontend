<script lang="ts" setup>
const toast = useToast()

const emit = defineEmits(['activate', 'deactivate', 'delete', 'addToGroup', 'addPermission'])

const config = useRuntimeConfig()
const { data: users, pending: usersPending } = useFetchData('/authentication/userlist/')
const { data: groups, pending: groupsPending } = useFetchData('/groups/')
const breadcrumb = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/home'
}, {
  label: 'User & Groups',
  icon: 'i-heroicons-user-group',

},]
</script>

<template>
  <section>
    <UBreadcrumb :links="breadcrumb" />
    <UPageHeader headline="Settings" title="Users and Groups" description="Manage Users and groups of the ERP" />
    <UPageBody>
      <UPageGrid>
        <AuthSkeleton v-if="usersPending" />
        <UPageCard v-else title="Users" icon="i-heroicons-users" to="/auth/users">
          {{ users.total_items }}
        </UPageCard>
        <AuthSkeleton v-if="groupsPending" />
        <UPageCard v-else title="Groups" icon="i-heroicons-user-group" to="/auth/groups">
          <div>
            {{ groups.total_items }}
          </div>
        </UPageCard>
      </UPageGrid>
    </UPageBody>
  </section>
</template>

<style scoped></style>
