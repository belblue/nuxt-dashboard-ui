import { createConfigForNuxt } from "@nuxt/eslint-config/flat";

export default createConfigForNuxt({
  features: {
    tooling: true,
  },
}).append(
  {
    rules: {
      "vue/multi-word-component-names": "off",
      // Vue slot types use `(props: {}) => any` idiomatically
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-dynamic-delete": "off",
      // Optional props intentionally default to undefined
      "vue/require-default-prop": "off",
    },
  },
  {
    ignores: ["ignore.vue"],
  },
);
