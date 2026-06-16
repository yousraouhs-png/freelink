import { getAuth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '../../lib/supabase'

export default async function handler(req, res) {
  const { userId } = getAuth(req)
  if (!userId) return res.status(401).json({ error: 'Non authentifié' })

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    if (error) return res.status(404).json({ error: 'Profil non trouvé' })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const body = req.body
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert({ ...body, clerk_user_id: userId })
      .select()
      .single()

    if (error) return res.status(400).json({ error: error.message })
    return res.status(201).json(data)
  }

  if (req.method === 'PATCH') {
    const body = req.body
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('clerk_user_id', userId)
      .select()
      .single()

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json(data)
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}
