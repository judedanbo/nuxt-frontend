<script lang="ts" setup>
const route = useRoute()
const toast = useToast()
const id = route.params.id  as number|string
const { data: product, error, pending, refresh } = useProduct(id)
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
},
{
  label: 'Product Details',
  icon: 'i-mdi-format-list-group'
}
]

const inventoryTable =  [
  {
    key: 'avialable_quantity',
    label: 'Available Quantity'
  },
  {
    key: 'avialable_quantity_value',
    label: 'Value of Available Quantity'
  },
  {
    key: 'total_quantity_intake',
    label: 'Total Quantity Intake'
  },
  {
    key: 'total_quantity_requested',
    label: 'Total Quantity Requested'
  },
]
const inventoryDetails = [
  {
    key: 'batch_number',
    label: 'Batch Number'
  },
  {
    key: 'quantity_intake',
    label: 'Quantity Intake'
  },
  {
    key: 'quantity_requested',
    label: 'Quantity Requested'
  },
  {
    key: 'avialable_quantity',
    label: 'Available Quantity'
  },
  {
    key: 'actions',
  },
  
]
const showSlideover = ref(false)
const showModal = ref(false)
const openEditForm = () => {
  showSlideover.value = true
}
const action = [
    {
      label: 'Edit',
      icon: 'i-mdi-pencil',
      
      // to: '/inventory/products/'+row.id+'/edit'
    },
    {
      label: 'Delete',
      icon: 'i-mdi-delete',
      // to: '/inventory/products/'+row.id+'/delete'
    }
  ]

  const deleteProduct = async() => {
    const { data } = await useDeleteProduct(id)
    toast.add({ title: 'Product deleted successfully' })
    navigateTo('/inventory/products')

    // useFetch('/inventory/products/'+id + '/', {
    //   method: 'DELETE',
    //   onResponse({response}){
    //     if(response.ok){
    //       showModal.value = false
    //       navigateTo('/inventory/products')
    //     }
    //   }
    // })
  }
const productUpdated = () => {
  toast.add({title: 'Product has been updated'})
  showSlideover.value = false
  refresh()

}
const showUpdateBrand = ref(false)
const showUpdateCategory = ref(false)
const showUpdateClassification = ref(false)
const showUpdateUnit = ref(false)

const brandUpdated = () => {
  toast.add({title: 'Product brand has been updated'})
  showUpdateBrand.value = false
  refresh()
}
const categoryUpdated = () => {
  toast.add({title: 'Product category has been updated'})
  showUpdateCategory.value = false
  refresh()
}
const classificationUpdated = () => {
  toast.add({title: 'Product classification has been updated'})
  showUpdateClassification.value = false
  refresh()
}
const unitUpdated = () => {
  toast.add({title: 'Product unit of measure has been updated'})
  showUpdateUnit.value = false
  refresh()
}
const updateBrand = () => {
  showUpdateBrand.value = true
}
const updateCategory = () => {
  showUpdateCategory.value = true
}
const updateClassification = () => {
  showUpdateClassification.value = true
}
const updateUnit = () => {
  showUpdateUnit.value = true
}

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
      <UPageHeader 
        headline="Product" 
        :title="product.name" 
        icon="i-mdi-format-list-group"
        :description="'Restock Level: ' + product.restock_level" 
        :links="[{
          label: 'Edit',
          icon: 'i-mdi-pencil',
          click: () => openEditForm()
        },{
          label: 'Delete',
          icon: 'i-mdi-delete',
          click: () => showModal = true
        }
        ]"
      />
      <UPageGrid class="mt-4">
        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold ">
                {{ product.brand_id.name }}
              </h3>
              <p class="text-sm">
                Brand
              </p>
            </div>
            <UTooltip text="Change brand">
              <UButton color="gray" variant="ghost" icon="i-mdi-swap-horizontal" class="-my-1" @click="updateBrand" />
            </UTooltip>
          </div>
        </UCard>
        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold ">
                {{ product.category_id.name }}
              </h3>
              <p class="text-sm">
                Category
              </p>
            </div>
            <UTooltip text="Change category">
              <UButton color="gray" variant="ghost" icon="i-mdi-swap-horizontal" class="-my-1" @click="updateCategory" />
            </UTooltip>
          </div>
        </UCard>
        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold ">
                {{ product.classification_id.name }}
              </h3>
              <p class="text-sm">
                Classification
              </p>
            </div>
            <UTooltip text="Change product classification">
              <UButton color="gray" variant="ghost" icon="i-mdi-swap-horizontal" class="-my-1" @click="updateClassification" />
            </UTooltip>
          </div>
        </UCard>
        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold ">
                {{ product.unit_id.name }}
              </h3>
              <p class="text-sm">
                Unit of Measurement
              </p>
            </div>
            <UTooltip text="Change unit of measure">
              <UButton color="gray" variant="ghost" icon="i-mdi-swap-horizontal" class="-my-1" @click="updateUnit" />
            </UTooltip>
          </div>
        </UCard>
      </UPageGrid>
      <UPageCard title="Product Inventory" description="Current inventory information" class="mt-5" >
        <UTable :rows="product.product_inventory" :columns="inventoryTable">
          <template #avialable_quantity-data="{row}">
            <p class="prose prose-md dark:prose-invert text-right pr-10">
              {{ useNumberFormat(row.avialable_quantity) }}
            </p>
          </template>
          <template #avialable_quantity_value-data="{row}">
            <p class="prose prose-md dark:prose-invert text-right pr-10">
              {{ useCurrencyFormat(row.avialable_quantity_value) }}
            </p>
          </template>
          <template #total_quantity_intake-data="{row}">
            <p class="prose prose-md dark:prose-invert text-right pr-10">
              {{ useNumberFormat(row.total_quantity_intake) }}
            </p>
          </template>
          <template #total_quantity_requested-data="{row}">
            <p class="prose prose-md dark:prose-invert text-right pr-10">
              {{ useNumberFormat(row.total_quantity_requested) }}
            </p>
          </template>
        </UTable>
      </UPageCard>
      <UPageCard title="Inventory Details" description="Batch intakes and request details" class="mt-5">
        <UTable :rows="product.product_inventory[0].product_inventory_details" :columns="inventoryDetails">
          <template #quantity_intake-data="{row}">
            <p class="prose prose-md dark:prose-invert text-right pr-10">
              {{ useNumberFormat(row.quantity_intake) }}
            </p>
          </template>
          <template #quantity_requested-data="{row}">
            <p class="prose prose-md dark:prose-invert text-right pr-10">
              {{ useNumberFormat(row.quantity_requested) }}
            </p>
          </template>
          <template #avialable_quantity-data="{row}">
            <p class="prose prose-md dark:prose-invert text-right pr-10">
              {{ useNumberFormat(row.avialable_quantity) }}
            </p>
          </template>
          <template #batch_number-data="{row}">
            <p class="prose prose-md dark:prose-invert ">
              {{ row.batch_number }}
            </p>
          </template>
          <template #actions-data="{ row }">
            <UDropdown :items="action">
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-vertical-20-solid" />
            </UDropdown>
          </template>
        </UTable>
      </UPageCard>
    </div>
    <USlideover v-model="showSlideover" :overlay="true" :close-button="true" :size="'2xl'">
      <form-shell title="Edit Product">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Edit Product
        </h2>
        <inventory-product-form :product="product" @updated="productUpdated" />
      </form-shell>
    </USlideover>
    <UModal v-model="showModal" :overlay="true" :close-button="true" :size="'2xl'">
      <div class="p-10 flex flex-col gap-y-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Delete Product
          </h2>
          <p>Are you sure you want to delete this product</p>
        </div>
        <div class="flex justify-between gap-2 mt-10">
          <UButton color="white" variant="solid" @click="showModal = false">
            Cancel
          </UButton>
          <UButton color="red" variant="solid" @click="deleteProduct">
            Delete
          </UButton>
        </div>
      </div>
    </UModal>
    <inventory-product-change-brand v-if="showUpdateBrand" :product="product" @updated="brandUpdated" @close-modal="showUpdateBrand = false" />
    <inventory-product-change-category v-if="showUpdateCategory" :product="product" @updated="categoryUpdated" @close-modal="showUpdateCategory = false" />
    <inventory-product-change-classification v-if="showUpdateClassification" :product="product" @updated="classificationUpdated" @close-modal="showUpdateClassification = false" />
    <inventory-product-change-unit v-if="showUpdateUnit" :product="product" @updated="classificationUpdated" @close-modal="showUpdateUnit = false" />
  </section>
</template>