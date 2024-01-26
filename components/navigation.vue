<script lang="ts" setup>
import type { NavItem } from '@nuxt/content/dist/runtime/types'
const links = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/home',

  },
  {
    label: 'Company',
    icon: 'i-mdi-storefront-outline',
    to: '/company',
    children: [
     { label: 'Departments',
      to: '/company/departments'
    },
    {
      label: 'Units',
      to: '/company/units'
    }
    ]
  },
  {
    label: 'Accounting',
    icon: 'i-heroicons-banknotes',
    to: '/accounting'
  }, {
    label: 'Inventory',
    icon: 'i-heroicons-square-3-stack-3d',
    to: '/inventory',
    children: [
      {
        label: 'Products',
        to: '/inventory/products'
      },
      {
        label: 'Requisitions',
        to: '/inventory/requisitions'
      },
      {
        label: 'Brands',
        to: '/inventory/brands'
      },
      {
        label: 'Categories',
        to: '/inventory/categories'
      },
      {
        label: 'Classification',
        to: '/inventory/classification'
      },
      {
        label: 'Units of Measure',
        to: '/inventory/units'
      },
    ]
  }, {
    label: 'Purchase Order',
    icon: 'i-heroicons-presentation-chart-line',
    to: '/po'
  }, {
    label: 'Sales Order',
    icon: 'i-heroicons-square-3-stack-3d',
    to: '/so'
  },
  {
    label: 'Users Management',
    icon: 'i-heroicons-users',
    to: '/auth/',
    children: [{
      label: 'Users',
      to: '/auth/users'
    },
    {
      label: 'Groups',
      to: '/auth/groups'
    },
    ]
  },
]

</script>

<template>
  <UAside>
    <UNavigationTree :links="links" default-open />
  </UAside>
</template>