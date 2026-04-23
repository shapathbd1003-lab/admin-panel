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
        <div className="logo-icon">🔧</div>
        <span className="brand-name">ServicePro</span>
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
