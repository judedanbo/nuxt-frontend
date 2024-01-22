<script lang="ts" setup>
const links = [
  {
    label: 'Features',
    to: '/#features',
    exactHash: true,
  },
  {
    label: 'Documentation',
    to: '/doc',
    target: '_blank',
  },
]

useHead({
  title: 'Jodi ERP',
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en',
  },
})

useSeoMeta({
  description:
    'The Enterprise Resource (ERP) planning application for Jodi Construction Limited',
})
</script>

<template>
  <UContainer>
    <UHeader :links="links">
      <template #logo>
        Jodi ERP
      </template>

      <template #right>
        <UColorModeButton />
        <UButton label="Log in" to="/auth/login" color="white" variant="ghost" trailing-icon="i-heroicons-arrow-right-20-solid" class="hidden lg:flex" />
      </template>
    </UHeader>
    <UPage>
      <template #left>
        <navigation />
      </template>
      <UMain>
        <slot />
      </UMain>
      <UFooter>
        <template #left>
          Copyright © {{ new Date().getFullYear() }}
        </template>
      </UFooter>
    </UPage>
  </UContainer>
</template>

<style scoped></style>
