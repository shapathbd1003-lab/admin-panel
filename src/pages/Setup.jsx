import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { Link } from 'react-router-dom'
import { auth } from '../firebase/config'
import AppLogo from '../components/AppLogo'

const ADMIN_EMAIL    = 'admin@test.com'
const ADMIN_PASSWORD = '123456'
const ADMIN_NAME     = 'Admin'

export default function Setup() {
  const [step,   setStep]   = useState('idle') // idle | loading | done | error
  const [errMsg, setErrMsg] = useState('')

  async function runSetup() {
    setStep('loading')
    setErrMsg('')
    try {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD)
        await updateProfile(user, { displayName: ADMIN_NAME })
      } catch (err) {
        if (err.code !== 'auth/email-already-in-use') throw err
      }
      setStep('done')
    } catch (err) {
      setErrMsg(err.message)
      setStep('error')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 420 }}>

        <div className="login-logo">
          <AppLogo size={72} />
          <h1>Dev Setup</h1>
          <p>Create the default admin account for testing</p>
        </div>

        {step === 'idle' && (
          <>
            <div className="setup-creds-box">
              <div className="setup-creds-title">Admin credentials</div>
              <div className="setup-cred-row">
                <span className="setup-cred-label">Email</span>
                <code className="setup-cred-value">{ADMIN_EMAIL}</code>
              </div>
              <div className="setup-cred-row">
                <span className="setup-cred-label">Password</span>
                <code className="setup-cred-value">{ADMIN_PASSWORD}</code>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: 16 }}
              onClick={runSetup}
            >
              Create Admin Account →
            </button>
          </>
        )}

        {step === 'loading' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Creating account...</p>
          </div>
        )}

        {step === 'done' && (
          <div className="setup-success">
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <h3 style={{ marginBottom: 6 }}>Account ready!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
              Use these credentials to sign in.
            </p>
            <div className="setup-creds-box" style={{ marginBottom: 20 }}>
              <div className="setup-cred-row">
                <span className="setup-cred-label">Email</span>
                <code className="setup-cred-value">{ADMIN_EMAIL}</code>
              </div>
              <div className="setup-cred-row">
                <span className="setup-cred-label">Password</span>
                <code className="setup-cred-value">{ADMIN_PASSWORD}</code>
              </div>
            </div>
            <Link to="/login" className="btn btn-primary btn-full">
              Go to Login →
            </Link>
          </div>
        )}

        {step === 'error' && (
          <>
            <div className="error-msg">
              <span>⚠</span> {errMsg}
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <strong>Common fixes:</strong>
              <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                <li>Firebase Console → Authentication → Enable <strong>Email/Password</strong></li>
                <li>Check your Firebase config values</li>
              </ul>
            </div>
            <button
              className="btn btn-secondary btn-full"
              style={{ marginTop: 16 }}
              onClick={() => setStep('idle')}
            >
              Try Again
            </button>
          </>
        )}

        <div className="login-footer" style={{ marginTop: 20 }}>
          <Link to="/login" style={{ color: 'var(--primary)' }}>← Back to Login</Link>
        </div>
      </div>
    </div>
  )
}
