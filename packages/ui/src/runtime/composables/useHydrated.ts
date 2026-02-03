import { ref, onMounted } from 'vue'

/**
 * useHydrated
 *
 * Returns a reactive boolean that is `false` during SSR and becomes `true`
 * once the component has mounted on the client (i.e. hydration is complete).
 *
 * This avoids hydration mismatches because the server and client initial
 * render both see `false`. Only after mount does it flip to `true`.
 *
 * @example
 * const hydrated = useHydrated()
 * // In template: v-if="hydrated" to show client-only content
 */
export function useHydrated() {
  const hydrated = ref(false)

  onMounted(() => {
    hydrated.value = true
  })

  return hydrated
}
