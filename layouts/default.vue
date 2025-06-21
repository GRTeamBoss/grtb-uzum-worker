<template>
  <UDashboardGroup>
    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar
          title="UZUM"
          icon="i-lucide-house"
          :toggle="{
            variant: 'subtle',
          }"
        >
          <template #leading> </template>

          <template #default> </template>

          <template #right>
            <UDashboardSearchButton variant="subtle" collapsed />
          </template>
        </UDashboardNavbar>
      </template>
    </UDashboardPanel>
    <ClientOnly>
      <UDashboardSearch
        shortcut="meta_k"
        v-model:search-term="searchTerm"
        :files="files"
        :navigation="navigation"
        :links="links"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>

    <slot />
  </UDashboardGroup>
</template>

<script setup lang="ts">
const { data: navigation } = await useAsyncData("navigation", () =>
  queryCollectionNavigation("content")
);
const { data: files } = useLazyAsyncData(
  "search",
  () => queryCollectionSearchSections("content"),
  { server: false }
);
const links = [
  {
    label: "Dashboard",
    icon: "i-lucide-menu",
    to: "/",
  },
  {
    label: "Settings",
    icon: "i-lucide-settings",
    to: "/settings",
  },
  {
    label: "Account",
    icon: "i-lucide-circle-user-round",
    to: "/account",
  },
];

const searchTerm = ref("");
</script>
