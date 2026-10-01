# Phase 15: Error Resilience & Log Cleanliness - Context

**Gathered:** 2026-10-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix `likes.tsx` data fetching and photo mapping. Centralize logging with `logger.ts` to eliminate raw console.error/warn redboxes. Add robust fallbacks for unauthenticated/offline states across tabs and onboarding.

</domain>

<decisions>
## Implementation Decisions

### Logging Centralization (`logger.ts`)
- **Redbox Errors**: Suppress in prod, wrap in dev — prevents user-facing redboxes while maintaining dev visibility
- **Remote Logging**: No remote logging yet — satisfies "eliminate redboxes" without adding 3rd party SDK (Sentry/Datadog) bloat
- **Existing `console.*`**: Override global console methods — automatically captures existing logs without rewriting the entire codebase
- **Log Storage**: In-memory only — easiest to implement, sufficient for preventing UI crashes

### Fallbacks (Offline & Unauthenticated)
- **Unauthenticated Fallback**: Global auth overlay/redirect — handle missing auth at the root `_layout` level rather than per-screen checks
- **Offline State UI**: Global toast/banner — display "No connection" banner at the top, but leave cached UI visible
- **Data Fetch Error Fallback**: Inline empty/error states — replace the specific list (e.g., Discover feed) with a retry button

### `likes.tsx` Data Fetching
- **Fetching Strategy**: Batch query (Profile + Photo) — fetch the first photo alongside profile data via Supabase join to reduce latency
- **Missing Photo Fallback**: Default gradient/icon — gracefully handle profiles with broken or missing media
- **Pagination**: Infinite scroll with offset — standard approach matching the rest of the app

### the agent's Discretion

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- None specifically identified (will scout during planning)

### Established Patterns
- Data fetching via Supabase client

### Integration Points
- Root `_layout.tsx` for auth redirection
- `likes.tsx` data fetching

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
