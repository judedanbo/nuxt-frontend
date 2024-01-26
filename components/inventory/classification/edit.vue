<script lang="ts" setup>
const config = useRuntimeConfig()
const formPending = ref(false)
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  classification: {
    type: Object as () => Classification ,
    required: true
  }
})
const formError = ref<FormError>({
  status: undefined,
  text: ''
})

const emit = defineEmits(['updated'])

const classificationForm = ref({ id: props.classification.id, name: props.classification.name })
const validationErrors = ref({
  name: [],
  classification_id: [],
})
const handleSubmit = async () => {
  return  useLazyFetch(config.public.API_BASE_URL +'/inventory/classification/'+ props.classification.id + '/', {
    method: 'PUT',
    body: classificationForm.value,
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
    <UForm :state="classificationForm" class="space-y-4 mt-10" @submit="handleSubmit">
      <UFormGroup label="Classification Name " name="name">
        <UInput v-model="classificationForm.name" required />
        <validation-error :errors="validationErrors?.name" />
      </UFormGroup>
  
      <UButton class="mt-20" type="submit" :disabled="formPending">
        Update Classification
      </UButton>
  
      <div v-if="formError.status " class="text-red-400 text-xs">
        <p>There was an error adding the classification. Try again or contact your administrator with the message below </p>
        <p class="mt-2">
          Status code: {{ formError.status }}
        </p>
        <p>Error message: {{ formError.text }}</p>
      </div>
    </UForm>
  </section>
</template>
