<script setup lang="ts">
// import { z } from "zod";
import { sentenceCase } from 'change-case'
const config = useRuntimeConfig()

const selectedGroups = ref([])
const selectedPermissions = ref([])
const groupIds = computed(() => {
  return selectedGroups.value.map((group) => {
    return group?.id
  })
})
const permissionIds = computed(() => {
  return selectedPermissions.value.map((permission) => {
    return permission?.id
  })
})

const initialState = {
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  groups: groupIds,
  user_permissions: permissionIds,
}

//  TODO fix form submit after validation error
// TODO Validate from at the front end
// const schema = z.object({
//   first_name: z.string(),
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
    config.public.API_BASE_URL + '/authentication/register/',
    {
      method: 'POST',
      lazy: true,
      body: createdUserForm.value,
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
        Object.assign(createdUserForm.value, initialState)
        emit('user-created')
      },
      onResponseError({ request, response, error }) {
        // toast.add({ title: "There was an error adding new user" });
      },
    }
  )
}
// async function onSubmit(event: FormSubmitEvent<Schema>) {
//   // Do something with data
//   console.log(createdUserForm);
//   const {
//     data: createdUser,
//     : userFormPending,
//     error,
//   } = useCreateRecord("/authentication/register/", createdUserForm);
//   if (createdUser) {
//     toast.add({ title: "New user added" });
//   }
//   if (error) {
//     toast.add({ title: "there was and error saving data" });
//   }

//   //   if (){

//   //   }
//   //   console.log(event.data);
// }

const createdUserForm: User = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  groups: groupIds,
  user_permissions: permissionIds,
})

const { data: groupList } = useFetch(config.public.API_BASE_URL + '/groups/', {
  lazy: true,
  server: false,
  transform: (data) => {
    return {
      groups: data.data.map((group) => {
        return {
          id: group.id,
          label: group.name,
        }
      }),
    }
  },
})

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
</script>

<template>
  <section>
    <div class="w-full bg-rose-500 dark:bg-gray-500 h-20" />
    <p
      class="prose prose-2xl dark:prose-invert -mt-10 bg-gray-500 text-rose-50 dark:text-white rounded-r-full w-fit px-10 py-4">
      Create New User
    </p>
    <div class="px-10">
      <UForm :schema="schema" :state="state" class="space-y-4 mt-10" validate-on="['submit']" @submit="onSubmit">
        <UFormGroup label="First Name" name="first_name">
          <UInput v-model="createdUserForm.first_name" />
          <validation-error v-if="validationErrors?.first_name" :errors="validationErrors?.first_name" />
        </UFormGroup>
        <UFormGroup label="Last Name" name="last_name">
          <UInput v-model="createdUserForm.last_name" />
          <validation-error v-if="validationErrors?.last_name" :errors="validationErrors.last_name" />
        </UFormGroup>
        <UFormGroup label="Phone Number" name="phone_number">
          <UInput v-model="createdUserForm.phone_number" type="phone_number" />
          <validation-error v-if="validationErrors?.phone_number" :errors="validationErrors.phone_number" />
        </UFormGroup>
        <UFormGroup label="Email" name="email">
          <UInput v-model="createdUserForm.email" type="email" />
          <validation-error v-if="validationErrors?.email" :errors="validationErrors.email" />
        </UFormGroup>

        <UFormGroup label="Groups" name="groups">
          <USelectMenu v-model="selectedGroups" searchable searchable-placeholder="Search groups..." clear-search-on-close
            :options="groupList?.groups" multiple placeholder="Select groups">
            <template #empty>
              No groups
            </template>
          </USelectMenu>
          <validation-error v-if="validationErrors?.groups" :errors="validationErrors.groups" />
        </UFormGroup>
        <UFormGroup label="Additional Permissions" name="user_permissions">
          <USelectMenu v-model="selectedPermissions" searchable searchable-placeholder="Search permissions..."
            clear-search-on-close :options="permissionsList?.items" multiple placeholder="Select permissions">
            <template #empty>
              No groups
            </template>
          </USelectMenu>
          <validation-error v-if="validationErrors?.user_permissions" :errors="validationErrors.user_permissions" />
        </UFormGroup>

        <UButton class="mt-20" type="submit">
          Submit
        </UButton>
      </UForm>
    </div>
    <!-- <UButton label="Show toast" @click="toast.add({ title: 'Hello world!' })" /> -->
  </section>
</template>
