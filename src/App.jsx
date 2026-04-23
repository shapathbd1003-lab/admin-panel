import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { firebaseReady } from './firebase/config'
import Login          from './pages/Login'
import Register       from './pages/Register'
import Setup          from './pages/Setup'
import Dashboard      from './pages/Dashboard'
import ProviderDetail from './pages/ProviderDetail'
import LoadingSpinner from './components/LoadingSpinner'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullPage />
  if (!user)   return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullPage />
  if (user)    return <Navigate to="/" replace />
  return children
}

function NotConfigured() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F0F2F8', fontFamily: 'Inter, sans-serif', padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 36, maxWidth: 480, width: '100%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      }}>
        <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>🔧</div>
        <h2 style={{ textAlign: 'center', color: '#1A237E', marginBottom: 8 }}>Firebase Not Configured</h2>
        <p style={{ color: '#757575', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
          The <code style={{ background: '#E8EAF6', padding: '2px 6px', borderRadius: 4 }}>.env</code> file
          still has placeholder values. Follow these steps:
        </p>
        <ol style={{ color: '#424242', fontSize: 14, lineHeight: 2, paddingLeft: 20 }}>
          <li>Go to <strong>console.firebase.google.com</strong></li>
          <li>Create a project (or open existing one)</li>
          <li>Project Settings → Your apps → click <strong>&lt;/&gt;</strong> (Web)</li>
          <li>Copy the config values</li>
          <li>Open <code style={{ background: '#E8EAF6', padding: '2px 6px', borderRadius: 4 }}>admin-panel/.env</code> and replace the placeholder values</li>
          <li>Restart the dev server: <code style={{ background: '#E8EAF6', padding: '2px 6px', borderRadius: 4 }}>npm run dev</code></li>
        </ol>
        <div style={{
          marginTop: 20, padding: 14, background: '#E8EAF6', borderRadius: 8,
          fontFamily: 'monospace', fontSize: 12, color: '#1A237E', lineHeight: 1.8,
        }}>
          VITE_FIREBASE_API_KEY=AIza...<br/>
          VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com<br/>
          VITE_FIREBASE_PROJECT_ID=your-project-id<br/>
          VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com<br/>
          VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890<br/>
          VITE_FIREBASE_APP_ID=1:123:web:abc
        </div>
      </div>
    </div>
  )
}

export default function App() {
  if (!firebaseReady) return <NotConfigured />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute><Register /></PublicRoute>
        } />
        <Route path="/setup" element={
          <PublicRoute><Setup /></PublicRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/provider/:id" element={
          <ProtectedRoute><ProviderDetail /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
