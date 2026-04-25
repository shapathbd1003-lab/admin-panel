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
        <div className="logo-icon">
          <svg viewBox="0 0 64 64" width="26" height="26" xmlns="http://www.w3.org/2000/svg">
            <path d="M32,8 C41,8 50,14 50,23 C50,38 40,47 32,51 C24,47 14,38 14,23 C14,14 23,8 32,8 Z"
              fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
            <path d="M42,36 L35,29 C36,27 35,24 33,22 C31,20 28,20 27,21 L30,24 L28,26 L24,23 C23,25 23,28 25,30 C27,32 29,32 31,31 L38,38 C39,39 40,39 41,38 L42,37 C43,36 43,36 42,36 Z"
              fill="white"/>
            <circle cx="44" cy="16" r="6" fill="#FFB300"/>
            <circle cx="44" cy="16" r="2.8" fill="white"/>
          </svg>
        </div>
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
