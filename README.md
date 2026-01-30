# Battle Lobsters Dashboard 🦞

Player dashboard for Battle Lobsters - manage your inventory, loadouts, and collection.

## Features

- 🔐 **Secure Authentication** - Email/password + Google/Discord OAuth
- 📦 **Inventory Management** - View, filter, and organize your 600+ items
- 🎯 **Loadout Builder** - Create and save equipment builds with synergy detection
- 📚 **Collection Tracker** - Track every item discovered across all grades
- 🏆 **Achievements** - Track your progress and earn rewards
- ⚙️ **Settings** - Customize gameplay, audio, and privacy preferences

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Row-Level Security)
- **Icons**: Lucide React

## Getting Started

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be ready

### 2. Run Database Migrations

Copy the contents of `supabase/migrations/001_initial_schema.sql` and run it in the Supabase SQL Editor.

This creates:
- `profiles` - Player profiles with stats
- `inventory_items` - Item storage with grades
- `loadouts` - Saved equipment builds
- `collection` - Discovery tracking (codex)
- `achievements` - Achievement definitions
- `player_achievements` - Per-player achievement progress
- `game_sessions` - Play session tracking
- `user_settings` - Preferences

All tables have **Row-Level Security (RLS)** enabled - users can only access their own data.

### 3. Configure Auth Providers

In Supabase Dashboard → Authentication → Providers:

- **Email**: Enabled by default
- **Google**: Add Client ID and Secret from Google Cloud Console
- **Discord**: Add Client ID and Secret from Discord Developer Portal

Set the redirect URL to: `https://your-domain.com/auth/callback`

### 4. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials from the dashboard (Settings → API).

### 5. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
battle-lobsters-dashboard/
├── app/
│   ├── (auth)/           # Login, signup pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/      # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── loadouts/
│   │   ├── collection/
│   │   └── settings/
│   ├── auth/callback/    # OAuth callback handler
│   └── page.tsx          # Landing page
├── components/
│   ├── sidebar.tsx       # Dashboard navigation
│   ├── header.tsx        # Top bar with search
│   ├── inventory-grid.tsx
│   ├── inventory-filters.tsx
│   ├── loadout-card.tsx
│   ├── collection-grid.tsx
│   └── settings-form.tsx
├── lib/
│   ├── supabase/         # Supabase client configs
│   │   ├── client.ts     # Browser client
│   │   ├── server.ts     # Server client
│   │   └── middleware.ts # Auth middleware
│   └── database.types.ts # TypeScript types
├── supabase/
│   └── migrations/       # Database schema
└── middleware.ts         # Route protection
```

## Security

### Row-Level Security (RLS)

Every table has RLS policies ensuring users can only access their own data:

```sql
CREATE POLICY "Users can view own inventory" ON inventory_items
    FOR SELECT USING (auth.uid() = user_id);
```

### Route Protection

The middleware (`middleware.ts`) checks authentication before allowing access to `/dashboard/*` routes. Unauthenticated users are redirected to `/login`.

### Environment Variables

- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for anon key)
- `SUPABASE_SERVICE_ROLE_KEY` is server-only (never expose to client)

## Connecting to the Game

The dashboard shares the Supabase database with the Godot game. To sync:

1. **From Godot**: Use `HTTPRequest` node to call Supabase REST API
2. **Authentication**: Use Supabase Auth tokens
3. **Item drops**: Insert to `inventory_items` with `acquired_from` source
4. **Session tracking**: Create `game_sessions` records on play

Example Godot code:
```gdscript
var http = HTTPRequest.new()
var headers = ["apikey: " + SUPABASE_ANON_KEY, "Authorization: Bearer " + user_token]
http.request("https://your-project.supabase.co/rest/v1/inventory_items", headers, HTTPClient.METHOD_POST, JSON.stringify(item_data))
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Self-hosted

```bash
npm run build
npm start
```

## License

MIT
