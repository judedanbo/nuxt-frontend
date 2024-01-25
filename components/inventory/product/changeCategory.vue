<script lang="ts" setup>
const config = useRuntimeConfig()
const emit = defineEmits(['update:category','closeModal'])
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
const categoryQuery = ref('')
const validationErrors = ref({
  name: [],
  category_id: [],
})

// product category
const {data: category, pending, error, refresh } = useLazyFetch<CategoryResponse>(config.public.API_BASE_URL +'/inventory/categories/', {
  // query: {search: categoryQuery},
  // watch: [categoryQuery],
  onResponse({response}){
    if(response.status === 400){
        // console.log(response._data)
        validationErrors.value = response._data 
        return
      }
    if(response.status === 200){
      emit('update:category')
    }
  }

})
const selectedCategory = ref(props.product.category_id ?? {})
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
const showCategoryModal = ref(false)
const categoryCreated = () => {
  refresh()
  showCategoryModal.value = false
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
        Change product category
      </h3>
      <UForm :state="form" class="mt-4" @submit="handleSubmit">
        <UFormGroup label="Product category" name="category_id">
          <USelectMenu
            v-model="selectedCategory"
            v-model:query="categoryQuery"
            searchable
            searchable-placeholder="Search category"
            clear-search-on-close
            placeholder="Select category"
            :options="category?.data" 
            option-attribute="name"
            show-create-option-when="always"
            by="name"
          > 
            <template #empty>
              <div class="flex flex-col items-center gap-2">   
                No category
                <UButton label="Create category" variant="outline" size="xs" color="green" @click="showCategoryModal = true" />
              </div>
            </template>
            <template #option-empty="{ query }">
              <div class="flex flex-col items-center gap-2">  
                <p><q>{{ query }}</q> not found in product category</p>
                <UButton label="Add to category" variant="outline" size="xs" color="green" @click="showCategoryModal = true" />
              </div>
            </template>
          </USelectMenu>
          <validation-error :errors="validationErrors?.category_id" />
        </UFormGroup>
        <UButton type="submit" :loading="pending" :disabled="pending" class="mt-40">
          Change
        </UButton>
      </UForm>
    </div>
    <UModal v-model="showCategoryModal">
      <div class="p-10">
        <h2 class="text-xl">
          Create new product category
        </h2>
        <inventory-category-add :value="categoryQuery" @created="categoryCreated" />
      </div>
    </UModal>
  </UModal>
</template>
