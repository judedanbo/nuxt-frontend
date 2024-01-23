<script lang="ts" setup>
const config = useRuntimeConfig()

const route = useRoute()
const breadcrumb = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/home'
}, {
  label: 'Company',
  icon: 'i-heroicons-building-library',
  to: '/company'
}, {
  label: 'Department',
}]
const columns = [
  {
    key: 'name',
    label: 'Unit Name'
  },
  {
    key: 'staff',
    label: 'Total Staff'
  }

]
const {data: department, error, refresh, pending} = useLazyFetch(config.public.API_BASE_URL +'/organization/departments/'+ route.params.id +'/')
</script>

<template>
  <section>
    <div v-if="pending" class="w-full h-96 flex flex-col justify-center items-center">
      <UIcon name="i-heroicons-arrow-path" class=" h-36 w-36 animate-spin font-thin text-green-500 dark:text-green-100" />
    </div>
    <div v-else-if="error" class="w-full h-96 flex flex-col justify-center items-center">
      <UIcon name="i-heroicons-exclamation-triangle" class=" h-36 w-36 animate-pulse font-thin text-rose-500" />
      {{ error }}
    </div>
    <div v-else>
      <UBreadcrumb :links="breadcrumb" />
      <UPageHeader headline="Department" :title="department.name" description="Department Details" />
      <div class="flex flex-wrap gap-10 mt-5">
        <UPageCard title="Head" icon="i-mdi-account-supervisor-outline">
          <div class="flex flex-wrap gap-10">
            <p>
              {{ department.head??"no unit head" }}
            </p>
          </div>
        </UPageCard>
        <UPageCard title="Total Units" icon="i-mdi-account-group-outline">
          <div class="flex gap-10">
            <p>
              {{ department?.units?.length }}
            </p>
          </div>
        </UPageCard>
        <UPageCard title="Total Staff" icon="i-mdi-account-group-outline">
          <div class="flex gap-10">
            <p>
              {{ department?.staff?.length }}
            </p>
          </div>
        </UPageCard>
      </div>
      <UPageCard title="Units" class="mt-4">
        <!-- {{ group.users }} -->
        <UTable :rows="department.units" :columns="columns" :empty-state="{ icon: 'i-heroicons-user-group', label: 'No Staff of this unit yet.' }">
          <template #name-data="{row}">
            <nuxt-link :to="'/company/units/'+ row.id" class="prose prose-lg dark:prose-invert">
              {{ row.name }}
            </nuxt-link>
          </template>
          <template #staff-data="{row}">
            <p class="prose prose-lg dark:prose-invert">
              {{ row?.staff?.length }}
            </p>
          </template>
        </UTable>
        <!-- <PageList :items="group.users" /> -->
        <template #is_active-data="{ row }">
          <UToggle v-model="row.is_active" size="xs" color="green" disabled="true" />
          row
        </template>
      </UPageCard>
      <UPageCard title="Staff" class="mt-4">
        <!-- {{ group.users }} -->
        <UTable :rows="department.staff" :empty-state="{ icon: 'i-heroicons-user-group', label: 'No Staff of this unit yet.' }" />
        <!-- <PageList :items="group.users" /> -->
        <template #is_active-data="{ row }">
          <UToggle v-model="row.is_active" size="xs" color="green" disabled="true" />
          row
        </template>
      </UPageCard>
    </div>
  </section>
</template>

<style scoped></style>
