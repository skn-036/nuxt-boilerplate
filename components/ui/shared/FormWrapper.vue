<script setup lang="ts">
type Props = {
  class?: string;
  label?: string;
  error?: string;
  required?: boolean;
};
const props = defineProps<Props>();

const id = useId();
</script>

<template>
  <div :class="$cn('flex flex-col gap-2', props.class)">
    <div v-if="label" class="flex items-center justify-between">
      <Label :for="id" :required="required">
        {{ label }} <span v-if="required" class="text-red-500"> *</span>
      </Label>
      <slot name="after_label" />
    </div>

    <slot :id="id" />
    <div v-if="error" class="text-xs text-red-500">{{ error }}</div>
  </div>
</template>
