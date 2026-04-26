import { useState } from 'react'
import Logo from '../components/Logo'
import TextField from '../components/TextField'
import { ButtonPrimary } from '../components/Button'
import Snackbar from '../components/Snackbar'
import { IconEye, IconEyeSlash, IconCloseCircle } from '../components/Icons'

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [snack, setSnack] = useState(null)

  const handleSubmit = (e) => {
    e?.preventDefault?.()
    const newErrors = {}
    if (!username.trim()) newErrors.username = 'Oops, kolom nama pengguna harus diisi yah.'
    if (!password)        newErrors.password = 'Oops, kolom kata sandi harus diisi yah.'
    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      setSnack({ type: 'error', title: 'Login gagal.', message: 'silahkan cek kembali nama pengguna atau kata sandi Anda' })
      return
    }
    setErrors({})
    setLoading(true)
    setTimeout(() => {
      if (password.toLowerCase() === 'wrong') {
        setLoading(false)
        setErrors({ password: 'Password anda belum sesuai. Coba lagi ya.' })
        setSnack({ type: 'error', title: 'Login gagal.', message: 'silahkan cek kembali nama pengguna atau kata sandi Anda' })
        return
      }
      setLoading(false)
      setSnack({ type: 'success', title: 'Login Berhasil', message: 'selamat menikmati beragam fitur cms kami, dan kelola konten website anda!' })
      setTimeout(() => onLogin(), 900)
    }, 1200)
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', position: 'relative' }}>
      {/* Left identity */}
      <div className="cms-login-identity" style={{
        width: 'min(45vw, 640px)', minHeight: '100vh', background: 'var(--color-navy)',
        position: 'relative', overflow: 'hidden', flexShrink: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div aria-hidden style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 'min(900px,140%)', aspectRatio: '1/1', borderRadius: '50%', border: '1px solid rgba(255,255,255,.04)' }}/>
        <div aria-hidden style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 'min(640px,100%)', aspectRatio: '1/1', borderRadius: '50%', border: '1px solid rgba(255,255,255,.05)' }}/>
        <div aria-hidden style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 'min(400px,65%)', aspectRatio: '1/1', borderRadius: '50%', border: '1px solid rgba(255,255,255,.07)' }}/>
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 60% at 50% 40%, rgba(4,108,242,.18), transparent 60%)' }}/>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, padding: 24 }}>
          <Logo color="#fff" />
          <div style={{ textAlign: 'center', maxWidth: 420, color: 'rgba(255,255,255,.65)' }}>
            <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 20, color: '#fff', marginBottom: 8 }}>
              Content Management System
            </div>
            <div style={{ fontFamily: 'var(--font-base)', fontSize: 13, lineHeight: 1.6 }}>
              Kelola semua konten website anda dari satu tempat. Aman, cepat, dan mudah.
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '32px 24px' }}>
        <form onSubmit={handleSubmit} style={{
          width: '100%', maxWidth: 512, borderRadius: 'var(--radius-2xl)',
          background: 'var(--color-card)',
          padding: 'clamp(24px, 4vw, 40px)',
          display: 'flex', flexDirection: 'column', gap: 40,
          boxShadow: '0 8px 32px rgba(5,27,62,.06)',
        }}>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.36, color: '#101828' }}>
            Selamat datang di content management system
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <TextField
              label="Nama Pengguna" required value={username}
              onChange={v => { setUsername(v); if (errors.username) setErrors(e => ({ ...e, username: null })) }}
              placeholder="Masukkan nama pengguna"
              icon={username ? <IconCloseCircle size={20} /> : null}
              onIconClick={() => setUsername('')}
              error={errors.username} autoFocus
            />
            <TextField
              label="Kata Sandi" required type={showPass ? 'text' : 'password'} value={password}
              onChange={v => { setPassword(v); if (errors.password) setErrors(e => ({ ...e, password: null })) }}
              placeholder="Masukkan kata sandi"
              icon={showPass ? <IconEye size={20} /> : <IconEyeSlash size={20} />}
              onIconClick={() => setShowPass(s => !s)}
              error={errors.password}
            />
            <ButtonPrimary type="submit" full loading={loading} onClick={handleSubmit}>Masuk</ButtonPrimary>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 12, letterSpacing: '0.04em', color: 'var(--color-text-base)' }}>Powered by</span>
            <span style={{ fontFamily: 'var(--font-base)', fontWeight: 800, fontSize: 12, letterSpacing: '0.04em', color: 'var(--color-text-dark)' }}>inagata</span>
          </div>
        </form>

        {snack && (
          <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 'var(--z-snack)' }}>
            <Snackbar {...snack} onClose={() => setSnack(null)} />
          </div>
        )}
      </div>
    </div>
  )
}
