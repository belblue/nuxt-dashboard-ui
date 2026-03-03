// Stub for Nuxt #imports — used by vitest alias resolution.
// Tests that need useRoute/useRouter should vi.mock("#imports") with their own implementation.
export const useRoute = () => ({ query: {} });
export const useRouter = () => ({ replace: () => {} });
