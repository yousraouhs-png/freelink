# 🚀 Guide de Déploiement FreeLink
## Pas à pas — Sans développeur

---

## Ce dont tu auras besoin (tout gratuit)

| Service | Usage | Lien |
|---------|-------|------|
| GitHub | Héberger le code | github.com |
| Vercel | Mettre le site en ligne | vercel.com |
| Clerk | Gestion des comptes | clerk.com |
| Supabase | Base de données | supabase.com |

---

## ÉTAPE 1 — Créer un compte GitHub

1. Va sur **github.com** → clique "Sign up"
2. Crée un compte (c'est gratuit)
3. Crée un nouveau "repository" (répertoire) appelé **freelink**
4. Fais glisser le dossier `freelink/` dans l'interface GitHub ou utilise GitHub Desktop
   - Télécharge GitHub Desktop sur : desktop.github.com
   - Ouvre le dossier `freelink/` avec GitHub Desktop
   - Fais "Publish repository"

---

## ÉTAPE 2 — Configurer Clerk (authentification)

1. Va sur **clerk.com** → "Start for free"
2. Crée une application → nom : "FreeLink"
3. Active Google et LinkedIn comme méthodes de connexion
4. Dans "API Keys", copie :
   - **Publishable key** (commence par `pk_test_...`)
   - **Secret key** (commence par `sk_test_...`)
5. Garde ces clés, tu en auras besoin à l'étape 4

---

## ÉTAPE 3 — Configurer Supabase (base de données)

1. Va sur **supabase.com** → "Start your project"
2. Crée un nouveau projet → nom : "freelink"
3. Choisis une région **Europe (Frankfurt)** (RGPD)
4. Crée un mot de passe fort et note-le quelque part
5. Attends que le projet démarre (~2 minutes)
6. Va dans **SQL Editor** (menu gauche)
7. Clique "New query"
8. Copie-colle tout le contenu du fichier `lib/supabase-schema.sql`
9. Clique "Run" — tu verras "Success" si tout va bien
10. Va dans **Settings → API** et copie :
    - **Project URL** (ex: `https://abcd.supabase.co`)
    - **anon public key** (longue clé commençant par `eyJ...`)
    - **service_role key** (autre clé `eyJ...`)

---

## ÉTAPE 4 — Déployer sur Vercel

1. Va sur **vercel.com** → "Start Deploying"
2. Connecte ton compte GitHub
3. Importe le projet **freelink**
4. Dans "Environment Variables", ajoute ces variables
   (copie les valeurs de Clerk et Supabase) :

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY    = pk_test_...
CLERK_SECRET_KEY                     = sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL        = /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL        = /sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL  = /onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL  = /onboarding
NEXT_PUBLIC_SUPABASE_URL             = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY        = eyJ...
SUPABASE_SERVICE_ROLE_KEY            = eyJ...
```

5. Clique **Deploy** → attends 2-3 minutes
6. Vercel te donne une URL comme `freelink.vercel.app` — c'est ton site en ligne ! 🎉

---

## ÉTAPE 5 — Configurer ton domaine (optionnel)

1. Achète un domaine sur **OVH** ou **Namecheap** (~10€/an)
   - Suggestions : freelink.fr, getfreelink.fr, joinfreeling.com
2. Dans Vercel → ton projet → "Domains" → ajoute ton domaine
3. Suis les instructions pour pointer le domaine vers Vercel

---

## Résoudre les problèmes courants

**"Build failed" sur Vercel**
→ Vérifie que toutes les variables d'environnement sont bien renseignées

**"Cannot connect to database"**
→ Vérifie l'URL et les clés Supabase dans les variables Vercel

**"Clerk not configured"**
→ Dans le dashboard Clerk, ajoute ton domaine Vercel dans "Allowed Origins"

---

## Prochaines fonctionnalités à développer

Dis à Claude ce que tu veux coder ensuite :
- **"Code le système de matching (swipe)"** → Phase 2
- **"Code la messagerie en temps réel"** → Phase 2
- **"Code les paiements Stripe"** → Phase 3
- **"Code les contrats et signature"** → Phase 3

---

*Guide rédigé par Claude pour FreeLink — Juin 2026*
