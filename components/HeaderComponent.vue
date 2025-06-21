<template>
  <UNavigationMenu
    tooltip
    popover
    collapsed
    :items="navItems"
    class="data-[orientation=horizontal]:border-b border-default data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48 gap-2"
    variant="pill"
    :ui="{
      viewport: 'sm:w-(--reka-navigation-menu-viewport-width) p-2',
      content: 'sm:w-auto p-2',
      childList: 'sm:w-96 p-2',
      childLinkDescription: 'text-balance line-clamp-2',
    }"
  />
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const navItems = ref<NavigationMenuItem[][]>([
  [
    {
      icon: "i-lucide-bar-chart-2",
      to: "/",
    },
  ],
  [
    {
      label: "Menu",
      type: "label",
    },
    {
      label: "Dashboard",
      icon: "i-lucide-menu",
      children: [
        {
          label: "Main",
          description: "Main information for seller",
          icon: "i-lucide-house",
          to: "/",
        },
        {
          label: "Sell",
          description: "Detailed information about sell products",
          icon: "i-lucide-trending-up",
          to: "/sell",
        },
        {
          label: "Returned",
          icon: "i-lucide-trending-down",
          description: "Detailed information about returned products",
          to: "/returned",
        },
        {
          label: "Product",
          icon: "i-lucide-box",
          description: "Detailed information about your products",
          to: "/product",
        },
        {
          label: "Price",
          icon: "i-lucide-dollar-sign",
          description: "Detailed information about your price on products",
          to: "/price",
        },
      ],
    },
    {
      label: "Settings",
      icon: "i-lucide-settings",
      children: [
        {
          label: "Settings",
          icon: "i-lucide-settings",
          description: "Settings main page",
          to: "/settings",
        },
        {
          label: "Dashboard",
          icon: "i-lucide-house",
          description: "Settings for your dashboard",
          to: "/settings/dashboard",
        },
        {
          label: "API",
          icon: "i-lucide-globe",
          description: "Settings for your API",
          to: "/settings/api",
        },
      ],
    },
  ],
  [
    {
      label: "Telegram",
      icon: "i-simple-icons-telegram",
      badge: "24/7",
      to: "https://t.me/uzum_dashboard_bot?start",
      target: "_blank",
    },
    {
      label: "Help",
      badge: "FAQ",
      icon: "i-lucide-circle-help",
      to: "/help",
    },
  ],
]);
</script>

<style scoped lang="tailwindcss"></style>
