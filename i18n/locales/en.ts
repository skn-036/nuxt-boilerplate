import { loadDirectoryFiles } from './helpers';

export default defineI18nLocale(async () => {
  return loadDirectoryFiles('en');
});
