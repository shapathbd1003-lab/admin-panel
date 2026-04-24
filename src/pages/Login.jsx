import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../firebase/config'

const ERROR_MESSAGES = {
  'auth/invalid-credential':       'Invalid email or password.',
  'auth/user-not-found':           'No admin account found with this email.',
  'auth/wrong-password':           'Incorrect password.',
  'auth/too-many-requests':        'Too many attempts. Please try again later.',
  'auth/network-request-failed':   'Network error. Check your connection.',
  'auth/operation-not-allowed':    'Email/Password sign-in is not enabled. Go to Firebase Console → Authentication → Sign-in method and enable Email/Password.',
  'auth/user-disabled':            'This account has been disabled.',
  'auth/invalid-email':            'Invalid email address.',
  'auth/invalid-api-key':          'Invalid Firebase API key. Check your .env file.',
  'auth/app-not-authorized':       'This app is not authorized. Check Firebase Console → Authentication → Settings.',
}

const TEST_EMAIL    = 'admin@test.com'
const TEST_PASSWORD = '123456'

export default function Login() {
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }

    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] ?? `Login failed (${err.code ?? 'unknown error'})`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <div className="logo-circle">🔧</div>
          <h1>ServicePro Admin</h1>
          <p>Sign in to manage service providers</p>
        </div>

        {error && (
          <div className="error-msg">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              className={`form-control ${error ? 'error-input' : ''}`}
              placeholder="admin@servicepro.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className={`form-control ${error ? 'error-input' : ''}`}
              placeholder="Enter your password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              autoComplete="current-password"
            />
          </div>

          <div style={{ textAlign: 'right', marginTop: 4, marginBottom: 4 }}>
            <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--primary)' }}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: 8 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                Signing in...
              </>
            ) : (
              'Sign In →'
            )}
          </button>
        </form>

        <div
          className="setup-creds-box"
          style={{ marginTop: 20, cursor: 'pointer' }}
          title="Click to fill test credentials"
          onClick={() => { setEmail(TEST_EMAIL); setPassword(TEST_PASSWORD); setError('') }}
        >
          <div className="setup-creds-title">Test credentials (click to fill)</div>
          <div className="setup-cred-row">
            <span className="setup-cred-label">Email</span>
            <code className="setup-cred-value">{TEST_EMAIL}</code>
          </div>
          <div className="setup-cred-row">
            <span className="setup-cred-label">Password</span>
            <code className="setup-cred-value">{TEST_PASSWORD}</code>
          </div>
        </div>

        <div className="login-footer" style={{ flexDirection: 'column', gap: 8, marginTop: 14 }}>
          <span>
            <Link to="/setup" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              First time? Run Dev Setup
            </Link>
            {' '}·{' '}
            <Link to="/register" style={{ color: 'var(--text-muted)' }}>
              Register
            </Link>
          </span>
          <span>🔒 Secure admin access only</span>
        </div>
      </div>
    </div>
  )
}
