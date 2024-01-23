<script lang="ts" setup>
const config = useRuntimeConfig()
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
const search = ref('')
const {data: departments, error, refresh, pending} = useFetch(config.public.API_BASE_URL + '/organization/departments/', {
  query: {search},
  watch: [search]
})

const showAddFrom =  ref(false)
const addDepartment = () =>{
  showAddFrom.value = true
}

const departmentCreated = () => {
  showAddFrom.value = false
  refresh()
}

const columns = [
  {
    key: 'name',
    label: 'Department Name'
  },
  {
    key: 'units',
    label: 'Units'
  },
]

</script>

<template>
  <section>
    <UBreadcrumb :links="breadcrumb" />
    <UPageHeader headline="Company" title="Departments" description="Manage departments of the company" />
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 justify-between">
      <UInput v-model="search" placeholder="search department..." autofocus />
      <UButton icon="i-mdi-storefront-plus-outline" label="Add Department" @click="addDepartment" />
    </div>
    <TableSkeleton v-if="pending" />
    <div v-else-if="error" class="w-full h-96 flex flex-col justify-center items-center">
      <UIcon name="i-heroicons-exclamation-triangle" class=" h-36 w-36 animate-pulse font-thin text-rose-500" />
      {{ error }}
    </div>
    <UPageBody v-else>
      <UTable :rows="departments.data" :columns="columns" :empty-state="{icon:'i-mdi-sitemap', label: 'No Departments' }">
        <template #name-data="{row}">
          <nuxt-link :to="'/company/departments/'+row.id" class="prose prose-lg dark:prose-invert">
            {{ row.name }}
          </nuxt-link> <br>
            Units: {{ row.units.length }}
        </template>
        <template #units-data="{row}">
          <div class="flex gap-4 flex-wrap">
            <nuxt-link v-for="unit in row.units" :key="unit.id" :to="'/company/units/'+unit.id" class="prose dark:prose-invert">
              {{ unit.name }}
            </nuxt-link>
          </div>
        </template>
      </UTable>
    </UPageBody>
    <USlideover v-model="showAddFrom">
      <OrganizationAddDepartment @created="departmentCreated" />
    </USlideover>
  </section>
</template>

<style scoped></style>
