<script lang="ts" setup>
const config = useRuntimeConfig()

const route = useRoute()
const breadcrumb = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/home'
}, {
  label: 'Company',
  icon: 'i-heroicons-building-library',
  to: '/company'
}, {
  label: 'unit',
}]
const {data: unit, error, refresh, pending} = useLazyFetch(config.public.API_BASE_URL +'/organization/units/'+ route.params.id +'/')
</script>

<template>
  <section>
      <div v-if="pending" class="w-full h-96 flex flex-col justify-center items-center">
        <UIcon name="i-heroicons-arrow-path" class=" h-36 w-36 animate-spin font-thin text-green-500 dark:text-green-100" />
      </div>
      <div v-else-if="error" class="w-full h-96 flex flex-col justify-center items-center">
        <UIcon name="i-heroicons-exclamation-triangle" class=" h-36 w-36 animate-pulse font-thin text-rose-500" />
        {{ error }}
      </div>
      <div v-else>
        <UBreadcrumb :links="breadcrumb" />
        <UPageHeader :headline="unit.department_id.name" :title="unit.name" description="Unit Details" />
        <div class="flex flex-wrap gap-10 mt-5">
          <UPageCard title="Department" icon="i-mdi-storefront-outline" :to="'/company/departments/' + unit.department_id.id">
            <div class="flex gap-10">
              <p>
                {{ unit.department_id.name }}
              </p>
            </div>
          </UPageCard>
          
          <UPageCard title="Head" icon="i-mdi-account-supervisor-outline">
            <div class="flex flex-wrap gap-10">
              <p>
                {{ unit.head??"no unit head" }}
              </p>
            </div>
          </UPageCard>
          <UPageCard title="Total Staff" icon="i-mdi-account-group-outline">
            <div class="flex gap-10">
              <p>
                {{ unit?.staff?.length }}
              </p>
            </div>
          </UPageCard>
        </div>
        <UPageCard title="Staff" class="mt-4">
          <!-- {{ group.users }} -->
          <UTable :rows="unit.staff" :empty-state="{ icon: 'i-heroicons-user-group', label: 'No Staff of this unit yet.' }" />
          <!-- <PageList :items="group.users" /> -->
          <template #is_active-data="{ row }">
            <UToggle v-model="row.is_active" size="xs" color="green" disabled="true" />
            row
          </template>
        </UPageCard>
    </div>
  </section>
</template>