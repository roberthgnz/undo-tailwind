// Code fork from https://github.com/unocss/unocss/blob/main/packages/inspector/client/composables/usePrettify.ts
import prettier from "prettier/standalone";
import parserCSS from "prettier/parser-postcss";
import { computed, unref } from "vue";

export function useCSSPrettify(content) {
  return computed(() => {
    try {
      return prettier.format(unref(content) || "", {
        parser: "css",
        plugins: [parserCSS],
        singleQuote: true,
        semi: false,
      });
    } catch (e) {
      console.error(e);
      return `/* Error on prettifying: ${e.message} */\n${
        unref(content) || ""
      }`;
    }
  });
}
