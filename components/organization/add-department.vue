<script setup lang="ts">
const config = useRuntimeConfig()

const initialState = {
  name: '',
}

const emit = defineEmits(['created'])

// type Schema = z.output<typeof schema>;
const createdUser = ref({})
const validationErrors = ref([])
const newUserFormPending = ref(false)

const onSubmit = async () => {
  createdUser.value = useFetch(
    config.public.API_BASE_URL + '/organization/departments/',
    {
      method: 'POST',
      lazy: true,
      body: createDepartment.value,
      onRequest({ request, options }) {
        newUserFormPending.value = true
      },
      onResponse({ response }) {
        if (response.status === 400) {
          validationErrors.value = response._data
          return
        }
        newUserFormPending.value = false
        Object.assign(createDepartment.value, initialState)
        emit('created')
      },
     
    }
  )
}
const createDepartment: Group = ref({
  name: '',
})

</script>

<template>
  <section>
    <div class="w-full bg-rose-500 dark:bg-gray-500 h-20" />
    <p
      class="prose prose-2xl dark:prose-invert -mt-10 bg-gray-500 text-rose-50 dark:text-white rounded-r-full w-fit px-10 py-4"
    >
      Create New Department
    </p>
    <div class="px-10">
      <UForm :schema="schema" :state="state" class="space-y-4 mt-10" validate-on="['submit']" @submit="onSubmit">
        <UFormGroup
          label="Group Name" name="name"
        >
          <UInput id="name" v-model="createDepartment.name" name="name" />
          <validation-error v-if="validationErrors?.name" :errors="validationErrors?.name" />
        </UFormGroup>
        <UButton class="mt-20" type="submit">
          Submit
        </UButton>
      </UForm>
    </div>
    <!-- <UButton label="Show toast" @click="toast.add({ title: 'Hello world!' })" /> -->
  </section>
</template>
