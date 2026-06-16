import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import {
  Building2, User, ChevronRight, ChevronLeft,
  Briefcase, MapPin, Globe, DollarSign, Plus, X, Zap
} from 'lucide-react'

const SKILL_OPTIONS = [
  'Design UI/UX', 'Développement Web', 'Développement Mobile', 'React', 'Vue.js',
  'Node.js', 'Python', 'Java', 'PHP', 'WordPress', 'Shopify', 'SEO', 'Marketing Digital',
  'Rédaction', 'Traduction', 'Comptabilité', 'Juridique', 'Data Science', 'IA / ML',
  'Photographie', 'Vidéo', 'Motion Design', 'Illustration', '3D', 'Musique', 'Voix off'
]

const INDUSTRY_OPTIONS = [
  'Tech & Software', 'E-commerce', 'Santé', 'Finance', 'Immobilier',
  'Éducation', 'Médias', 'Mode & Beauté', 'Restauration', 'Événementiel',
  'Architecture', 'Juridique', 'Consulting', 'Industrie', 'Autre'
]

// ── Étape 1 : Choix du type ──────────────────────────────
function StepType({ onSelect }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Vous êtes...</h2>
      <p className="text-gray-500 mb-8">Ce choix détermine votre expérience sur FreeLink.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onSelect('freelancer')}
          className="p-6 border-2 border-gray-200 rounded-2xl text-left hover:border-brand-500 hover:bg-brand-50 transition-all group"
        >
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
            <User size={28} className="text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Freelancer</h3>
          <p className="text-gray-500 text-sm">
            Je propose mes services et je cherche des missions passionnantes.
          </p>
        </button>
        <button
          onClick={() => onSelect('company')}
          className="p-6 border-2 border-gray-200 rounded-2xl text-left hover:border-brand-500 hover:bg-brand-50 transition-all group"
        >
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
            <Building2 size={28} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Entreprise</h3>
          <p className="text-gray-500 text-sm">
            Je cherche des talents freelances pour mes projets.
          </p>
        </button>
      </div>
    </div>
  )
}

// ── Étape 2 : Infos de base ──────────────────────────────
function StepBasicInfo({ userType, form, onChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {userType === 'freelancer' ? 'Votre profil freelancer' : 'Votre profil entreprise'}
      </h2>
      <p className="text-gray-500 mb-8">Ces informations seront visibles sur votre profil public.</p>
      <div className="space-y-5">
        <div>
          <label className="label">
            {userType === 'freelancer' ? 'Prénom et Nom' : 'Votre nom complet'} *
          </label>
          <input
            className="input"
            placeholder={userType === 'freelancer' ? 'Sophie Martin' : 'Jean Dupont'}
            value={form.name}
            onChange={e => onChange('name', e.target.value)}
          />
        </div>
        {userType === 'company' && (
          <div>
            <label className="label">Nom de l'entreprise *</label>
            <input
              className="input"
              placeholder="TechCorp SAS"
              value={form.company_name}
              onChange={e => onChange('company_name', e.target.value)}
            />
          </div>
        )}
        <div>
          <label className="label">Bio / Présentation *</label>
          <textarea
            className="input resize-none"
            rows={4}
            placeholder={
              userType === 'freelancer'
                ? 'Designer UI/UX avec 5 ans d\'expérience, spécialisée dans les interfaces mobiles...'
                : 'Startup tech en pleine croissance, nous développons des solutions SaaS pour...'
            }
            value={form.bio}
            onChange={e => onChange('bio', e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">{(form.bio || '').length}/300 caractères</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">
              <MapPin size={14} className="inline mr-1" />
              Ville / Pays
            </label>
            <input
              className="input"
              placeholder="Paris, France"
              value={form.location}
              onChange={e => onChange('location', e.target.value)}
            />
          </div>
          <div>
            <label className="label">
              <Globe size={14} className="inline mr-1" />
              Site web
            </label>
            <input
              className="input"
              placeholder="https://monsite.com"
              value={form.website}
              onChange={e => onChange('website', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Étape 3 : Détails spécifiques ───────────────────────
function StepDetails({ userType, form, onChange }) {
  const [skillInput, setSkillInput] = useState('')

  const addSkill = (skill) => {
    const current = form.skills || []
    if (!current.includes(skill) && current.length < 10) {
      onChange('skills', [...current, skill])
    }
    setSkillInput('')
  }

  const removeSkill = (skill) => {
    onChange('skills', (form.skills || []).filter(s => s !== skill))
  }

  if (userType === 'freelancer') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vos compétences</h2>
        <p className="text-gray-500 mb-8">Elles serviront à l'algorithme de matching.</p>
        <div className="space-y-5">
          {/* Compétences */}
          <div>
            <label className="label">Compétences (max 10)</label>
            <div className="flex gap-2 mb-2">
              <input
                className="input"
                placeholder="Rechercher ou ajouter..."
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && skillInput.trim() && addSkill(skillInput.trim())}
              />
              <button
                type="button"
                onClick={() => skillInput.trim() && addSkill(skillInput.trim())}
                className="btn-primary px-4 py-3"
              >
                <Plus size={18} />
              </button>
            </div>
            {/* Suggestions */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {SKILL_OPTIONS.filter(s =>
                (!skillInput || s.toLowerCase().includes(skillInput.toLowerCase())) &&
                !(form.skills || []).includes(s)
              ).slice(0, 12).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-brand-100 hover:text-brand-700 transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
            {/* Sélectionnées */}
            {(form.skills || []).length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-brand-50 rounded-xl">
                {(form.skills || []).map(s => (
                  <span key={s} className="inline-flex items-center gap-1 badge-blue">
                    {s}
                    <button onClick={() => removeSkill(s)} className="hover:text-red-500 ml-1">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                <DollarSign size={14} className="inline mr-1" />
                Tarif journalier (€)
              </label>
              <input
                type="number"
                className="input"
                placeholder="350"
                value={form.hourly_rate || ''}
                onChange={e => onChange('hourly_rate', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="label">
                <Briefcase size={14} className="inline mr-1" />
                Années d'expérience
              </label>
              <input
                type="number"
                className="input"
                placeholder="5"
                value={form.experience_years || ''}
                onChange={e => onChange('experience_years', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="label">Disponibilité</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'available', label: 'Disponible', color: 'border-green-400 bg-green-50 text-green-700' },
                { value: 'busy', label: 'Occupé(e)', color: 'border-yellow-400 bg-yellow-50 text-yellow-700' },
                { value: 'unavailable', label: 'Indisponible', color: 'border-red-400 bg-red-50 text-red-700' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange('availability', opt.value)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    form.availability === opt.value ? opt.color : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Entreprise
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre entreprise</h2>
      <p className="text-gray-500 mb-8">Ces informations aident les freelancers à mieux vous connaître.</p>
      <div className="space-y-5">
        <div>
          <label className="label">Secteur d'activité</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INDUSTRY_OPTIONS.map(ind => (
              <button
                key={ind}
                type="button"
                onClick={() => onChange('industry', ind)}
                className={`p-2.5 rounded-xl border text-sm font-medium transition-all text-center ${
                  form.industry === ind
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-200 text-gray-500 hover:border-brand-300'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Taille de l'entreprise</label>
          <div className="grid grid-cols-4 gap-2">
            {['1-10', '11-50', '51-200', '200+'].map(size => (
              <button
                key={size}
                type="button"
                onClick={() => onChange('company_size', size)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all text-center ${
                  form.company_size === size
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-200 text-gray-500 hover:border-brand-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page Onboarding ──────────────────────────────────────
export default function Onboarding() {
  const { user } = useUser()
  const router = useRouter()

  const [step, setStep] = useState(0) // 0=type, 1=basic, 2=details
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    company_name: '',
    skills: [],
    hourly_rate: '',
    experience_years: '',
    availability: 'available',
    industry: '',
    company_size: '',
  })

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleTypeSelect = (type) => {
    setUserType(type)
    setStep(1)
  }

  const validate = () => {
    if (step === 1) {
      if (!form.name.trim()) { toast.error('Le nom est requis'); return false }
      if (!form.bio.trim()) { toast.error('La bio est requise'); return false }
      if (userType === 'company' && !form.company_name.trim()) {
        toast.error('Le nom de l\'entreprise est requis'); return false
      }
    }
    if (step === 2 && userType === 'freelancer') {
      if (!form.skills.length) { toast.error('Ajoutez au moins une compétence'); return false }
    }
    return true
  }

  const handleNext = () => {
    if (!validate()) return
    if (step < 2) setStep(s => s + 1)
    else handleSubmit()
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.from('profiles').insert({
        clerk_user_id: user.id,
        user_type: userType,
        name: form.name.trim(),
        bio: form.bio.trim(),
        location: form.location.trim() || null,
        website: form.website.trim() || null,
        company_name: form.company_name.trim() || null,
        skills: userType === 'freelancer' ? form.skills : null,
        hourly_rate: form.hourly_rate || null,
        experience_years: form.experience_years || null,
        availability: userType === 'freelancer' ? form.availability : null,
        industry: form.industry || null,
        company_size: form.company_size || null,
      })

      if (error) throw error
      toast.success('Profil créé avec succès ! 🎉')
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la création du profil. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const steps = ['Type', 'Infos', 'Détails']

  return (
    <>
      <Head>
        <title>Créer mon profil — FreeLink</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center pt-8 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-brand-700">FreeLink</span>
          </div>
        </div>

        {/* Barre de progression */}
        {step > 0 && (
          <div className="max-w-md mx-auto w-full px-4 mb-6">
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i < step ? 'bg-brand-600 text-white' :
                    i === step ? 'bg-brand-600 text-white ring-4 ring-brand-100' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-1 flex-1 rounded-full transition-all ${i < step ? 'bg-brand-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card centrale */}
        <div className="flex-1 flex items-start justify-center px-4 pb-8">
          <div className="card w-full max-w-lg shadow-lg">
            {step === 0 && <StepType onSelect={handleTypeSelect} />}
            {step === 1 && <StepBasicInfo userType={userType} form={form} onChange={updateForm} />}
            {step === 2 && <StepDetails userType={userType} form={form} onChange={updateForm} />}

            {/* Navigation */}
            {step > 0 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="btn-ghost flex items-center gap-2"
                  disabled={loading}
                >
                  <ChevronLeft size={18} />
                  Retour
                </button>
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enregistrement...
                    </>
                  ) : step === 2 ? (
                    <>
                      Créer mon profil ✨
                    </>
                  ) : (
                    <>
                      Continuer
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
