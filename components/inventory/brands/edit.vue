<script lang="ts" setup>
const config = useRuntimeConfig()
const formPending = ref(false)
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  brand: {
    type: Object as () => Brand ,
    required: true
  }
})
const formError = ref<FormError>({
  status: undefined,
  text: ''
})

const emit = defineEmits(['updated'])

const brandsForm = ref({ id: props.brand.id, name: props.brand.name })
const validationErrors = ref({
  name: [],
  brand_id: [],
})
const handleSubmit = async () => {
  return  useLazyFetch(config.public.API_BASE_URL +'/inventory/brands/'+ props.brand.id + '/', {
    method: 'PUT',
    body: brandsForm.value,
    onRequest(){
      formPending.value = true
    },
    onResponseError({response}){
      if(response.status === 400){
        validationErrors.value = response._data 
        return
      }
      formError.value.status = response.status
      formError.value.text = response.statusText
      console.log(response)
      formPending.value = false
    },
    onResponse({response}){
      if(response.status === 200){
        emit('updated', response._data)
        formPending.value = false
      }
    }
  })
}
</script>
<template>
  <section>
    <UForm :state="brandsForm" class="space-y-4 mt-10" @submit="handleSubmit">
      <UFormGroup label="Brand Name " name="name">
        <UInput v-model="brandsForm.name" required />
        <validation-error :errors="validationErrors?.name" />
      </UFormGroup>
  
      <UButton class="mt-20" type="submit" :disabled="formPending">
        Update Brand
      </UButton>
  
      <div v-if="formError.status " class="text-red-400 text-xs">
        <p>There was an error adding the category. Try again or contact your administrator with the message below </p>
        <p class="mt-2">
          Status code: {{ formError.status }}
        </p>
        <p>Error message: {{ formError.text }}</p>
      </div>
    </UForm>
  </section>
</template>
