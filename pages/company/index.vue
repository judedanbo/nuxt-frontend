<script lang="ts" setup>
const breadcrumb = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/home'
}, {
  label: 'Company',
  icon: 'i-heroicons-building-library',
}]
</script>

<template>
  <section>
    <UBreadcrumb :links="breadcrumb" />
    <UPageHeader headline="Company" title="Company" description="Manage departments and units of the company" />
    <UPageBody />
  </section>
</template>

<style scoped></style>
