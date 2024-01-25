<script lang="ts" setup>
const config = useRuntimeConfig()
const emit = defineEmits(['updated'])
const props = defineProps({
  product: {
    type: Number,
    required: true,
  },
})
const {
  data: productInfo,
  pending,
  // refresh,
  error,
} = useAsyncData('productInfo', async () => {
  const [product, classification, brands, category, units] = await Promise.all([
    $fetch(
      config.public.API_BASE_URL + '/inventory/products/' + props.product, {
        // onResponse({response}){
        //   if(response.status === 200){            
        //     productForm.value.name = response._data.name
        //     productForm.value.classification_id = response._data.classification_id?.id
        //     productForm.value.brand_id = response._data.brand_id?.id,
        //     productForm.value.category_id = response._data.category_id?.id,
        //     productForm.value.unit_id = response._data.unit_id?.id,
        //     productForm.value.restock_level = response._data.restock_level
        //   }
        // }
      }
    ) as Promise<Product>,
    $fetch(
      config.public.API_BASE_URL + '/inventory/classification/'
    ) as Promise<{ data: [{ id: number; name: string }] }>,
    $fetch(config.public.API_BASE_URL + '/inventory/brands/') as Promise<{
      data: [{ id: number; name: string }];
    }>,
    $fetch(config.public.API_BASE_URL + '/inventory/categories/') as Promise<{
      data: [{ id: number; name: string }];
    }>,
    $fetch(config.public.API_BASE_URL + '/inventory/units/') as Promise<{
      data: [{ id: number; name: string }];
    }>,
  ])
  
  return {
    product,
    classification,
    brands,
    category,
    units,
  }
})

const selectedClassification  = ref<{id: number | null, name: string}| undefined>({id: null, name: ''})
const selectedBrand = ref<{id: number | null, name: string}| undefined>({id: null, name: ''})
const selectedCategory = ref<{id: number | null, name: string}| undefined>({id: null, name: ''})
const selectedUnit = ref<{id: number | null, name: string}| undefined>({id: null, name: ''})

onMounted(() => {
  selectedClassification.value = productInfo.value?.product.classification_id
  selectedBrand.value = productInfo.value?.product.brand_id
  selectedCategory.value = productInfo.value?.product.category_id
  selectedUnit.value = productInfo.value?.product.unit_id

  // productForm.value.name = productInfo.value?.product.name,
  // productForm.value.classification_id = selectedClassificationId,
  // productForm.value.brand_id = selectedBrandId,
  // productForm.value.category_id = selectedCategoryId,
  // productForm.value.unit_id = selectedUnitId,
  // productForm.value.restock_level = productInfo.value?.product.restock_level
})


const selectedClassificationId = computed(() => {
  return selectedClassification.value?.id
})
const selectedBrandId = computed(() => {
  return selectedBrand.value?.id
})
const selectedCategoryId = computed(() => {
  return selectedCategory.value?.id
})
const selectedUnitId = computed(() => {
  return selectedUnit.value?.id
})

const classificationQuery = ref('')
const brandQuery = ref('')
const categoryQuery = ref('')
const unitQuery = ref('')

const showClassificationModal = ref(false)
// const showBrandModal = ref(false)
// const showCategoryModal = ref(false)
// const showUnitModal = ref(false)

const validationErrors = ref({
  name: [],
  classification_id: [],
  brand_id: [],
  category_id: [],
  unit_id: [],
  restock_level: [],
})
const formPending = ref(false)
const formError = ref({
  status: 0,
  text: '',
})
const productForm = ref<{name: string | undefined, classification_id: number| undefined | ComputedRef, brand_id: number|undefined|ComputedRef, category_id: number| undefined|ComputedRef, unit_id : number| undefined| ComputedRef, restock_level: number|undefined }>({
  name: undefined,
  classification_id: selectedClassificationId?? undefined,
  brand_id: undefined,
  category_id: undefined,
  unit_id: undefined,
  restock_level: undefined,
})

const handleSubmit = () => {
  formPending.value = true
  $fetch(config.public.API_BASE_URL + '/inventory/products/' + props.product + '/', {
    method: 'PUT',
    body: productForm.value,
    onResponseError({ response }) {
      if (response.status === 400) {
        // console.log(response._data)
        validationErrors.value = response._data
        return
      }
      formError.value.status = response.status
      formError.value.text = response.statusText
      // console.log(response)
      formPending.value = false
    },
    onResponse({ response }) {
      if (response.status === 200) {
        formPending.value = false
        emit('updated')
      }
    },
  })
}
</script>

<template>
  <section>
    <div v-if="pending">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error">
      <div class="alert alert-danger" role="alert">
        {{ error }}
      </div>
    </div>
    <UForm
      v-else
      :state="productForm"
      class="space-y-5 mt-10"
      @submit="handleSubmit"
    >
      {{ productForm }}      
      <UFormGroup label="Product category" name="category_id">
        <USelectMenu
          v-model="selectedCategory"
          v-model:query="categoryQuery"
          searchable
          searchable-placeholder="Search category"
          clear-search-on-close
          placeholder="Select unit"
          :options="productInfo?.category?.data"
          option-attribute="name"
          by="name"
          show-create-option-when="always"
        >
          <template #empty>
            <div class="flex flex-col items-center gap-2">
              No Categories
              <UButton
                label="Create Category"
                variant="outline"
                size="xs"
                color="green"
                @click="showClassificationModal = true"
              />
            </div>
          </template>
          <template #option-empty="{ query }">
            <div class="flex flex-col items-center gap-2">
              <p>
                <q>{{ query }}</q> not found in categories
              </p>
              <UButton
                label="Add to units"
                variant="outline"
                size="xs"
                color="green"
                @click="showClassificationModal = true"
              />
            </div>
          </template>
        </USelectMenu>
        <validation-error :errors="validationErrors?.classification_id" />
      </UFormGroup>
      <UFormGroup label="Product Brand" name="brand_id">
        <USelectMenu
          v-model="selectedBrand"
          v-model:query="brandQuery"
          searchable
          searchable-placeholder="Search brands"
          clear-search-on-close
          placeholder="Select brand"
          :options="productInfo?.brands?.data"
          option-attribute="name"
          by="name"
          show-create-option-when="always"
        >
          <template #empty>
            <div class="flex flex-col items-center gap-2">
              No Classification
              <UButton
                label="Create classification"
                variant="outline"
                size="xs"
                color="green"
                @click="showClassificationModal = true"
              />
            </div>
          </template>
          <template #option-empty="{ query }">
            <div class="flex flex-col items-center gap-2">
              <p>
                <q>{{ query }}</q> not found in classifications
              </p>
              <UButton
                label="Add to classification"
                variant="outline"
                size="xs"
                color="green"
                @click="showClassificationModal = true"
              />
            </div>
          </template>
        </USelectMenu>
        <validation-error :errors="validationErrors?.classification_id" />
      </UFormGroup>
      <UFormGroup label="Product unit" name="unit_id">
        <USelectMenu
          v-model="selectedUnit"
          v-model:query="unitQuery"
          searchable
          searchable-placeholder="Search unit"
          clear-search-on-close
          placeholder="Select unit"
          :options="productInfo?.units?.data"
          option-attribute="name"
          by="name"
          show-create-option-when="always"
        >
          <template #empty>
            <div class="flex flex-col items-center gap-2">
              No Units
              <UButton
                label="Create unit"
                variant="outline"
                size="xs"
                color="green"
                @click="showClassificationModal = true"
              />
            </div>
          </template>
          <template #option-empty="{ query }">
            <div class="flex flex-col items-center gap-2">
              <p>
                <q>{{ query }}</q> not found in classifications
              </p>
              <UButton
                label="Add to units"
                variant="outline"
                size="xs"
                color="green"
                @click="showClassificationModal = true"
              />
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
          :options="productInfo?.classification?.data"
          option-attribute="name"
          show-create-option-when="always"
          by="name"
        >
          <template #empty>
            <div class="flex flex-col items-center gap-2">
              No Classification
              <UButton
                label="Create classification"
                variant="outline"
                size="xs"
                color="green"
                @click="showClassificationModal = true"
              />
            </div>
          </template>
          <template #option-empty="{ query }">
            <div class="flex flex-col items-center gap-2">
              <p>
                <q>{{ query }}</q> not found in classifications
              </p>
              <UButton
                label="Add to classification"
                variant="outline"
                size="xs"
                color="green"
                @click="showClassificationModal = true"
              />
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
      <UButton class="mt-20" type="submit">
        Update
      </UButton>
    </UForm>
  </section>
</template>