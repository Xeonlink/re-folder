import { clearConfigCache, format, resolveConfig } from "prettier";

function createAlwaysHasProxy(fieldValue) {
  return new Proxy(
    {},
    {
      get() {
        return fieldValue;
      },
      has() {
        return true;
      },
      getOwnPropertyDescriptor() {
        return {
          value: fieldValue,
          configurable: true,
          enumerable: true,
          writable: true,
        };
      },
    },
  );
}

const plugin = {
  parsers: createAlwaysHasProxy({
    astFormat: "merge",
    locStart: () => 0,
    locEnd: () => Infinity,
    preprocess: (text) => text,
    parse: async (text, options) => {
      const config = await resolveConfig(options.filepath);
      const pluginsLength = config?.plugins?.length ?? 0;

      let mergedText = text;

      for (let i = -pluginsLength + 1; i < 0; i++) {
        await clearConfigCache();
        const config = await resolveConfig(options.filepath);
        if (!config) {
          return mergedText;
        }

        config.plugins = options.plugins?.slice(-pluginsLength, i) ?? [];
        config.filepath = options.filepath;

        mergedText = await format(mergedText, config);
      }

      return mergedText;
    },
  }),
  printers: {
    merge: {
      print: (astPath) => astPath.node,
    },
  },
};

export const parsers = plugin.parsers;
export const printers = plugin.printers;
export default plugin;
