-- Battle Lobsters Database Schema
-- Supabase + Row-Level Security

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    
    -- Player progression
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    xp_to_next_level INTEGER DEFAULT 100,
    
    -- Currency
    gold INTEGER DEFAULT 500,
    pearls INTEGER DEFAULT 0,  -- Premium currency
    
    -- Stats
    total_play_time_seconds INTEGER DEFAULT 0,
    enemies_defeated INTEGER DEFAULT 0,
    bosses_defeated INTEGER DEFAULT 0,
    items_collected INTEGER DEFAULT 0,
    highest_zone_reached TEXT DEFAULT 'shallow',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVENTORY ITEMS
-- ============================================
CREATE TABLE public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Item identity
    item_id TEXT NOT NULL,  -- e.g., 'samurai_kabuto'
    slot TEXT NOT NULL,     -- head, antennae, claws, thorax, legs, abdomen, tail, cosmetic
    
    -- Grade and stats
    grade TEXT NOT NULL DEFAULT 'general',  -- general, rare, epic, legendary, one_of_one
    grade_index INTEGER NOT NULL DEFAULT 0,
    stat_multiplier DECIMAL(4,2) NOT NULL DEFAULT 1.10,
    
    -- State
    is_equipped BOOLEAN DEFAULT FALSE,
    equipped_slot TEXT,  -- For claws: claw_left or claw_right
    is_favorite BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,  -- Prevent accidental sell/scrap
    
    -- 1of1 specific
    is_account_bound BOOLEAN DEFAULT FALSE,
    from_full_set BOOLEAN DEFAULT FALSE,
    config_hash BIGINT,  -- For 1of1 uniqueness
    
    -- Metadata
    acquired_at TIMESTAMPTZ DEFAULT NOW(),
    acquired_from TEXT,  -- 'drop:abyss:void_crab', 'craft', 'trade'
    
    CONSTRAINT valid_grade CHECK (grade IN ('general', 'rare', 'epic', 'legendary', 'one_of_one')),
    CONSTRAINT valid_slot CHECK (slot IN ('head', 'antennae', 'claws', 'thorax', 'legs', 'abdomen', 'tail', 'cosmetic'))
);

CREATE INDEX idx_inventory_user ON public.inventory_items(user_id);
CREATE INDEX idx_inventory_equipped ON public.inventory_items(user_id, is_equipped) WHERE is_equipped = TRUE;
CREATE INDEX idx_inventory_grade ON public.inventory_items(user_id, grade);

-- ============================================
-- LOADOUTS (saved builds)
-- ============================================
CREATE TABLE public.loadouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL DEFAULT 'New Loadout',
    is_active BOOLEAN DEFAULT FALSE,
    
    -- Equipment slots (references inventory_items.id)
    head_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    antennae_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    claw_left_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    claw_right_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    thorax_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    legs_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    abdomen_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    tail_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    cosmetic_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    
    -- Calculated synergy (updated on save)
    synergy_theme TEXT,
    synergy_count INTEGER DEFAULT 0,
    synergy_power DECIMAL(3,2) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_loadouts_user ON public.loadouts(user_id);

-- ============================================
-- COLLECTION (codex - tracks discovered items)
-- ============================================
CREATE TABLE public.collection (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    item_id TEXT NOT NULL,  -- e.g., 'samurai_kabuto'
    slot TEXT NOT NULL,
    
    -- Discovery tracking per grade
    general_discovered BOOLEAN DEFAULT FALSE,
    rare_discovered BOOLEAN DEFAULT FALSE,
    epic_discovered BOOLEAN DEFAULT FALSE,
    legendary_discovered BOOLEAN DEFAULT FALSE,
    one_of_one_discovered BOOLEAN DEFAULT FALSE,
    
    -- Best owned grade
    highest_grade_owned TEXT,
    times_acquired INTEGER DEFAULT 0,
    
    first_discovered_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, item_id)
);

CREATE INDEX idx_collection_user ON public.collection(user_id);

-- ============================================
-- ACHIEVEMENTS
-- ============================================
CREATE TABLE public.achievements (
    id TEXT PRIMARY KEY,  -- e.g., 'first_legendary', 'defeat_kraken'
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    category TEXT NOT NULL,  -- combat, collection, exploration, social
    
    -- Requirements (JSON for flexibility)
    requirements JSONB NOT NULL DEFAULT '{}',
    
    -- Rewards
    reward_gold INTEGER DEFAULT 0,
    reward_pearls INTEGER DEFAULT 0,
    reward_xp INTEGER DEFAULT 0,
    reward_item_id TEXT  -- Special achievement item
);

CREATE TABLE public.player_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL REFERENCES public.achievements(id),
    
    progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_player_achievements_user ON public.player_achievements(user_id);

-- ============================================
-- GAME SESSIONS (for play tracking)
-- ============================================
CREATE TABLE public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    
    -- Session stats
    zone TEXT,
    enemies_defeated INTEGER DEFAULT 0,
    bosses_defeated INTEGER DEFAULT 0,
    items_dropped INTEGER DEFAULT 0,
    gold_earned INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0
);

CREATE INDEX idx_sessions_user ON public.game_sessions(user_id);
CREATE INDEX idx_sessions_recent ON public.game_sessions(user_id, started_at DESC);

-- ============================================
-- SETTINGS (user preferences)
-- ============================================
CREATE TABLE public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Display
    theme TEXT DEFAULT 'dark',
    language TEXT DEFAULT 'en',
    show_damage_numbers BOOLEAN DEFAULT TRUE,
    screen_shake BOOLEAN DEFAULT TRUE,
    
    -- Audio
    master_volume DECIMAL(3,2) DEFAULT 0.80,
    music_volume DECIMAL(3,2) DEFAULT 0.70,
    sfx_volume DECIMAL(3,2) DEFAULT 0.80,
    
    -- Notifications
    notify_drops BOOLEAN DEFAULT TRUE,
    notify_achievements BOOLEAN DEFAULT TRUE,
    notify_friends BOOLEAN DEFAULT TRUE,
    
    -- Privacy
    profile_public BOOLEAN DEFAULT TRUE,
    show_online_status BOOLEAN DEFAULT TRUE,
    allow_friend_requests BOOLEAN DEFAULT TRUE,
    
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW-LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loadouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
    
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Profiles: Allow insert on signup (via trigger)
CREATE POLICY "Enable insert for auth" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Inventory: Users can only access their own items
CREATE POLICY "Users can view own inventory" ON public.inventory_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory" ON public.inventory_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory" ON public.inventory_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory" ON public.inventory_items
    FOR DELETE USING (auth.uid() = user_id);

-- Loadouts: Users can only access their own loadouts
CREATE POLICY "Users can view own loadouts" ON public.loadouts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own loadouts" ON public.loadouts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own loadouts" ON public.loadouts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own loadouts" ON public.loadouts
    FOR DELETE USING (auth.uid() = user_id);

-- Collection: Users can only access their own collection
CREATE POLICY "Users can view own collection" ON public.collection
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own collection" ON public.collection
    FOR ALL USING (auth.uid() = user_id);

-- Achievements: Public read for achievement definitions
-- Player achievements: Private per user
CREATE POLICY "Users can view own achievements" ON public.player_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own achievements" ON public.player_achievements
    FOR ALL USING (auth.uid() = user_id);

-- Game sessions: Users can only access their own sessions
CREATE POLICY "Users can view own sessions" ON public.game_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.game_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.game_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Settings: Users can only access their own settings
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'Lobster_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- Create default settings
    INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
    
    -- Create default loadout
    INSERT INTO public.loadouts (user_id, name, is_active)
    VALUES (NEW.id, 'Main Build', TRUE);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update profile timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_loadouts_updated_at
    BEFORE UPDATE ON public.loadouts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Update collection on inventory insert
CREATE OR REPLACE FUNCTION public.update_collection_on_item()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.collection (user_id, item_id, slot, highest_grade_owned, times_acquired)
    VALUES (NEW.user_id, NEW.item_id, NEW.slot, NEW.grade, 1)
    ON CONFLICT (user_id, item_id) DO UPDATE SET
        times_acquired = collection.times_acquired + 1,
        highest_grade_owned = CASE 
            WHEN NEW.grade_index > (
                SELECT grade_index FROM public.inventory_items 
                WHERE item_id = NEW.item_id AND user_id = NEW.user_id 
                ORDER BY grade_index DESC LIMIT 1
            ) THEN NEW.grade
            ELSE collection.highest_grade_owned
        END,
        general_discovered = collection.general_discovered OR (NEW.grade = 'general'),
        rare_discovered = collection.rare_discovered OR (NEW.grade = 'rare'),
        epic_discovered = collection.epic_discovered OR (NEW.grade = 'epic'),
        legendary_discovered = collection.legendary_discovered OR (NEW.grade = 'legendary'),
        one_of_one_discovered = collection.one_of_one_discovered OR (NEW.grade = 'one_of_one');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_inventory_item_added
    AFTER INSERT ON public.inventory_items
    FOR EACH ROW EXECUTE FUNCTION public.update_collection_on_item();

-- ============================================
-- SEED DATA: Achievements
-- ============================================
INSERT INTO public.achievements (id, name, description, category, requirements, reward_gold, reward_xp) VALUES
    ('first_kill', 'First Blood', 'Defeat your first enemy', 'combat', '{"enemies_defeated": 1}', 50, 10),
    ('kill_100', 'Claw Warrior', 'Defeat 100 enemies', 'combat', '{"enemies_defeated": 100}', 500, 100),
    ('kill_1000', 'Shell Crusher', 'Defeat 1,000 enemies', 'combat', '{"enemies_defeated": 1000}', 2000, 500),
    ('first_boss', 'Boss Hunter', 'Defeat your first boss', 'combat', '{"bosses_defeated": 1}', 200, 50),
    ('kraken_slayer', 'Kraken Slayer', 'Defeat the Kraken', 'combat', '{"specific_boss": "kraken"}', 5000, 1000),
    
    ('first_rare', 'Lucky Catch', 'Obtain your first Rare item', 'collection', '{"grade_obtained": "rare"}', 100, 25),
    ('first_epic', 'Purple Rain', 'Obtain your first Epic item', 'collection', '{"grade_obtained": "epic"}', 250, 50),
    ('first_legendary', 'Golden Hour', 'Obtain your first Legendary item', 'collection', '{"grade_obtained": "legendary"}', 1000, 200),
    ('first_1of1', 'One of a Kind', 'Obtain your first 1of1 item', 'collection', '{"grade_obtained": "one_of_one"}', 5000, 500),
    ('full_set', 'Complete Package', 'Collect a full themed set', 'collection', '{"full_set": true}', 10000, 1000),
    
    ('reach_coral', 'Reef Explorer', 'Reach the Coral Reef zone', 'exploration', '{"zone_reached": "coral"}', 200, 50),
    ('reach_kelp', 'Forest Diver', 'Reach the Kelp Forest zone', 'exploration', '{"zone_reached": "kelp"}', 500, 100),
    ('reach_abyss', 'Abyssal Descent', 'Reach the Abyssal Trench', 'exploration', '{"zone_reached": "abyss"}', 1000, 250),
    ('reach_void', 'Void Walker', 'Reach the Void Depths', 'exploration', '{"zone_reached": "void"}', 2500, 500),
    
    ('play_1hr', 'Getting Started', 'Play for 1 hour total', 'general', '{"play_time_hours": 1}', 100, 25),
    ('play_10hr', 'Dedicated', 'Play for 10 hours total', 'general', '{"play_time_hours": 10}', 500, 100),
    ('play_100hr', 'Shell Veteran', 'Play for 100 hours total', 'general', '{"play_time_hours": 100}', 5000, 1000);
