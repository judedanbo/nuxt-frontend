<script lang="ts" setup>
const config = useRuntimeConfig()
const emit = defineEmits(['update:units','closeModal'])
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

const unitsQuery = ref('')
const validationErrors = ref({
  name: [],
  brand_id: [],
})

// product Unit
const {data: units, pending, error, refresh } = useLazyFetch<BrandResponse>(config.public.API_BASE_URL +'/inventory/units/', {
  onResponse({response}){
    if(response.status === 400){
        // console.log(response._data)
        validationErrors.value = response._data 
        return
      }
    if(response.status === 200){
      emit('update:units')
    }
  }

})
const selectedUnit = ref(props.product.unit_id ?? {})
const selectedBrandId = computed(() => {
  return selectedUnit.value.id
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
const showUnitsModal = ref(false)
const unitCreated = () => {
  refresh()
  showUnitsModal.value = false
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
        Change product Unit
      </h3>
      <UForm :state="form" class="mt-4" @submit="handleSubmit">
        <UFormGroup label="Product Unit" name="brand_id">
          <USelectMenu
            v-model="selectedUnit"
            v-model:query="unitsQuery"
            searchable
            searchable-placeholder="Search units"
            clear-search-on-close
            placeholder="Select Unit"
            :options="units?.data" 
            option-attribute="name"
            show-create-option-when="always"
            by="name"
          > 
            <template #empty>
              <div class="flex flex-col items-center gap-2">   
                No Unit
                <UButton label="Create Unit" variant="outline" size="xs" color="green" @click="showUnitsModal = true" />
              </div>
            </template>
            <template #option-empty="{ query }">
              <div class="flex flex-col items-center gap-2">  
                <p><q>{{ query }}</q> not found in product units</p>
                <UButton label="Add to units" variant="outline" size="xs" color="green" @click="showUnitsModal = true" />
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
    <UModal v-model="showUnitsModal">
      <div class="p-10">
        <h2 class="text-xl">
          Create new Unit of measurement
        </h2>
        <inventory-units-add :value="unitsQuery" @created="unitCreated" />
      </div>
    </UModal>
  </UModal>
</template>
