export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use({
    install: (app) => {
      app.config.globalProperties.$cn = cn;
    },
  });
});
