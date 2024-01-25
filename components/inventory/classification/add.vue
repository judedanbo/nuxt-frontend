<script lang="ts" setup>
const config = useRuntimeConfig()
const formPending = ref(false)
const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})
const formError = ref({
  status: '',
  text: ''
})

const emit = defineEmits(['created'])
//  Todo Category accepts empty product on the backend

const validationErrors = ref([])
const classificationForm = ref({ name: props.value })
const handleSubmit = async () => {
  return  useLazyFetch(config.public.API_BASE_URL +'/inventory/classification/', {
    method: 'POST',
    body: classificationForm,
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
      formPending.value = false
    },
    onResponse({response}){
      if(response.status === 201){
        emit('created', response._data)
        formPending.value = false
      }
    }
  })
}


</script>

<template>
  <UForm class="space-y-4 mt-10" @submit="handleSubmit">
    <UFormGroup label="Classification Name " name="name">
      <UInput v-model="classificationForm.name" required/>
      <validation-error :errors="validationErrors?.name" />
    </UFormGroup>

    <UButton class="mt-20" type="submit" :disabled="formPending">
      Add Classification
    </UButton>

    <div v-if="formError.status !== ''" class="text-red-400 text-xs">
      <p>There was an error adding the category. Try again or contact your administrator with the message below </p>
      <p class="mt-2">Status code: {{ formError.status }}</p>
      <p>Error message: {{ formError.text }}</p>
    </div>
  </UForm>
</template>

<style scoped></style>
