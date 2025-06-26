<script setup lang="ts">
import { setLocale } from 'yup';
import { ar, en } from 'yup-locales';

const { isDark } = useDarkMode();
const { locale } = useI18n();

const localeMapper = { ar, en };
watch(
  () => locale.value,
  () => {
    const localeModule = localeMapper?.[locale.value];

    if (localeModule) setLocale(localeModule);
    else setLocale(en); // Fallback to English if locale not found
  },
  { immediate: true, flush: 'post' },
);
</script>

<template>
  <Toaster
    :theme="isDark ? 'dark' : 'light'"
    position="top-right"
    rich-colors
    close-button
  />

  <LayoutsSeoMeta>
    <NuxtPage />
  </LayoutsSeoMeta>
</template>
