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
  label: 'Products',
  icon: 'i-mdi-format-list-bulleted-type'
}]
const productsListPage = ref(1)
const searchProduct = ref('')
const showCreateForm = ref(false)
const showEditForm = ref(false)
const addProduct = () => {
  showCreateForm.value = true
}
const { data: products, pending, error, refresh} = useLazyFetch(config.public.API_BASE_URL +'/inventory/products/',{
  query: {search: searchProduct},
  watch: [searchProduct]
})

const productCreated = () => {
  toast.add({title: 'New product has been added'})
  showCreateForm.value = false
  refresh()
}
const productUpdated = () => {
  toast.add({title: 'Product has been updated'})
  showEditForm.value = false
  refresh()
}
const columns = [
  {
    key: 'name',
    label: 'Product name'
  },
  {
    key: 'brand_id',
    label: 'Brand'
  },
  {
    key: 'category_id',
    label: 'Category'
  },
  {
    key: 'unit_id',
    label: 'unit of Measurement'
  },
  {
    key: 'classification_id',
    label: 'Product Classification'
  },
  {
    key: 'restock_level',
    label: 'Restock Level'
  },
  {
    key: 'available_quantity_value',
    label: 'Available Quantity'
  },
  // {
  //   key: 'total_quantity_intake',
  //   label: 'Total intake'
  // },
  // {
  //   key: 'total_quantity_requested',
  //   label: 'Total requested'
  // },
  {
    key: 'actions',
    label: ''
  },
  
]
const rowToEdit = ref()
const openEditForm = (row) => {
  rowToEdit.value = row
  showEditForm.value = true
}
const action = (row) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => openEditForm(row.id)
  }, {
    label: 'View',
    icon: 'i-heroicons-document-duplicate-20-solid',
    click: () => navigateTo('/inventory/products/' + row.id)
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
    <UPageHeader headline="Inventory" title="Products" description="List of Products" />
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 justify-between">
      <UInput v-model="searchProduct" placeholder="search product..." autofocus />
      <UButton icon="i-mdi-storefront-plus-outline" label="Add products" @click="addProduct" />
    </div>
    <div v-if="pending" class="w-full h-96 flex flex-col justify-center items-center">
      <UIcon name="i-heroicons-arrow-path" class=" h-36 w-36 animate-spin font-thin text-green-500 dark:text-green-100" />
    </div>
    <div v-else-if="error" class="w-full h-96 flex flex-col justify-center items-center">
      <UIcon name="i-heroicons-exclamation-triangle" class=" h-36 w-36 animate-pulse font-thin text-rose-500" />
      {{ error }}
    </div>
    <div v-else>
      <!-- {{ products }} -->
      <div class="flex flex-wrap gap-10 mt-5">
        <UTable :rows="products.data" :columns="columns">
          <template #name-data="{row}">
            <nuxt-link :to="'/inventory/products/'+row.id" class="prose dark:prose-invert font-medium">
              {{ row.name }}
            </nuxt-link>
          </template>
          <template #brand_id-data="{row}">
            <nuxt-link :to="row.brand_id?'/inventory/brands/'+row.brand_id.id:''" class="prose dark:prose-invert">
              {{ row.brand_id?.name }}
            </nuxt-link>
          </template>
          <template #category_id-data="{row}">
            <nuxt-link :to="row.category_id?'/inventory/categories/'+row.category_id.id:''" class="prose dark:prose-invert">
              {{ row.category_id?.name }}
            </nuxt-link>
          </template>
          <template #restock_level-data="{row}">
            <p class="prose dark:prose-invert text-right">
              {{ row.restock_level }}
            </p>
          </template>
          <template #unit_id-data="{row}">
            <nuxt-link :to="row.unit_id?'/inventory/units/'+row.unit_id.id:''" class="prose dark:prose-invert">
              {{ row.unit_id?.name }}
            </nuxt-link>
          </template>
          <template #classification_id-data="{row}">
            <nuxt-link :to="row.classification_id?'/inventory/classification/'+row.classification_id.id:''" class="prose dark:prose-invert">
              {{ row.classification_id?.name }}
            </nuxt-link>
          </template>
          <template #available_quantity_value-data="{row}">
            <p class="prose dark:prose-invert text-right">
              {{ row.product_inventory[0]?.avialable_quantity }}
            </p>
          </template>
          <!-- <template #total_quantity_intake-data="{row}">
            <p class="prose dark:prose-invert text-right">
              {{ row.product_inventory[0]?.product_inventory_details[0]?.quantity_intake }}
            </p>
          </template> -->
          <!-- <template #total_quantity_requested-data="{row}">
            <p class="prose dark:prose-invert text-right">
              {{ row.product_inventory[0]?.product_inventory_details[0]?.quantity_requested }}
            </p>
          </template> -->
          <template #actions-data="{ row }">
            <UDropdown :items="action(row)">
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-vertical-20-solid" />
            </UDropdown>
          </template>
        </UTable>
        <UPagination v-model="productsListPage" :total="products.total_items" :ui="{ rounded: 'first-of-type:rounded-s-md last-of-type:rounded-e-md' }">
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
      </div>
    </div>
    <USlideover v-model="showCreateForm">
      <form-shell title="Create new Product">
        <inventory-product-add @created="productCreated" />
      </form-shell>
    </USlideover>
    <USlideover v-model="showEditForm">
      <form-shell title="Edit Product">
        <inventory-product-edit :product="rowToEdit" @updated="productUpdated" />
      </form-shell>
    </USlideover>
  </section>
</template>
