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
  label: 'Category',
  icon: 'i-mdi-format-list-bulleted-type'
}]
const emit = defineEmits(['delete'])

const categoryListPage = ref(1)
const searchCategory = ref('')
const showCreateForm = ref(false)
const showEditForm = ref(false)
const addCategory = () => {
  showCreateForm.value = true
}
const { data: category, pending, error, refresh} = useLazyFetch<CategoryResponse>(config.public.API_BASE_URL +'/inventory/categories/',{
  query: {search: searchCategory},
  watch: [searchCategory]
})

const categoryCreated = () => {
  toast.add({title: 'New category has been added'})
  showCreateForm.value = false
  refresh()
}
const categoryUpdated = () => {
  toast.add({title: 'Category has been updated'})
  showEditForm.value = false
  refresh()
}
const columns = [
  {
    key: 'name',
    label: 'Category name'
  },
  {
    key: 'actions',
    label: ''
  },
  
]
const categoryToEdit = ref()
const openEditForm = (row: Category) => {
  categoryToEdit.value = row
  showEditForm.value = true
}
const action = (row: Category) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => openEditForm(row)
  }, {
    label: 'View',
    icon: 'i-heroicons-document-duplicate-20-solid',
    click: () => navigateTo('/inventory/categories/' + row.id)
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
    <UPageHeader headline="Inventory" title="Category" description="List of Categories" />
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 justify-between">
      <UInput v-model="searchCategory" placeholder="search category..." autofocus />
      <UButton icon="i-mdi-storefront-plus-outline" label="Add category" @click="addCategory" />
    </div>
    <div v-if="pending" class="w-full h-96 flex flex-col justify-center items-center">
      <UIcon name="i-heroicons-arrow-path" class=" h-36 w-36 animate-spin font-thin text-green-500 dark:text-green-100" />
    </div>
    <div v-else-if="error" class="w-full h-96 flex flex-col justify-center items-center">
      <UIcon name="i-heroicons-exclamation-triangle" class=" h-36 w-36 animate-pulse font-thin text-rose-500" />
      {{ error }}
    </div>
    <div v-else>
      <!-- {{ category }} -->
      <UPageCard class="flex flex-wrap gap-10 mt-5">
        <UTable :rows="category?.data" :columns="columns">
          <template #name-data="{row}">
            <nuxt-link :to="'/inventory/categories/'+row.id" class="prose prose-md dark:prose-invert font-medium">
              {{ row.name }}
            </nuxt-link>
          </template>
          <template #actions-data="{ row }">
            <div class="text-right">
              <UDropdown :items="action(row)">
                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-vertical-20-solid" />
              </UDropdown>
            </div>
          </template>
        </UTable>
        <UPagination v-model="categoryListPage" :total="category?.total_items" :ui="{ rounded: 'first-of-type:rounded-s-md last-of-type:rounded-e-md' }">
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
      <form-shell title="Create new Category">
        <inventory-category-add @created="categoryCreated" />
      </form-shell>
    </USlideover>
    <USlideover v-model="showEditForm">
      <form-shell title="Edit Category">
        <inventory-category-edit :category="categoryToEdit" @updated="categoryUpdated" />
      </form-shell>
    </USlideover>
  </section>
</template>