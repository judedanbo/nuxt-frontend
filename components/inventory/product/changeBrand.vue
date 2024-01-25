<script lang="ts" setup>
const config = useRuntimeConfig()
const emit = defineEmits(['update:brands','closeModal'])
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

const brandsQuery = ref('')
const validationErrors = ref({
  name: [],
  brand_id: [],
})

// product Brand
const {data: brands, pending, error, refresh } = useLazyFetch<BrandResponse>(config.public.API_BASE_URL +'/inventory/brands/', {
  onResponse({response}){
    if(response.status === 400){
        // console.log(response._data)
        validationErrors.value = response._data 
        return
      }
    if(response.status === 200){
      emit('update:brands')
    }
  }

})
const selectedBrand = ref(props.product.brand_id ?? {})
const selectedBrandId = computed(() => {
  return selectedBrand.value.id
})

const form = ref({
  id: props.product.id,
  brand_id: selectedBrandId,
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
const showBrandsModal = ref(false)
const brandsCreated = (brand: Brand) => {
  // console.log(brand)
  selectedBrand.value = brand
  refresh()
  showBrandsModal.value = false
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
        Change product brand
      </h3>
      <UForm :state="form" class="mt-4" @submit="handleSubmit">
        <UFormGroup label="Product Brand" name="brand_id">
          <USelectMenu
            v-model="selectedBrand"
            v-model:query="brandsQuery"
            searchable
            searchable-placeholder="Search brands"
            clear-search-on-close
            placeholder="Select brand"
            :options="brands?.data" 
            option-attribute="name"
            show-create-option-when="always"
            by="name"
          > 
            <template #empty>
              <div class="flex flex-col items-center gap-2">   
                No Brand
                <UButton label="Create brand" variant="outline" size="xs" color="green" @click="showBrandsModal = true" />
              </div>
            </template>
            <template #option-empty="{ query }">
              <div class="flex flex-col items-center gap-2">  
                <p><q>{{ query }}</q> not found in product brands</p>
                <UButton label="Add to brands" variant="outline" size="xs" color="green" @click="showBrandsModal = true" />
              </div>
            </template>
          </USelectMenu>
          <validation-error :errors="validationErrors?.brand_id" />
        </UFormGroup>
        <UButton type="submit" :loading="pending" :disabled="pending" class="mt-40">
          Change
        </UButton>
      </UForm>
    </div>
    <UModal v-model="showBrandsModal">
      <div class="p-10">
        <h2 class="text-xl">
          Create new product Brand
        </h2>
        <inventory-brands-add :value="brandsQuery" @created="(brand)=>brandsCreated(brand)" />
      </div>
    </UModal>
  </UModal>
</template>
