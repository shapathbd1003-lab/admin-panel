import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { auth } from '../firebase/config'
import AppLogo from '../components/AppLogo'

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState('idle') // idle | loading | sent | error
  const [errMsg,  setErrMsg]  = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      await sendPasswordResetEmail(auth, email.trim())
      setStatus('sent')
    } catch (err) {
      const msg =
        err.code === 'auth/user-not-found'    ? 'No account found with this email.' :
        err.code === 'auth/invalid-email'     ? 'Invalid email address.' :
        err.code === 'auth/too-many-requests' ? 'Too many attempts. Try again later.' :
        `Error: ${err.code}`
      setErrMsg(msg)
      setStatus('error')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <AppLogo size={72} />
          <h1>Reset Password</h1>
          <p>We'll send a reset link to your email</p>
        </div>

        {status === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
            <h3 style={{ marginBottom: 8, color: 'var(--success)' }}>Email sent!</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
              Check your inbox at <strong>{email}</strong> and click the reset link.
            </p>
            <Link to="/login" className="btn btn-primary btn-full">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            {status === 'error' && (
              <div className="error-msg"><span>⚠</span> {errMsg}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setStatus('idle') }}
                  autoFocus
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                style={{ marginTop: 8 }}
                disabled={status === 'loading' || !email.trim()}
              >
                {status === 'loading' ? (
                  <>
                    <div className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                    Sending...
                  </>
                ) : 'Send Reset Link →'}
              </button>
            </form>

            <div className="login-footer" style={{ marginTop: 20 }}>
              <Link to="/login" style={{ color: 'var(--primary)' }}>← Back to Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
