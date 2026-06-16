-- =========================================
-- FREELINK — Schéma de base de données
-- À coller dans Supabase > SQL Editor > Run
-- =========================================

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('freelancer', 'company')),

  -- Champs communs
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Champs Freelancer
  skills TEXT[], -- ex: ['React', 'Design', 'Python']
  hourly_rate INTEGER, -- tarif horaire en euros
  availability TEXT CHECK (availability IN ('available', 'busy', 'unavailable')),
  experience_years INTEGER,
  portfolio_urls TEXT[],

  -- Champs Entreprise
  company_name TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '200+')),
  industry TEXT,
  verified BOOLEAN DEFAULT FALSE
);

-- Table des matchs
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_a_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  profile_b_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_a_id, profile_b_id)
);

-- Table des publications (fil d'actualité)
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  media_urls TEXT[],
  media_type TEXT CHECK (media_type IN ('image', 'video', 'none')),
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_flagged BOOLEAN DEFAULT FALSE, -- flaggé si contient des infos personnelles
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des missions / contrats
CREATE TABLE IF NOT EXISTS missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  company_id UUID REFERENCES profiles(id),
  freelancer_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(10,2),
  commission_rate DECIMAL(4,2) DEFAULT 12.00, -- % prélevé par FreeLinkl
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'disputed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id UUID REFERENCES missions(id),
  stripe_payment_intent_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  net_amount DECIMAL(10,2) NOT NULL, -- montant versé au freelancer
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'held', 'released', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Politique : chaque utilisateur ne voit que son profil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (clerk_user_id = current_setting('app.clerk_user_id', true));

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (clerk_user_id = current_setting('app.clerk_user_id', true));

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (clerk_user_id = current_setting('app.clerk_user_id', true));

-- Politique : les posts sont publics (lecture)
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create own posts" ON posts
  FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE clerk_user_id = current_setting('app.clerk_user_id', true))
  );
