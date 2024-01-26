<script lang="ts" setup>
const route = useRoute()
const toast = useToast()
const id = route.params.id  as number|string
const { data: classification, error, pending, refresh } = useClassification(id)
const breadcrumb = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/home'
}, {
  label: 'Inventory',
  icon: 'i-mdi-library-shelves',
  to: '/inventory'
}, {
  label: 'Classifications',
  icon: 'i-mdi-format-list-bulleted-type',
  to: '/inventory/classification'
},
{
  label: 'Classification Details',
}
]

const productTable =  [
  {
    key: 'name',
    label: 'Product Name'
  },
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

const showSlideover = ref(false)
const showModal = ref(false)
const openEditForm = () => {
  showSlideover.value = true
}

  const deleteClassification = async() => {
    const { data } = await useDeleteClassification(id)
    toast.add({ title: 'Classification deleted successfully' })
    navigateTo('/inventory/classification')
  }
const classificationUpdated = () => {
  toast.add({title: 'Classification has been updated'})
  showSlideover.value = false
  refresh()

}
const showUpdateClassification = ref(false)


const updateClassification = () => {
  showUpdateClassification.value = true
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
        headline="Classification" 
        :title="classification?.name" 
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
      <UPageCard title="Classification Products" description="Products this classification is associated with" class="mt-5" >
        <UTable :rows="classification?.products" :columns="productTable">
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
    </div>
    <USlideover v-model="showSlideover" :overlay="true" :close-button="true" :size="'2xl'">
      <form-shell title="Edit Classification">
        <inventory-classification-edit :classification="classification" @updated="classificationUpdated" />
      </form-shell>
    </USlideover>
    <UModal v-model="showModal" :overlay="true" :close-button="true" :size="'2xl'">
      <div class="p-10 flex flex-col gap-y-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Delete Classification
          </h2>
          <p>Are you sure you want to delete this classification</p>
        </div>
        <div class="flex justify-between gap-2 mt-10">
          <UButton color="white" variant="solid" @click="showModal = false">
            Cancel
          </UButton>
          <UButton color="red" variant="solid" @click="deleteClassification">
            Delete
          </UButton>
        </div>
      </div>
    </UModal>
  </section>
</template>