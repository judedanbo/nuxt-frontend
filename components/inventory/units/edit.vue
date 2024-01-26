<script lang="ts" setup>
const config = useRuntimeConfig()
const formPending = ref(false)
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  unit: {
    type: Object as () => Unit ,
    required: true
  }
})
const formError = ref<FormError>({
  status: undefined,
  text: ''
})

const emit = defineEmits(['updated'])

const unitForm = ref({ id: props.unit.id, name: props.unit.name })
const validationErrors = ref({
  name: [],
  unit_id: [],
})
const handleSubmit = async () => {
  return  useLazyFetch(config.public.API_BASE_URL +'/inventory/units/'+ props.unit.id + '/', {
    method: 'PUT',
    body: unitForm.value,
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
    <UForm :state="unitForm" class="space-y-4 mt-10" @submit="handleSubmit">
      <UFormGroup label="Unit Name " name="name">
        <UInput v-model="unitForm.name" required />
        <validation-error :errors="validationErrors?.name" />
      </UFormGroup>
  
      <UButton class="mt-20" type="submit" :disabled="formPending">
        Update Unit
      </UButton>
  
      <div v-if="formError.status " class="text-red-400 text-xs">
        <p>There was an error adding the unit. Try again or contact your administrator with the message below </p>
        <p class="mt-2">
          Status code: {{ formError.status }}
        </p>
        <p>Error message: {{ formError.text }}</p>
      </div>
    </UForm>
  </section>
</template>
