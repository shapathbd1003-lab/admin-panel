import { useState, useEffect } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { auth, db } from '../firebase/config'

const ADMIN_KEY = import.meta.env.VITE_ADMIN_REGISTER_KEY ?? ''

const ERROR_MESSAGES = {
  'auth/email-already-in-use':   'An account with this email already exists.',
  'auth/invalid-email':          'Please enter a valid email address.',
  'auth/weak-password':          'Password must be at least 6 characters.',
  'auth/network-request-failed': 'Network error. Check your connection.',
}

export default function Register() {
  const navigate          = useNavigate()
  const [searchParams]    = useSearchParams()
  const inviteToken       = searchParams.get('invite')

  const [name,        setName]        = useState('')
  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [confirm,     setConfirm]     = useState('')
  const [secretKey,   setSecretKey]   = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [error,       setError]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [inviteValid, setInviteValid] = useState(null) // null=checking, true, false
  const [inviteEmail, setInviteEmail] = useState('')

  // Validate invite token if present
  useEffect(() => {
    if (!inviteToken) { setInviteValid(null); return }
    async function checkInvite() {
      try {
        const snap = await getDoc(doc(db, 'invites', inviteToken))
        if (!snap.exists())            { setInviteValid(false); return }
        const data = snap.data()
        if (data.used)                 { setInviteValid(false); return }
        if (data.expiresAt?.toDate() < new Date()) { setInviteValid(false); return }
        setInviteValid(true)
        if (data.email) { setEmail(data.email); setInviteEmail(data.email) }
      } catch {
        setInviteValid(false)
      }
    }
    checkInvite()
  }, [inviteToken])

  function validate() {
    if (!name.trim())      return 'Full name is required.'
    if (!email.trim())     return 'Email is required.'
    if (!password)         return 'Password is required.'
    if (password.length < 6) return 'Password must be at least 6 characters.'
    if (password !== confirm)  return 'Passwords do not match.'
    if (!inviteToken && ADMIN_KEY && secretKey !== ADMIN_KEY)
      return 'Invalid admin registration key.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setError('')
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await updateProfile(user, { displayName: name.trim() })

      // Mark invite as used
      if (inviteToken && inviteValid) {
        await updateDoc(doc(db, 'invites', inviteToken), { used: true, usedBy: email.trim(), usedAt: new Date() })
      }

      navigate('/', { replace: true })
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] ?? 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Invalid invite token
  if (inviteToken && inviteValid === false) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <div className="logo-circle">⛔</div>
            <h1>Invalid Link</h1>
            <p>This invite link has expired or already been used.</p>
          </div>
          <div className="login-footer" style={{ marginTop: 20 }}>
            <Link to="/login" style={{ color: 'var(--primary)' }}>← Back to Login</Link>
          </div>
        </div>
      </div>
    )
  }

  // Checking invite token
  if (inviteToken && inviteValid === null) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '20px auto' }} />
          <p style={{ color: 'var(--text-muted)' }}>Validating invite link...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 440 }}>

        <div className="login-logo">
          <div className="logo-circle">🔧</div>
          <h1>Create Admin Account</h1>
          <p>
            {inviteToken && inviteValid
              ? '✅ Valid invite link — fill in your details'
              : 'Register to manage মিস্ত্রি চাই platform'}
          </p>
        </div>

        {error && <div className="error-msg"><span>⚠</span> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className={`form-control ${error ? 'error-input' : ''}`}
              placeholder="Your full name"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              autoFocus
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              className={`form-control ${error ? 'error-input' : ''}`}
              placeholder="admin@servicepro.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              readOnly={!!inviteEmail}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                className={`form-control ${error ? 'error-input' : ''}`}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                autoComplete="new-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 16, color: 'var(--text-muted)', padding: 0,
                }}
                tabIndex={-1}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type={showPass ? 'text' : 'password'}
              className={`form-control ${error && password !== confirm ? 'error-input' : ''}`}
              placeholder="Re-enter your password"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setError('') }}
              autoComplete="new-password"
            />
          </div>

          {/* Only show secret key field if no valid invite and key is configured */}
          {!inviteToken && ADMIN_KEY && (
            <div className="form-group">
              <label>Admin Registration Key</label>
              <input
                type="password"
                className={`form-control ${error && secretKey !== ADMIN_KEY ? 'error-input' : ''}`}
                placeholder="Enter the admin secret key"
                value={secretKey}
                onChange={e => { setSecretKey(e.target.value); setError('') }}
                autoComplete="off"
              />
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                Contact your system administrator to get the registration key.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: 8 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                Creating account...
              </>
            ) : 'Create Account →'}
          </button>
        </form>

        <div className="login-footer" style={{ flexDirection: 'column', gap: 8 }}>
          <span>Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </span>
          <span>🔒 Secure admin access only</span>
        </div>
      </div>
    </div>
  )
}
