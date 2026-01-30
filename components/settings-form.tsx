'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Save, User, Bell, Volume2, Shield, Trash2 } from 'lucide-react'
import type { Tables } from '@/lib/database.types'

interface SettingsFormProps {
  profile: Tables<'profiles'>
  settings: Tables<'user_settings'>
  userEmail: string
}

export function SettingsForm({ profile, settings, userEmail }: SettingsFormProps) {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Profile state
  const [username, setUsername] = useState(profile.username)
  const [displayName, setDisplayName] = useState(profile.display_name || '')
  
  // Settings state
  const [theme, setTheme] = useState(settings.theme)
  const [showDamageNumbers, setShowDamageNumbers] = useState(settings.show_damage_numbers)
  const [screenShake, setScreenShake] = useState(settings.screen_shake)
  const [masterVolume, setMasterVolume] = useState(settings.master_volume)
  const [musicVolume, setMusicVolume] = useState(settings.music_volume)
  const [sfxVolume, setSfxVolume] = useState(settings.sfx_volume)
  const [notifyDrops, setNotifyDrops] = useState(settings.notify_drops)
  const [notifyAchievements, setNotifyAchievements] = useState(settings.notify_achievements)
  const [profilePublic, setProfilePublic] = useState(settings.profile_public)
  const [showOnlineStatus, setShowOnlineStatus] = useState(settings.show_online_status)
  const [allowFriendRequests, setAllowFriendRequests] = useState(settings.allow_friend_requests)

  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username, display_name: displayName || null })
        .eq('id', profile.id)

      if (profileError) throw profileError

      // Update settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .update({
          theme,
          show_damage_numbers: showDamageNumbers,
          screen_shake: screenShake,
          master_volume: masterVolume,
          music_volume: musicVolume,
          sfx_volume: sfxVolume,
          notify_drops: notifyDrops,
          notify_achievements: notifyAchievements,
          profile_public: profilePublic,
          show_online_status: showOnlineStatus,
          allow_friend_requests: allowFriendRequests,
        })
        .eq('user_id', profile.id)

      if (settingsError) throw settingsError

      setMessage({ type: 'success', text: 'Settings saved!' })
      router.refresh()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-500/10 border border-green-500 text-green-400' :
          'bg-red-500/10 border border-red-500 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="input w-full bg-slate-800 cursor-not-allowed opacity-60"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input w-full"
              pattern="^[a-zA-Z0-9_]+$"
              minLength={3}
              maxLength={24}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input w-full"
              placeholder="Optional"
              maxLength={32}
            />
          </div>
        </div>
      </div>

      {/* Game Settings */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Game Settings
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="input w-full"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="ocean">Ocean</option>
            </select>
          </div>

          <label className="flex items-center justify-between">
            <span>Show Damage Numbers</span>
            <input
              type="checkbox"
              checked={showDamageNumbers}
              onChange={(e) => setShowDamageNumbers(e.target.checked)}
              className="rounded"
            />
          </label>

          <label className="flex items-center justify-between">
            <span>Screen Shake</span>
            <input
              type="checkbox"
              checked={screenShake}
              onChange={(e) => setScreenShake(e.target.checked)}
              className="rounded"
            />
          </label>

          <div>
            <label className="block text-sm font-medium mb-2">Master Volume: {Math.round(masterVolume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Music Volume: {Math.round(musicVolume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">SFX Volume: {Math.round(sfxVolume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sfxVolume}
              onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h2>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span>Item Drop Notifications</span>
            <input
              type="checkbox"
              checked={notifyDrops}
              onChange={(e) => setNotifyDrops(e.target.checked)}
              className="rounded"
            />
          </label>

          <label className="flex items-center justify-between">
            <span>Achievement Notifications</span>
            <input
              type="checkbox"
              checked={notifyAchievements}
              onChange={(e) => setNotifyAchievements(e.target.checked)}
              className="rounded"
            />
          </label>
        </div>
      </div>

      {/* Privacy */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Privacy
        </h2>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span>Public Profile</span>
              <p className="text-sm text-slate-400">Allow others to view your profile</p>
            </div>
            <input
              type="checkbox"
              checked={profilePublic}
              onChange={(e) => setProfilePublic(e.target.checked)}
              className="rounded"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <span>Show Online Status</span>
              <p className="text-sm text-slate-400">Let friends see when you're online</p>
            </div>
            <input
              type="checkbox"
              checked={showOnlineStatus}
              onChange={(e) => setShowOnlineStatus(e.target.checked)}
              className="rounded"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <span>Allow Friend Requests</span>
              <p className="text-sm text-slate-400">Receive friend requests from other players</p>
            </div>
            <input
              type="checkbox"
              checked={allowFriendRequests}
              onChange={(e) => setAllowFriendRequests(e.target.checked)}
              className="rounded"
            />
          </label>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        {saving ? 'Saving...' : 'Save Settings'}
      </button>

      {/* Danger zone */}
      <div className="card border-red-500/30">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-400">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-medium py-2 px-4 rounded-lg transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  )
}
