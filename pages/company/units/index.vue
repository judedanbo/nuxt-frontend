<script lang="ts" setup>
const toast = useToast()
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
const {data: units, error, refresh, pending} = useFetch(config.public.API_BASE_URL + '/organization/units/', {
  query: {search},
  watch: [search]
})

const columns = [
  {
    key: 'name',
    label: 'Unit Name'
  },
  {
    key: 'department_id',
    label: 'Department'
  },
]
const showAddFrom =  ref(false)
const addUnit = () =>{
  showAddFrom.value = true
}

const unitCreated = () => {
  toast.add({title: 'Unit Created', description: 'A new unit has been created'})
  showAddFrom.value = false
  refresh()
}
</script>

<template>
  <section>
    <UBreadcrumb :links="breadcrumb" />
    <UPageHeader headline="Company" title="Units" description="Manage units of the company" />
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 justify-between">
      <UInput v-model="search" placeholder="search units..." autofocus />
      <UButton icon="i-mdi-storefront-plus-outline" label="Add Unit" @click="addUnit" />
    </div>
    <TableSkeleton v-if="pending" />
    <div v-else-if="error" class="w-full h-96 flex flex-col justify-center items-center">
      <UIcon name="i-heroicons-exclamation-triangle" class=" h-36 w-36 animate-pulse font-thin text-rose-500" />
      {{ error }}
    </div>
    <UPageBody v-else>
      <UTable :rows="units.data" :columns="columns" :empty-state="{icon:'i-mdi-sitemap', label: 'No units' }">
        <template #name-data="{row}">
          <nuxt-link :to="'/company/units/'+ row.id" class="prose prose-lg dark:prose-invert">
            {{ row.name }}
          </nuxt-link>
        </template>
        <template #department_id-data="{row}">
          <nuxt-link class="prose dark:prose-invert" :to="'/company/departments/'+row.department_id.id">
            {{ row.department_id.name }}
          </nuxt-link>
        </template>
      </UTable>
    </UPageBody>
    <USlideover v-model="showAddFrom">
      <OrganizationAddUnit @created="unitCreated" />
    </USlideover>
  </section>
</template>

<style scoped></style>
