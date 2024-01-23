<script lang="ts" setup>

const config = useRuntimeConfig()
const breadcrumb = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/home'
}, {
  label: 'Inventory',
  icon: 'i-mdi-library-shelves',
  to: '/inventory'
}, {
  label: 'Product',
  icon: 'i-mdi-format-list-bulleted-type'
}]
const productsListPage = ref(1)
const searchProduct = ref('')
const showCreateForm = ref(false)
const addProduct = () => {
  showCreateForm.value = true
}
const { data: products, pending, error, refresh} = useLazyFetch(config.public.API_BASE_URL +'/inventory/products/')

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
      {{ products }}
      <div class="flex flex-wrap gap-10 mt-5">
        <UTable :rows="products.data" />
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
      <form-shell>
        <inventory-product-add />
      </form-shell>
    </USlideover>
  </section>
</template>

<style scoped></style>
