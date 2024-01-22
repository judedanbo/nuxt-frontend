<template>
  <UPage>
    <ULandingHero title="Jodi ERP" description="Enterprise Resource planning (ERP) for Jodi Construction Limited">
      <template #links>
        <UButton to="/dashboard" target="_blank" size="lg" icon="i-heroicons-squares-2x2" variant="solid">
          Dashboard
        </UButton>

        <UButton to="/doc" target="_blank" size="lg" color="gray" icon="i-heroicons-book-open">
          Help
        </UButton>
      </template>
    </ULandingHero>

    <ULandingSection id="features" title="Focus on your core business">
      <template #description>
        Fully Featured Enterprise Resource planning Application
      </template>

      <UPageGrid>
        <UPageCard icon="i-heroicons-banknotes" title="Accounting" description="Like Nuxt UI, change the style of any component from your App Config or customize them specifically through the ui prop." />
        <UPageCard icon="i-heroicons-square-3-stack-3d" title="Inventory" description="Each component leverages the power of Vue's slots to give you the flexibility to build anything." />
        <UPageCard icon="i-heroicons-presentation-chart-line" title="Purchase Order" description="Nuxt UI Pro components aims to structure your content, they are responsive by design and will adapt to any screen size." />
        <UPageCard icon="i-heroicons-device-phone-mobile" title="Sales Order" description="Nuxt UI Pro components aims to structure your content, they are responsive by design and will adapt to any screen size." />
      </UPageGrid>
    </ULandingSection>
  </UPage>
</template>
