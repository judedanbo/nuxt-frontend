<script lang="ts" setup>
const config = useRuntimeConfig()
const emit = defineEmits(['update:classification','closeModal'])
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
  product: {
    type: Object,
    default: () => {
     return {
        id: '',
        name: ''
     }
    },
  },
})
const classificationQuery = ref('')
const validationErrors = ref({
  name: [],
  classification_id: [],
})

// product classification
const {data: classification, pending, error, refresh } = await useLazyFetch<ClassificationResponse>(config.public.API_BASE_URL +'/inventory/classification/', {
  // query: {search: classificationQuery},
  // watch: [classificationQuery],
  onResponse({response}){
    if(response.status === 400){
        // console.log(response._data)
        validationErrors.value = response._data 
        return
      }
    if(response.status === 200){
      // emit('update:classification')
    }
  }

})
const selectedCategory = ref(props.product.classification_id ?? {})
const selectedCategoryId = computed(() => {
  return selectedCategory.value.id
})

const form = ref({
  id: props.product.id,
  category_id: selectedCategoryId,
})
const handleSubmit = () => {
  useFetch(config.public.API_BASE_URL +'/inventory/products/'+props.product.id+'/', {
    method: 'PATCH',
    body: form.value,
    onRequest(){      
      pending.value = true
    },
    onResponseError({response}){
      if(response.status === 400){
        // console.log(response._data)
        validationErrors.value = response._data 
        return
      }
      pending.value = false
    },
    onResponse({response}){
      if(response.status === 200){
        pending.value = false
      }
      emit('closeModal')
    }
  })
  console.log(form.value)
}
const isVisible = ref(true)

watch(() => props.showModal, (value) => {
  isVisible.value = value
})
const showCategoryModal = ref(false)
const categoryCreated = () => {
  showCategoryModal.value = false
  refresh()
}
</script>

<template>
  <UModal v-model="isVisible" @close="emit('closeModal')">
    <div v-if="pending">
      Loading
    </div>
    <div v-else-if="error">
      Error
    </div>
    <div v-else class="p-10">
      <h3 class="text-lg font-semibold ">
        Change product classification
      </h3>
      <UForm :state="form" class="mt-4" @submit="handleSubmit">
        <UFormGroup label="Product Classification" name="classification_id">
          <USelectMenu
            v-model="selectedCategory"
            v-model:query="classificationQuery"
            :loading="pending"
            searchable
            searchable-placeholder="Search classification"
            clear-search-on-close
            placeholder="Select classification"
            :options="classification?.data" 
            option-attribute="name"
            show-create-option-when="always"
            by="name"
          > 
            <template #empty>
              <div class="flex flex-col items-center gap-2">   
                No classification
                <UButton label="Create classification" variant="outline" size="xs" color="green" @click="showCategoryModal = true" />
              </div>
            </template>
            <template #option-empty="{ query }">
              <div class="flex flex-col items-center gap-2">  
                <p><q>{{ query }}</q> not found in product classification</p>
                <UButton label="Add to classification" variant="outline" size="xs" color="green" @click="showCategoryModal = true" />
              </div>
            </template>
          </USelectMenu>
          <validation-error :errors="validationErrors?.classification_id" />
        </UFormGroup>
        <UButton type="submit" :loading="pending" :disabled="pending" class="mt-40">
          Change
        </UButton>
      </UForm>
    </div>
    <UModal v-model="showCategoryModal">
      <div class="p-10">
        <h2 class="text-xl">
          Create new product classification
        </h2>
        <inventory-classification-add :value="classificationQuery" @created="categoryCreated" />
      </div>
    </UModal>
  </UModal>
</template>
