<script setup lang="ts">
const config = useRuntimeConfig()
const emit = defineEmits(['updated'])

const props = defineProps({
  product: {
    type: Object,
    default: () => {
      return {
        id: '',
        category_id: '',
        brand_id: '',
        unit_id: '',
        classification_id: '',
        name: '',
        restock_level: '',
        unit_price: '',
        quantity: '',
      }
    }
  }
})
// add new category
const query = ref('')
const classificationQuery = ref('')
const unitsQuery = ref('')
const brandsQuery = ref('')
const showCategoryModal = ref(false)
const addCategory = () => {
  showCategoryModal.value = true
}
const formPending = ref(false)
const handleSubmit = async() => {
  return  useLazyFetch(config.public.API_BASE_URL +'/inventory/products/'+ props.product.id +'/', {
    method: 'PUT',
    body: productForm,
    onRequest(){      
      formPending.value = true
    },
    onRequestError({error}){
      // console.log(error)
    },
    onResponseError({response}){
      if(response.status === 400){
        // console.log(response._data)
        validationErrors.value = response._data 
        return
      }
      formError.value.status = response.status
      formError.value.text = response.statusText
      // console.log(response)
      formPending.value = false
    },
    onResponse({response}){
      if(response.status === 200){
        emit('updated')
        formPending.value = false
      }
    }
  })
  
}
// categories
const {data:category, pending: categoryPending, error, refresh} = useLazyFetch(config.public.API_BASE_URL +'/inventory/categories/')
const selectedCategory = ref(props.product.category_id ?? {})
const selectedCategoryId = computed(() => {
  return selectedCategory.value.id
})

// add new Classification
const showClassificationModal =  ref(false)

// product classification
const {data: classification, pending: classificationPending, error: classificationErrors, refresh: refreshClassification} = useLazyFetch(config.public.API_BASE_URL +'/inventory/classification/')
const selectedClassification = ref(props.product.classification_id ?? {})
const selectedClassificationId = computed(() => {
  return selectedClassification.value.id
})

// product Brand
const {data: brands, pending: brandsPending, error: brandsErrors, refresh: refreshBrands} = useLazyFetch(config.public.API_BASE_URL +'/inventory/brands/')
const selectedBrand = ref(props.product.brand_id ?? {})
const selectedBrandId = computed(() => {
  return selectedBrand.value.id
})

// unit of measurement

const selectedUnit = ref(props.product.unit_id ?? {})
const showUnitsModal = ref(false)
const {data: units, pending: unitsPending, error: unitsErrors, refresh: refreshUnit} = useLazyFetch(config.public.API_BASE_URL +'/inventory/units/')
const unitCreated = () => {
  showUnitsModal.value =false
  refreshUnit()
}
const selectedUnitId = computed(() => {
  return selectedUnit.value.id
})

const productForm = ref({
  category_id: selectedCategoryId,
  brand_id: selectedBrandId,
  unit_id: selectedUnitId,
  classification_id: selectedClassificationId,
  name: props.product.name,
  restock_level: props.product.restock_level,
  unit_price: props.product.unit_price,
  quantity: props.product.quantity,
  
})
const validationErrors = ref([])
const formError = ref({
  status: '',
  text: ''
})

const categoryCreated = () => {
  showCategoryModal.value = false
  refresh()
}
const classificationCreated = () => {
  showClassificationModal.value = false
  refreshClassification()
}
const showBrandsModal = ref(false)
const brandsCreated = () => {
  showBrandsModal.value = false
  refreshBrands()
}
</script>

<template>
  <div>
    <UForm v-if="!categoryPending" :state="productForm" class="space-y-4 mt-10" @submit="handleSubmit">
      <UFormGroup label="Product Category" name="category_id">
        <USelectMenu
          v-model="selectedCategory" 
          v-model:query="query"
          searchable
          searchable-placeholder="Search Categories"
          clear-search-on-close
          placeholder="Select Category"
          :options="category?.data" 
          option-attribute="name"
          show-create-option-when="always"
        > 
          <template #empty>
            <div class="flex flex-col items-center gap-2">   
              No Category
              <UButton label="Create category" variant="outline" size="xs" color="green" @click="addCategory" />
            </div>
          </template>
          <template #option-empty="{ query }">
            <div class="flex flex-col items-center gap-2">  
              <p><q>{{ query }}</q> not found in product categories</p>
              <UButton label="Add to categories" variant="outline" size="xs" color="green" @click="addCategory" />
            </div>
          </template>
        </USelectMenu>
        <validation-error :errors="validationErrors?.category_id" />
      </UFormGroup>
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
  
      <UFormGroup label="Unit of Measurement" name="unit_id">
        <USelectMenu
          v-model="selectedUnit" 
          v-model:query="unitsQuery"
          searchable
          searchable-placeholder="Search units of measurement"
          clear-search-on-close
          placeholder="select unit of measurement"
          :options="units?.data" 
          option-attribute="name"
          show-create-option-when="always"
        > 
          <template #empty>
            <div class="flex flex-col items-center gap-2">   
              No unit of measurement
              <UButton label="Create new unit" variant="outline" size="xs" color="green" @click="showUnitsModal = true" />
            </div>
          </template>
          <template #option-empty="{ query }">
            <div class="flex flex-col items-center gap-2">  
              <p><q>{{ query }}</q> not found in units</p>
              <UButton label="Add to units" variant="outline" size="xs" color="green" @click="showUnitsModal = true" />
            </div>
          </template>
        </USelectMenu>
        <validation-error :errors="validationErrors?.classification_id" />
      </UFormGroup>
      <UFormGroup label="Product Classification" name="classification_id">
        <USelectMenu
          v-model="selectedClassification" 
          v-model:query="classificationQuery"
          searchable
          searchable-placeholder="Search product classifications"
          clear-search-on-close
          placeholder="Select product classification"
          :options="classification?.data" 
          option-attribute="name"
          show-create-option-when="always"
        > 
          <template #empty>
            <div class="flex flex-col items-center gap-2">   
              No Classification
              <UButton label="Create classification" variant="outline" size="xs" color="green" @click="showClassificationModal = true" />
            </div>
          </template>
          <template #option-empty="{ query }">
            <div class="flex flex-col items-center gap-2">  
              <p><q>{{ query }}</q> not found in classifications</p>
              <UButton label="Add to classification" variant="outline" size="xs" color="green" @click="showClassificationModal = true" />
            </div>
          </template>
        </USelectMenu>
        <validation-error :errors="validationErrors?.classification_id" />
      </UFormGroup>
      <UFormGroup label="Product name" name="name">
        <UInput v-model="productForm.name" required />
      </UFormGroup>
      <UFormGroup label="Restock Level" name="restock_level">
        <UInput v-model="productForm.restock_level" type="number" />
      </UFormGroup>
      
      
      <UFormGroup v-if="props.product.unit_price" label="Unit Price" name="unit_price">
        <UInput v-model="productForm.unit_price" type="number" />
      </UFormGroup>
      <UFormGroup v-if="props.product.quantity" label="Initial Quantity" name="quantity">
        <UInput v-model="productForm.quantity" type="number" />
      </UFormGroup>
      <UButton class="mt-20" type="submit">
        Submit
      </UButton>
    </UForm>
    <UModal v-model="showCategoryModal">
      <div class="p-10">
        <h2 class="text-xl">
          Create new product category
        </h2>
        <inventory-category-add :value="query" @created="categoryCreated" />
      </div>
    </UModal>
    <UModal v-model="showClassificationModal">
      <div class="p-10">
        <h2 class="text-xl">
          Create new product Classification
        </h2>
        <inventory-classification-add :value="classificationQuery" @created="classificationCreated" />
      </div>
    </UModal>
    <UModal v-model="showBrandsModal">
      <div class="p-10">
        <h2 class="text-xl">
          Create new product Brand
        </h2>
        <inventory-brands-add :value="brandsQuery" @created="brandsCreated" />
      </div>
    </UModal>
    <UModal v-model="showUnitsModal">
      <div class="p-10">
        <h2 class="text-xl">
          Create new Unit of measurement
        </h2>
        <inventory-units-add :value="unitsQuery" @created="unitCreated" />
      </div>
    </UModal>
  </div>
</template>
