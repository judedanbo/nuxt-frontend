<script setup lang="ts">
import { sentenceCase } from 'change-case'
const config = useRuntimeConfig()
const selectedPermissions = ref([])

const { data: permissionsList } = useFetch(
  config.public.API_BASE_URL + '/permissions/',
  {
    lazy: true,
    server: false,
    transform: (data) => {
      return {
        items: data.data.map((permission) => {
          return {
            id: permission.id,
            label: sentenceCase(permission.name),
          }
        }),
      }
    },
  }
)
const permissionIds = computed(() => {
  return selectedPermissions.value.map((permission) => {
    return permission?.id
  })
})

const initialState = {
  name: '',
  permissions: permissionIds,
}

//  TODO fix form submit after validation error
// TODO Validate from at the front end
// const schema = z.object({
//   name: z.string(),
//   last_name: z.string(),
//   phone_number: z.string(),
//   email: z.string().email("Invalid email"),
//   groups: z.string().array(),
//   user_permissions: z.string().array(),
// });

const emit = defineEmits(['user-created'])

// type Schema = z.output<typeof schema>;
const createdUser = ref({})
const validationErrors = ref([])
const newUserFormPending = ref(false)

const onSubmit = async () => {
  createdUser.value = useFetch(
    config.public.API_BASE_URL + '/groups/',
    {
      method: 'POST',
      lazy: true,
      body: createGroup.value,
      onRequest({ request, options }) {
        newUserFormPending.value = true
      },
      onRequestError({ request, error }) { },
      onResponse({ response }) {
        if (response.status === 400) {
          validationErrors.value = response._data
          return
        }
        newUserFormPending.value = false
        Object.assign(createGroup.value, initialState)
        emit('user-created')
      },
      onResponseError({ request, response, error }) {
        // toast.add({ title: "There was an error adding new user" });
      },
    }
  )
}
const createGroup: Group = ref({
  name: '',
  permissions: permissionIds,
})

</script>

<template>
  <section>
    <div class="w-full bg-rose-500 dark:bg-gray-500 h-20" />
    <p
      class="prose prose-2xl dark:prose-invert -mt-10 bg-gray-500 text-rose-50 dark:text-white rounded-r-full w-fit px-10 py-4"
    >
      Create New Group
    </p>
    <div class="px-10">
      <UForm :schema="schema" :state="state" class="space-y-4 mt-10" validate-on="['submit']" @submit="onSubmit">
        <UFormGroup
          label="Group Name" name="name"
        >
          <UInput v-model="createGroup.name" />
          <validation-error v-if="validationErrors?.name" :errors="validationErrors?.name" />
        </UFormGroup>
        <UFormGroup v-if="permissionsList?.items.length" label="Permissions" name="permissions">
          <USelectMenu
            v-model="selectedPermissions" 
            multiple :options="permissionsList?.items" searchable searchable-placeholder="Search permissions..." clear-search-on-close placeholder="Select permissions"
          />
        </UFormGroup>
        <UButton class="mt-20" type="submit">
          Submit
        </UButton>
      </UForm>
    </div>
    <!-- <UButton label="Show toast" @click="toast.add({ title: 'Hello world!' })" /> -->
  </section>
</template>
