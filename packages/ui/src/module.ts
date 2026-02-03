import { defineNuxtModule, addComponentsDir, addImports, createResolver } from "nuxt/kit";

export interface ModuleOptions {
  /**
   * Prefix for all components
   * @default 'D'(for Dashboard)
   * @example DStatCard,dbadge,DDataTable
   */
  prefix?: string;
}
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-dashboard-ui",
    configKey: "dashboardUI",
    compatibility: {
      nuxt: ">=3.0.0",
    },
  },
  defaults: {
    prefix: "D",
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // Auto-register all components from the components directory
    await addComponentsDir({
      path: resolve("./runtime/components"),
      prefix: options.prefix,
    });

    // Auto-import composables
    addImports([
      { name: 'useDataTable', from: resolve('./runtime/composables/useDataTable') },
      { name: 'useSortQuerySync', from: resolve('./runtime/composables/useSortQuerySync') },
      { name: 'useTableSort', from: resolve('./runtime/composables/useTableSort') },
    ]);
  },
});
