import { UserButton, SignInButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function Navbar() {
  const { isSignedIn } = useUser()

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-brand-700">FreeLink</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="btn-ghost text-sm">Fonctionnalités</Link>
            <Link href="#how" className="btn-ghost text-sm">Comment ça marche</Link>
            <Link href="#pricing" className="btn-ghost text-sm">Tarifs</Link>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="btn-ghost text-sm">Connexion</button>
                </SignInButton>
                <Link href="/sign-up" className="btn-primary text-sm py-2">
                  Commencer gratuitement
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
