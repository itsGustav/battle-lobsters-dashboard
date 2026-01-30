import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Using 'any' until proper types are generated with `supabase gen types`
  return createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
