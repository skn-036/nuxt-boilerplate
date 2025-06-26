<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Primitive } from 'reka-ui';

import { buttonVariants } from '.';

import type { ButtonVariants } from '.';
import type { PrimitiveProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  class?: HTMLAttributes['class'];
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
});

const disabled = computed(() => props.disabled || props.loading);
</script>

<template>
  <Primitive
    data-slot="button"
    :as="as"
    :as-child="asChild"
    :disabled="disabled"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <Icon v-if="loading" name="svg-spinners:blocks-shuffle-3" />
    <slot :loading="loading" />
  </Primitive>
</template>
