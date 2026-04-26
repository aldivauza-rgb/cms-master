import { useState, useEffect } from 'react'
import LoginScreen from './pages/Login'
import Dashboard from './pages/Dashboard'
import { supabase } from './lib/supabase'

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = masih loading

  useEffect(() => {
    // Cek session aktif saat pertama load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null)
    })

    // Dengerin perubahan auth state (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Masih loading session — render kosong agar tidak flash login
  if (session === undefined) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--color-blue)', borderTopColor: 'transparent', animation: 'cms-spin .7s linear infinite' }} />
      <style>{`@keyframes cms-spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return session
    ? <Dashboard onLogout={handleLogout} />
    : <LoginScreen onLogin={setSession} />
}
