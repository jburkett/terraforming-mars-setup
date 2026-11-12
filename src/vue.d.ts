// Vue-aware type checking resolves SFC details; this declaration also gives
// TypeScript-based tools such as ESLint a typed boundary for .vue imports.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
