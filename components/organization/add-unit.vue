<script setup lang="ts">
const config = useRuntimeConfig()
const emit = defineEmits(['created'])

// type Schema = z.output<typeof schema>;
const createdUnit = ref({})
const validationErrors = ref([])
// const newUserFormPending = ref(false)

const onSubmit = async () => {
  createdUnit.value = useFetch(
    config.public.API_BASE_URL + '/organization/units/',
    {
      method: 'POST',
      lazy: true,
      body: createUnit.value,
      // onRequest() {
      //   newUserFormPending.value = true
      // },
      onResponse({ response }) {
        if (response.status === 400) {
          validationErrors.value = response._data
          return
        }
        console.log(response);
        
        // newUserFormPending.value = false
        // Object.assign(createUnit.value, initialState)
        if (response.status === 201) {
          // toast.add({title: 'Unit created'})
           console.log('done')
          //  createUnit.value.name = ''
          //  createUnit.value.department_id = ''
           emit('created')
         }
      },
      onResponseError() {
        // toast.add({ title: "There was an error adding new user" });
      },
    }
  )
}
const selectedDepartment = ref([])
const departmentId = computed(() => selectedDepartment.value.id)
const { data: departments, pending, refresh, error } = useLazyFetch(
  config.public.API_BASE_URL + '/organization/departments/',
  {
    server: false,
    transform: (data) => {
      return {
        items: data.data.map((department) => {
          return {
            id: department.id,
            label: department.name,
          }
        }),
      }
    },
  }
)
const createUnit: Group = ref({
  name: '',
  department_id: departmentId,
})

</script>

<template>
  <section>
    <div class="w-full bg-rose-500 dark:bg-gray-500 h-20" />
    <p
      class="prose prose-2xl dark:prose-invert -mt-10 bg-gray-500 text-rose-50 dark:text-white rounded-r-full w-fit px-10 py-4"
    >
      Create New Unit
    </p>
    <div class="px-10">
      <UForm :schema="schema" :state="state" class="space-y-8 mt-10" validate-on="['submit']" @submit="onSubmit">
        <div>
          <div v-if="pending">
            <USkeleton class="w-full rounded" />
          </div>
          <div v-else-if="error">
            Failed to load departments {{ error }}
          </div>
          <UFormGroup v-else label="Departments" name="departments">
            <USelectMenu
              v-model="selectedDepartment" 
              :options="departments?.items"
              searchable 
              searchable-placeholder="Search department..." clear-search-on-close 
              placeholder="Select department"
            >
              <template #empty>
                No Departments
              </template>
              <template #option-empty="{ query }">
                <q>{{ query }}</q> department not found
              </template>
            </USelectMenu>
            <validation-error v-if="validationErrors?.department_id" :errors="validationErrors?.department_id" />
          </UFormGroup>
        </div>
        <UFormGroup
          label="Unit Name" name="name"
        >
          <UInput v-model="createUnit.name" />
          <validation-error v-if="validationErrors?.name" :errors="validationErrors?.name" />
        </UFormGroup>
        <UButton type="submit">
          Add Unit
        </UButton>
      </UForm>  
    </div>

    <!-- <UButton label="Show toast" @click="toast.add({ title: 'Hello world!' })" /> -->
  </section>
</template>
