<script setup lang="ts">
// import { z } from "zod";
// import type { FormSubmitEvent } from "#ui/types";
import { sentenceCase } from 'change-case'

const config = useRuntimeConfig()
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})
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

const emit = defineEmits(['user-updated'])

// type Schema = z.output<typeof schema>;
const toast = useToast()
const createdUser = ref({})
const validationErrors = ref([])
const updateUserFormPending = ref(false)

const onSubmit = async () => {
  // console.log(updatedUserForm);
  createdUser.value = useFetch(
    config.public.API_BASE_URL +
    '/authentication/user_detail/update/' +
    props.user.id +
    '/',
    {
      method: 'PUT',
      lazy: true,
      body: updatedUserForm,
      onRequest({ request, options }) {
        updateUserFormPending.value = true
      },
      onRequestError({ request, error }) { },
      onResponse({ request, response, options }) {
        if (response.status === 400) {
          validationErrors.value = response._data
          return
        }
        toast.add({ title: 'User records has been updated' })
        updateUserFormPending.value = false
        emit('user-updated')
      },
      onResponseError({ request, response, error }) {
        // toast.add({ title: "There was an error adding new user" });
      },
    }
  )
}

const selectedGroups = ref([])
const selectedPermissions = ref([])
const groupIds = computed(() => {
  return props.user.groups.map((group) => group.id)
  // return props.user.groups.map((group) => {
  //   return group?.id;
  // });
})
const permissionIds = computed(() => {
  return props.user.user_permissions.map((permission) => permission.id)
  // return selectedPermissions.value.map((permission) => {
  //   return permission?.id;
  // });
})

const updatedUserForm: User = reactive({
  id: props.user.id,
  first_name: props.user.first_name,
  last_name: props.user.last_name,
  email: props.user.email,
  phone_number: props.user.phone_number,
  is_active: props.user.is_active,
  groups: groupIds,
  user_permissions: permissionIds,
})

// onMounted(() => {
//   userGroups.value = props.user.groups.map((group) => {
//     return {
//       id: group.id,
//       label: group.name,
//     };
//   });
// });

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
const userGroups = ref(
  groupList.value?.groups.filter((group) => {
    return props.user.groups.filter((userGroup) => userGroup.id === group.id)
  })
)

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
            name: sentenceCase(permission.name),
          }
        }),
      }
    },
  }
)
const userPermissions = ref(
  permissionsList.value?.items.filter((permission) => {
    return props.user.user_permissions.filter(
      (userPermissions) => userPermissions.id === permission.id
    )
  })
)
</script>

<template>
  <section>
    <div class="w-full bg-rose-500 dark:bg-gray-500 h-20" />
    <p class="prose prose-2xl dark:prose-invert -mt-5 bg-gray-500 text-rose-50 dark:text-white rounded-xl w-fit px-5">
      Edit User
    </p>
    <div class="px-10">
      <UForm :schema="schema" :state="state" class="space-y-4 mt-10" validate-on="['submit']" @submit="onSubmit">
        <UFormGroup label="First Name" name="first_name">
          <UInput v-model="updatedUserForm.first_name" />
          <validation-error v-if="validationErrors?.first_name" :errors="validationErrors?.first_name" />
        </UFormGroup>
        <UFormGroup label="Last Name" name="last_name">
          <UInput v-model="updatedUserForm.last_name" />
          <validation-error v-if="validationErrors?.last_name" :errors="validationErrors.last_name" />
        </UFormGroup>
        <UFormGroup label="Phone Number" name="phone_number">
          <UInput v-model="updatedUserForm.phone_number" type="phone_number" />
          <validation-error v-if="validationErrors?.phone_number" :errors="validationErrors.phone_number" />
        </UFormGroup>
        <UFormGroup label="Email" name="email">
          <UInput v-model="updatedUserForm.email" type="email" />
          <validation-error v-if="validationErrors?.email" :errors="validationErrors.email" />
        </UFormGroup>
        <UFormGroup v-if="groupList" label="Groups" name="groups">
          <USelectMenu v-model="user.groups" searchable searchable-placeholder="Search groups..." clear-search-on-close
            :options="groupList?.groups" multiple placeholder="Select groups" by="id">
            <template #empty>
              No groups
            </template>
          </USelectMenu>
          <validation-error v-if="validationErrors?.groups" :errors="validationErrors.groups" />
        </UFormGroup>
        <!-- {{ permissionIds }} -->
        <!-- {{ user.user_permissions }} -->
        <UFormGroup label="Additional Permissions" name="user_permissions">
          <USelectMenu v-model="user.user_permissions" searchable searchable-placeholder="Search permissions..."
            clear-search-on-close :options="permissionsList?.items" multiple option-attribute="name" by="id"
            placeholder="Select permissions">
            <template #empty>
              No groups
            </template>
          </USelectMenu>
          <validation-error v-if="validationErrors?.user_permissions" :errors="validationErrors.user_permissions" />
        </UFormGroup>

        <UButton class="mt-20" type="submit">
          Save
        </UButton>
      </UForm>
    </div>

    <!-- <UButton label="Show toast" @click="toast.add({ title: 'Hello world!' })" /> -->
  </section>
</template>
