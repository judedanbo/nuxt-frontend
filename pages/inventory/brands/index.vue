<script lang="ts" setup>

const config = useRuntimeConfig()
const toast = useToast()
const breadcrumb = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/home'
}, {
  label: 'Inventory',
  icon: 'i-mdi-library-shelves',
  to: '/inventory'
}, {
  label: 'Brands',
  icon: 'i-mdi-format-list-bulleted-type'
}]
const emit = defineEmits(['delete'])

const brandsListPage = ref(1)
const searchBrand = ref('')
const showCreateForm = ref(false)
const showEditForm = ref(false)
const addBrand = () => {
  showCreateForm.value = true
}
const { data: brands, pending, error, refresh} = useLazyFetch<BrandResponse>(config.public.API_BASE_URL +'/inventory/brands/',{
  query: {search: searchBrand},
  watch: [searchBrand]
})

const brandCreated = () => {
  toast.add({title: 'New brand has been added'})
  showCreateForm.value = false
  refresh()
}
const brandUpdated = () => {
  toast.add({title: 'Brand has been updated'})
  showEditForm.value = false
  refresh()
}
const columns = [
  {
    key: 'name',
    label: 'Brand name'
  },
  {
    key: 'actions',
    label: ''
  },
  
]
const brandToEdit = ref()
const openEditForm = (row: Brand) => {
  brandToEdit.value = row
  showEditForm.value = true
}
const action = (row: Brand) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => openEditForm(row)
  }, {
    label: 'View',
    icon: 'i-heroicons-document-duplicate-20-solid',
    click: () => navigateTo('/inventory/brands/' + row.id)
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => emit('delete', row.id)
  }]
]
</script>

<template>
  <section>
    <UBreadcrumb :links="breadcrumb" />
    <UPageHeader headline="Inventory" title="Brands" description="List of Brands" />
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 justify-between">
      <UInput v-model="searchBrand" placeholder="search brand..." autofocus />
      <UButton icon="i-mdi-storefront-plus-outline" label="Add brands" @click="addBrand" />
    </div>
    <div v-if="pending" class="w-full h-96 flex flex-col justify-center items-center">
      <UIcon name="i-heroicons-arrow-path" class=" h-36 w-36 animate-spin font-thin text-green-500 dark:text-green-100" />
    </div>
    <div v-else-if="error" class="w-full h-96 flex flex-col justify-center items-center">
      <UIcon name="i-heroicons-exclamation-triangle" class=" h-36 w-36 animate-pulse font-thin text-rose-500" />
      {{ error }}
    </div>
    <div v-else>
      <!-- {{ brands }} -->
      <UPageCard class="flex flex-wrap gap-10 mt-5">
        <UTable :rows="brands?.data" :columns="columns">
          <template #name-data="{row}">
            <nuxt-link :to="'/inventory/brands/'+row.id" class="prose prose-md dark:prose-invert font-medium">
              {{ row.name }}
            </nuxt-link>
          </template>
          <template #actions-data="{ row }">
            <div class="text-right">
              <UDropdown :items="action(row)" >
                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-vertical-20-solid" />
              </UDropdown>
            </div>
          </template>
        </UTable>
        <UPagination v-model="brandsListPage" :total="brands?.total_items" :ui="{ rounded: 'first-of-type:rounded-s-md last-of-type:rounded-e-md' }">
          <template #first="{ onClick }">
            <UTooltip text="First page">
              <UButton icon="i-heroicons-arrow-uturn-left" color="primary" :ui="{ rounded: 'rounded-full' }" class="rtl:[&_span:first-child]:rotate-180 me-2" @click="onClick" />
            </UTooltip>
          </template>
          <template #last="{ onClick }">
            <UTooltip text="Last page">
              <UButton icon="i-heroicons-arrow-uturn-right-20-solid" color="primary" :ui="{ rounded: 'rounded-full' }" class="rtl:[&_span:last-child]:rotate-180 ms-2" @click="onClick" />
            </UTooltip>
          </template>
        </UPagination>
      </UPageCard>
    </div>
    <USlideover v-model="showCreateForm">
      <form-shell title="Create new Brand">
        <inventory-brands-add @created="brandCreated" />
      </form-shell>
    </USlideover>
    <USlideover v-model="showEditForm">
      <form-shell title="Edit Brand">
        <inventory-brands-edit :brand="brandToEdit" @updated="brandUpdated" />
      </form-shell>
    </USlideover>
  </section>
</template>