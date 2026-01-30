import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/settings-form'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch profile and settings
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const { data: settings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </div>

      <SettingsForm profile={profile!} settings={settings!} userEmail={user!.email!} />
    </div>
  )
}
