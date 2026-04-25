import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { auth } from '../firebase/config'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const initials  = user?.email?.slice(0, 2).toUpperCase() ?? 'AD'

  async function handleLogout() {
    try {
      await signOut(auth)
      toast.success('Logged out successfully')
      navigate('/login', { replace: true })
    } catch {
      toast.error('Failed to log out')
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <svg viewBox="0 0 44 44" width="38" height="38" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          {/* Indigo rounded-square background */}
          <rect width="44" height="44" rx="10" fill="#0D1757"/>
          {/* Shield */}
          <path d="M22,6 C27,6 32,9 32,14 C32,22 27,27 22,30 C17,27 12,22 12,14 C12,9 17,6 22,6 Z"
            fill="none" stroke="white" strokeWidth="1.8"/>
          {/* Wrench */}
          <path d="M28,24 L24,20 C24,18 24,16 22,15 C21,14 19,14 18,15 L20,17 L19,18 L16,16 C16,17 16,19 17,20 C19,22 20,22 21,21 L26,26 C26,27 27,27 27,26 L28,25 C29,24 29,24 28,24 Z"
            fill="white"/>
          {/* Gold dot */}
          <circle cx="30" cy="10" r="4.5" fill="#FFB300"/>
          <circle cx="30" cy="10" r="2" fill="white"/>
        </svg>
        <span className="brand-name">মিস্ত্রি চাই</span>
        <span className="brand-badge">ADMIN</span>
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <div className="avatar">{initials}</div>
          <span style={{ fontSize: 13 }}>{user?.email}</span>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <span>⎋</span> Logout
        </button>
      </div>
    </nav>
  )
}
