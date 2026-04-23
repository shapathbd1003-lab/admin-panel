import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { auth, db } from '../firebase/config'

const ADMIN_EMAIL    = 'admin@test.com'
const ADMIN_PASSWORD = '123456'
const ADMIN_NAME     = 'Admin'

const FAKE_PROVIDERS = [
  {
    id: 'provider_001',
    name: 'Rakib Hossain',
    phone: '01712345678',
    email: 'rakib@gmail.com',
    nid: '1234567890',
    serviceType: 'এসি রিপেয়ার',
    baseFee: 500,
    rating: 4.5,
    photo: '',
    certificate: '',
    isApproved: null,   // pending
    availability: 'available',
  },
  {
    id: 'provider_002',
    name: 'Md. Karim',
    phone: '01812345678',
    email: 'karim@gmail.com',
    nid: '9876543210',
    serviceType: 'প্লাম্বিং',
    baseFee: 350,
    rating: 4.2,
    photo: '',
    certificate: '',
    isApproved: true,   // approved
    availability: 'available',
  },
  {
    id: 'provider_003',
    name: 'Farhan Ahmed',
    phone: '01912345678',
    email: 'farhan@gmail.com',
    nid: '1122334455',
    serviceType: 'ইলেকট্রিক কাজ',
    baseFee: 400,
    rating: 4.8,
    photo: '',
    certificate: '',
    isApproved: true,   // approved
    availability: 'working',
  },
  {
    id: 'provider_004',
    name: 'Sumaiya Begum',
    phone: '01612345678',
    email: 'sumaiya@gmail.com',
    nid: '5566778899',
    serviceType: 'ডিপ ক্লিনিং',
    baseFee: 600,
    rating: 4.0,
    photo: '',
    certificate: '',
    isApproved: false,  // rejected
    availability: 'unavailable',
  },
  {
    id: 'provider_005',
    name: 'Tanvir Islam',
    phone: '01512345678',
    email: 'tanvir@gmail.com',
    nid: '6677889900',
    serviceType: 'রং করা',
    baseFee: 450,
    rating: 3.9,
    photo: '',
    certificate: '',
    isApproved: null,   // pending
    availability: 'available',
  },
  {
    id: 'provider_006',
    name: 'Nusrat Jahan',
    phone: '01312345678',
    email: 'nusrat@gmail.com',
    nid: '3344556677',
    serviceType: 'যন্ত্রপাতি মেরামত',
    baseFee: 550,
    rating: 4.6,
    photo: '',
    certificate: '',
    isApproved: null,   // pending
    availability: 'available',
  },
]

export default function Setup() {
  const [step,      setStep]    = useState('idle') // idle | loading | done | error
  const [progress,  setProgress] = useState('')
  const [errMsg,    setErrMsg]  = useState('')

  async function runSetup() {
    setStep('loading')
    setErrMsg('')

    try {
      // Step 1 — create admin Firebase Auth account
      setProgress('Creating admin account...')
      let uid
      try {
        const { user } = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD)
        await updateProfile(user, { displayName: ADMIN_NAME })
        uid = user.uid
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          setProgress('Admin account already exists, skipping...')
          await new Promise(r => setTimeout(r, 600))
        } else {
          throw err
        }
      }

      // Step 2 — seed fake providers into Firestore
      setProgress('Seeding fake providers...')
      const col = collection(db, 'providers')
      for (const p of FAKE_PROVIDERS) {
        const { id, ...data } = p
        await setDoc(doc(col, id), {
          ...data,
          createdAt: serverTimestamp(),
        })
      }

      setProgress('Done!')
      setStep('done')
    } catch (err) {
      setErrMsg(err.message)
      setStep('error')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 440 }}>

        <div className="login-logo">
          <div className="logo-circle">⚙️</div>
          <h1>Dev Setup</h1>
          <p>Create the admin account and seed test data</p>
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

            <div className="setup-creds-box" style={{ marginTop: 12 }}>
              <div className="setup-creds-title">Fake providers to seed ({FAKE_PROVIDERS.length})</div>
              {FAKE_PROVIDERS.map(p => (
                <div className="setup-cred-row" key={p.id}>
                  <span className="setup-cred-label">{p.name}</span>
                  <span style={{ fontSize: 12 }}>
                    {p.isApproved === true
                      ? <span style={{ color: '#2E7D32', fontWeight: 600 }}>✅ approved</span>
                      : p.isApproved === false
                      ? <span style={{ color: '#C62828', fontWeight: 600 }}>❌ rejected</span>
                      : <span style={{ color: '#1565C0', fontWeight: 600 }}>⏳ pending</span>}
                  </span>
                </div>
              ))}
            </div>

            <button
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: 16 }}
              onClick={runSetup}
            >
              Run Setup →
            </button>
          </>
        )}

        {step === 'loading' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{progress}</p>
          </div>
        )}

        {step === 'done' && (
          <div className="setup-success">
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <h3 style={{ marginBottom: 6 }}>Setup complete!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
              Admin account created and {FAKE_PROVIDERS.length} providers seeded.
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
                <li>Firebase Console → Authentication → Sign-in method → Enable <strong>Email/Password</strong></li>
                <li>Firebase Console → Firestore → Create database (start in <strong>test mode</strong>)</li>
                <li>Check your <code>.env</code> file has the correct Firebase config values</li>
              </ul>
            </div>
            <button
              className="btn btn-secondary btn-full"
              style={{ marginTop: 16 }}
              onClick={() => { setStep('idle'); setProgress('') }}
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
