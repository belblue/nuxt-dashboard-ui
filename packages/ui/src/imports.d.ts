/**
 * Ambient declaration for Nuxt's virtual `#imports` module.
 *
 * The runtime composables `useDataTable` and `useSortQuerySync` pull Nuxt
 * auto-imports from `#imports`. That alias only exists inside a Nuxt build,
 * so this shim lets `vue-tsc` resolve them when the package is typechecked
 * standalone (e.g. in CI), outside of a Nuxt context.
 */
declare module '#imports' {
  export { useAsyncData } from 'nuxt/app'
  export { useRoute, useRouter } from 'vue-router'
}
