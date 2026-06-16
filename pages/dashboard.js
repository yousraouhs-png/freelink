import { useEffect, useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import {
  Zap, Home, Shuffle, MessageCircle, FileText,
  User, Bell, Settings, Star, MapPin, Globe,
  Briefcase, TrendingUp, Users, DollarSign, CheckCircle
} from 'lucide-react'

// ── Sidebar ──────────────────────────────────────────────
function Sidebar({ active }) {
  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home, href: '/dashboard' },
    { id: 'match', label: 'Matching', icon: Shuffle, href: '/matching' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, href: '/messages', badge: 3 },
    { id: 'documents', label: 'Documents', icon: FileText, href: '/documents' },
    { id: 'profile', label: 'Mon profil', icon: User, href: '/profile' },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-gray-100 fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="text-xl font-bold text-brand-700">FreeLink</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active === item.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <item.icon size={18} />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Settings */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
          <Settings size={18} />
          Paramètres
        </Link>
      </div>
    </aside>
  )
}

// ── Stat Card ─────────────────────────────────────────────
function StatCard({ icon: Icon, color, label, value, sub }) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm font-medium text-gray-700">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

// ── Profile Summary ───────────────────────────────────────
function ProfileSummary({ profile }) {
  if (!profile) return null
  const isFreelancer = profile.user_type === 'freelancer'

  return (
    <div className="card">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-2xl shrink-0">
          {profile.name?.charAt(0)?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-lg truncate">{profile.name}</h3>
            {profile.verified && <CheckCircle size={16} className="text-brand-500 shrink-0" />}
          </div>
          {profile.company_name && (
            <p className="text-gray-500 text-sm">{profile.company_name}</p>
          )}
          <span className={`badge mt-1 ${isFreelancer ? 'badge-blue' : 'bg-orange-50 text-orange-700'}`}>
            {isFreelancer ? 'Freelancer' : 'Entreprise'}
          </span>
        </div>
      </div>

      {profile.bio && (
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{profile.bio}</p>
      )}

      <div className="space-y-2">
        {profile.location && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <MapPin size={14} />
            {profile.location}
          </div>
        )}
        {profile.website && (
          <div className="flex items-center gap-2 text-brand-600 text-sm">
            <Globe size={14} />
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
              {profile.website.replace('https://', '')}
            </a>
          </div>
        )}
        {isFreelancer && profile.hourly_rate && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <DollarSign size={14} />
            {profile.hourly_rate}€ / jour
          </div>
        )}
      </div>

      {isFreelancer && profile.skills?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.slice(0, 6).map(skill => (
              <span key={skill} className="badge-blue">{skill}</span>
            ))}
            {profile.skills.length > 6 && (
              <span className="badge bg-gray-100 text-gray-500">+{profile.skills.length - 6}</span>
            )}
          </div>
        </div>
      )}

      {isFreelancer && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className={`badge ${
            profile.availability === 'available' ? 'badge-green' :
            profile.availability === 'busy' ? 'badge bg-yellow-50 text-yellow-700' :
            'bg-red-50 text-red-700 badge'
          }`}>
            {profile.availability === 'available' ? '● Disponible' :
             profile.availability === 'busy' ? '● Occupé(e)' : '● Indisponible'}
          </span>
        </div>
      )}

      <div className="mt-4">
        <Link href="/profile" className="btn-secondary w-full text-center text-sm py-2.5">
          Modifier mon profil
        </Link>
      </div>
    </div>
  )
}

// ── Quick Action Card ─────────────────────────────────────
function QuickAction({ icon: Icon, title, desc, href, color }) {
  return (
    <Link href={href} className="card hover:shadow-md transition-all group cursor-pointer border-2 border-transparent hover:border-brand-100">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} />
      </div>
      <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-700 transition-colors">{title}</h4>
      <p className="text-gray-400 text-sm">{desc}</p>
    </Link>
  )
}

// ── Page Dashboard ────────────────────────────────────────
export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) return
    if (!user) { router.push('/sign-in'); return }
    fetchProfile()
  }, [user, isLoaded])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('clerk_user_id', user.id)
        .single()

      if (error || !data) {
        router.push('/onboarding')
        return
      }
      setProfile(data)
    } catch (err) {
      console.error(err)
      router.push('/onboarding')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Chargement...</p>
        </div>
      </div>
    )
  }

  const isFreelancer = profile?.user_type === 'freelancer'

  const stats = isFreelancer ? [
    { icon: Shuffle, color: 'bg-purple-50 text-purple-600', label: 'Matches', value: '0', sub: 'Cette semaine' },
    { icon: MessageCircle, color: 'bg-blue-50 text-blue-600', label: 'Messages', value: '0', sub: 'Non lus' },
    { icon: Briefcase, color: 'bg-green-50 text-green-600', label: 'Missions', value: '0', sub: 'En cours' },
    { icon: Star, color: 'bg-yellow-50 text-yellow-600', label: 'Note', value: '–', sub: 'Aucun avis encore' },
  ] : [
    { icon: Users, color: 'bg-purple-50 text-purple-600', label: 'Freelancers matchés', value: '0', sub: 'Cette semaine' },
    { icon: MessageCircle, color: 'bg-blue-50 text-blue-600', label: 'Conversations', value: '0', sub: 'Actives' },
    { icon: Briefcase, color: 'bg-green-50 text-green-600', label: 'Missions', value: '0', sub: 'En cours' },
    { icon: TrendingUp, color: 'bg-orange-50 text-orange-600', label: 'Budget dépensé', value: '0€', sub: 'Ce mois' },
  ]

  const quickActions = isFreelancer ? [
    { icon: Shuffle, title: 'Trouver des missions', desc: 'Swipez les offres des entreprises', href: '/matching', color: 'bg-purple-50 text-purple-600' },
    { icon: User, title: 'Mon portfolio', desc: 'Enrichissez votre profil', href: '/profile', color: 'bg-blue-50 text-blue-600' },
    { icon: MessageCircle, title: 'Mes messages', desc: '0 nouveau message', href: '/messages', color: 'bg-green-50 text-green-600' },
    { icon: FileText, title: 'Contrats & docs', desc: 'Gérez vos documents', href: '/documents', color: 'bg-orange-50 text-orange-600' },
  ] : [
    { icon: Shuffle, title: 'Trouver un freelancer', desc: 'Swipez les profils disponibles', href: '/matching', color: 'bg-purple-50 text-purple-600' },
    { icon: FileText, title: 'Créer une mission', desc: 'Publiez un besoin précis', href: '/missions/new', color: 'bg-blue-50 text-blue-600' },
    { icon: MessageCircle, title: 'Mes messages', desc: '0 nouveau message', href: '/messages', color: 'bg-green-50 text-green-600' },
    { icon: DollarSign, title: 'Paiements', desc: 'Gérez vos transactions', href: '/payments', color: 'bg-orange-50 text-orange-600' },
  ]

  return (
    <>
      <Head>
        <title>Dashboard — FreeLink</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Sidebar active="home" />

        {/* Main */}
        <main className="md:ml-64">
          {/* Top bar */}
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Bonjour, {profile?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-gray-400 text-sm">
                {isFreelancer ? 'Trouvez votre prochaine mission' : 'Trouvez votre prochain talent'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>

          <div className="p-6 max-w-6xl">
            {/* Bannière de bienvenue si profil complet = 0 missions */}
            <div className="bg-gradient-to-r from-brand-700 to-brand-500 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">Votre profil est prêt ! 🎉</h2>
                  <p className="text-white/80 text-sm max-w-md">
                    {isFreelancer
                      ? 'Commencez à swiper les offres d\'entreprises qui correspondent à vos compétences.'
                      : 'Commencez à swiper les freelancers disponibles pour vos projets.'}
                  </p>
                </div>
                <Link href="/matching" className="bg-white text-brand-700 font-bold px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors text-sm shrink-0 ml-4">
                  Commencer →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.map(s => <StatCard key={s.label} {...s} />)}
                </div>

                {/* Actions rapides */}
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-3">Actions rapides</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map(a => <QuickAction key={a.title} {...a} />)}
                  </div>
                </div>

                {/* Activité récente */}
                <div className="card">
                  <h2 className="text-base font-bold text-gray-900 mb-4">Activité récente</h2>
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                      <TrendingUp size={28} className="text-gray-300" />
                    </div>
                    <p className="text-gray-400 text-sm">Aucune activité pour le moment.</p>
                    <p className="text-gray-300 text-xs mt-1">Faites votre premier match pour commencer !</p>
                  </div>
                </div>
              </div>

              {/* Sidebar droite */}
              <div className="space-y-6">
                <ProfileSummary profile={profile} />

                {/* Complétude du profil */}
                <div className="card">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm">Complétude du profil</h3>
                  {[
                    { label: 'Nom & Bio', done: !!(profile?.name && profile?.bio) },
                    { label: 'Localisation', done: !!profile?.location },
                    { label: isFreelancer ? 'Compétences' : 'Secteur', done: isFreelancer ? !!(profile?.skills?.length) : !!profile?.industry },
                    { label: 'Photo de profil', done: false },
                    { label: isFreelancer ? 'Portfolio' : 'Site web', done: !!profile?.website },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3 py-2">
                      <CheckCircle
                        size={16}
                        className={item.done ? 'text-green-500' : 'text-gray-200'}
                      />
                      <span className={`text-sm ${item.done ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>Profil complété</span>
                      <span className="font-semibold text-brand-600">60%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-brand-500 rounded-full w-[60%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
