export enum ColorMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export const useDarkMode = () => {
  const colorMode = useColorMode();

  const isDark = computed(
    () =>
      colorMode.preference === 'dark' ||
      (colorMode.preference === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches),
  );

  const setColorMode = (mode: ColorMode) => {
    colorMode.preference = mode;
  };

  return {
    isDark,
    setColorMode,
    ...colorMode,
  };
};
