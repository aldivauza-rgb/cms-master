import { useState, useEffect } from 'react'
import LoginScreen from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [screen, setScreen] = useState(() => localStorage.getItem('cms_screen') || 'login')
  useEffect(() => { localStorage.setItem('cms_screen', screen) }, [screen])

  return screen === 'login'
    ? <LoginScreen onLogin={() => setScreen('dashboard')} />
    : <Dashboard onLogout={() => setScreen('login')} />
}
