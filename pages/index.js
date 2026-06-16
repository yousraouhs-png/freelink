import Head from 'next/head'
import Link from 'next/link'
import { SignInButton } from '@clerk/nextjs'
import Navbar from '../components/Navbar'
import {
  Zap, Shield, MessageCircle, FileText, CreditCard,
  Star, Users, TrendingUp, ArrowRight, CheckCircle, Lock
} from 'lucide-react'

// ── Données ──────────────────────────────────────────────
const FEATURES = [
  {
    icon: Zap,
    color: 'bg-yellow-50 text-yellow-600',
    title: 'Matching intelligent',
    desc: 'Swipez des profils comme sur Tinder. Un match se crée quand les deux parties sont intéressées.',
  },
  {
    icon: MessageCircle,
    color: 'bg-blue-50 text-blue-600',
    title: 'Messagerie sécurisée',
    desc: 'Échangez en toute confiance. Les numéros de téléphone et emails sont automatiquement masqués.',
  },
  {
    icon: FileText,
    color: 'bg-purple-50 text-purple-600',
    title: 'Contrats & Documents',
    desc: 'Signez vos contrats directement sur la plateforme avec signature électronique légale.',
  },
  {
    icon: CreditCard,
    color: 'bg-green-50 text-green-600',
    title: 'Paiements sécurisés',
    desc: 'Système escrow : votre argent est protégé et versé uniquement à la fin de la mission.',
  },
  {
    icon: Shield,
    color: 'bg-red-50 text-red-600',
    title: 'Données privées',
    desc: 'Vos informations personnelles restent confidentielles. Conformité RGPD garantie.',
  },
  {
    icon: Star,
    color: 'bg-orange-50 text-orange-600',
    title: 'Fil d\'actualité',
    desc: 'Publiez vos réalisations, vidéos et photos pour développer votre réputation.',
  },
]

const STEPS = [
  { n: '01', title: 'Créez votre profil', desc: 'Entreprise ou freelancer, renseignez vos besoins ou compétences en 5 minutes.' },
  { n: '02', title: 'Matchez', desc: 'Swipez les profils qui vous intéressent. Quand c\'est mutuel, c\'est un match !' },
  { n: '03', title: 'Collaborez', desc: 'Discutez, signez un contrat et lancez votre mission en toute sécurité.' },
  { n: '04', title: 'Payez en confiance', desc: 'Le paiement est sécurisé par notre système escrow. Validez quand la mission est terminée.' },
]

const STATS = [
  { value: '0%', label: 'Commission en beta', sub: 'Gratuit pendant le lancement' },
  { value: '100%', label: 'Sécurisé', sub: 'Paiements via Stripe' },
  { value: '2 min', label: 'Pour créer un profil', sub: 'Inscription rapide' },
]

// ── Composants ───────────────────────────────────────────
function FeatureCard({ icon: Icon, color, title, desc }) {
  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon size={24} />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function StepCard({ n, title, desc, last }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
          {n}
        </div>
        {!last && <div className="w-px flex-1 bg-brand-100 mt-2" />}
      </div>
      <div className="pb-8">
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

// ── Page principale ───────────────────────────────────────
export default function Home() {
  return (
    <>
      <Head>
        <title>FreeLink — Matchez avec les meilleurs freelancers</title>
        <meta name="description" content="La plateforme qui connecte entreprises et freelancers par matching intelligent. Sécurisée, simple, efficace." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen">
        <Navbar />

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500">
          {/* Décorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-36">
            <div className="max-w-3xl">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-white/90 text-sm mb-8">
                <Zap size={14} className="text-yellow-300" />
                <span>Lancement bêta — Inscription gratuite</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                Trouvez le bon
                <span className="text-yellow-300"> freelancer</span>
                <br />en quelques swipes
              </h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
                FreeLink connecte entreprises et freelancers par matching intelligent.
                Contrats, paiements et messagerie — tout se passe sur la plateforme. Zéro risque.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-yellow-50 transition-colors shadow-lg text-base">
                  Je commence gratuitement
                  <ArrowRight size={18} />
                </Link>
                <Link href="#how" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors border border-white/20 text-base">
                  Voir comment ça marche
                </Link>
              </div>

              {/* Garanties */}
              <div className="flex flex-wrap gap-6 mt-10">
                {['Inscription gratuite', 'Sans carte bancaire', 'RGPD conforme'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-white/70 text-sm">
                    <CheckCircle size={14} className="text-green-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-3 gap-6 md:gap-12">
              {STATS.map(({ value, label, sub }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-brand-700 mb-1">{value}</div>
                  <div className="font-semibold text-gray-800 text-sm md:text-base">{label}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Une seule plateforme pour trouver, collaborer et payer. Sans friction, sans risque.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                  Comment ça marche ?
                </h2>
                <p className="text-gray-500 text-lg mb-10">
                  En 4 étapes simples, de la création du profil à la fin de la mission.
                </p>
                <div>
                  {STEPS.map((s, i) => (
                    <StepCard key={s.n} {...s} last={i === STEPS.length - 1} />
                  ))}
                </div>
              </div>

              {/* Illustration */}
              <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-3xl p-8 flex flex-col gap-4">
                {/* Carte de profil simulée */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">S</div>
                    <div>
                      <div className="font-semibold text-gray-900">Sophie Martin</div>
                      <div className="text-sm text-gray-400">Designer UI/UX • Paris</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {['Figma', 'React', 'Branding'].map(s => (
                      <span key={s} className="badge-blue">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-green">Disponible</span>
                    <span className="text-gray-400 text-xs">• 85€/h</span>
                    <Star size={12} className="text-yellow-400 ml-auto" />
                    <span className="text-xs font-semibold">4.9</span>
                  </div>
                </div>

                {/* Boutons like/dislike */}
                <div className="flex justify-center gap-4">
                  <button className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-2xl hover:scale-110 transition-transform">✕</button>
                  <button className="w-14 h-14 rounded-full bg-brand-600 shadow-md flex items-center justify-center text-2xl hover:scale-110 transition-transform">♥</button>
                </div>

                {/* Match notification */}
                <div className="bg-brand-600 rounded-xl p-4 flex items-center gap-3 text-white">
                  <div className="text-2xl">🎉</div>
                  <div>
                    <div className="font-semibold text-sm">C'est un match !</div>
                    <div className="text-xs text-white/70">Vous et TechCorp vous êtes matchés</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SÉCURITÉ ── */}
        <section className="py-20 bg-brand-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <Lock size={40} className="text-brand-300 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Vos données restent privées
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
              Numéros de téléphone et adresses email sont masqués. Toute la collaboration
              se fait sur FreeLink. Vos données personnelles ne sont jamais partagées.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { icon: '🔒', title: 'Chiffrement E2E', desc: 'Tous vos messages sont chiffrés de bout en bout.' },
                { icon: '🛡️', title: 'Paiements PCI-DSS', desc: 'Stripe, certifié au plus haut niveau bancaire.' },
                { icon: '🇪🇺', title: 'RGPD conforme', desc: 'Données hébergées en Europe, droit à l\'effacement garanti.' },
              ].map(item => (
                <div key={item.title} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="py-20 bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Prêt à commencer ?
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              Rejoignez les premiers membres de FreeLink. Inscription gratuite, aucune carte requise.
            </p>
            <Link href="/sign-up" className="inline-flex items-center gap-2 btn-primary text-base px-10 py-4">
              Créer mon profil gratuitement
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-gray-900 text-white py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-bold">FreeLink</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2026 FreeLink. Tous droits réservés. RGPD conforme.
            </div>
            <div className="flex gap-4 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
              <Link href="/terms" className="hover:text-white transition-colors">CGU</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
