import type { ClassValue } from 'clsx';

declare module 'vue' {
  interface ComponentCustomProperties {
    $cn(...inputs: ClassValue[]): string;
  }
}

export {};
