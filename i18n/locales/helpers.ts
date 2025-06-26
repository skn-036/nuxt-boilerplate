export const loadDirectoryFiles = (dir: string) => {
  const modules = import.meta.glob<Record<string, string>>(
    ['./*/**/*.json', './*/**/*.ts', './*/**/*.js'],
    { eager: true, import: 'default' }, // get the JSON itself, not the module wrapper
  );

  const messages: Record<string, any> = {};

  for (const [filePath, contents] of Object.entries(modules)) {
    // ➜ "./locales/en/common/foo.json" → ["locales", "en", "common", "foo"]
    const parts = filePath
      .replace(/(?:^\.\/*|\.(?:json|js|ts)$)/g, '') // strip leading "./" & extensions
      .split('/');

    // ignore files that don’t live in the requested dir
    if (parts.shift() !== dir) continue;

    // drill down / create nodes as needed
    let node = messages;
    const leaf = parts.pop(); // the final segment becomes the key
    if (!leaf) continue; // guard for unexpected edge-cases

    for (const segment of parts) {
      node = node[segment] ??= {}; // create missing branch objects
    }
    node[leaf] = contents; // set the leaf value
  }

  return messages;
};
