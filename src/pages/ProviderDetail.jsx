import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { db } from '../firebase/config'
import Navbar from '../components/Navbar'
import StatusBadge from '../components/StatusBadge'

function normalizeStatus(data) {
  if (data.isApproved === true)  return 'approved'
  if (data.isApproved === false) return 'rejected'
  return 'pending'
}

function ConfirmDialog({ message, confirmLabel, confirmColor, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-box" onClick={e => e.stopPropagation()}>
        <p className="dialog-msg">{message}</p>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button
            className="btn"
            style={{ background: confirmColor, color: '#fff', borderColor: confirmColor }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProviderDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [provider, setProvider] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [acting,   setActing]   = useState(false)
  const [confirm,  setConfirm]  = useState(null) // { type: 'approve'|'reject'|'delete' }

  useEffect(() => {
    const ref = doc(db, 'providers', id)
    const unsub = onSnapshot(ref,
      snap => {
        if (!snap.exists()) { setProvider(null); setLoading(false); return }
        setProvider({ id: snap.id, ...snap.data(), status: normalizeStatus(snap.data()) })
        setLoading(false)
      },
      err => { console.error(err); setLoading(false) }
    )
    return unsub
  }, [id])

  async function handleApprove() {
    setActing(true)
    try {
      await updateDoc(doc(db, 'providers', id), { isApproved: true })
      toast.success(`${provider.name} approved successfully`)
    } catch {
      toast.error('Failed to approve provider')
    } finally {
      setActing(false)
      setConfirm(null)
    }
  }

  async function handleReject() {
    setActing(true)
    try {
      await updateDoc(doc(db, 'providers', id), { isApproved: false })
      toast.success(`${provider.name} has been rejected`)
    } catch {
      toast.error('Failed to reject provider')
    } finally {
      setActing(false)
      setConfirm(null)
    }
  }

  async function handleDelete() {
    setActing(true)
    try {
      await deleteDoc(doc(db, 'providers', id))
      toast.success('Provider deleted')
      navigate('/', { replace: true })
    } catch {
      toast.error('Failed to delete provider')
      setActing(false)
      setConfirm(null)
    }
  }

  const CONFIRM_CONFIGS = {
    approve: {
      message:      `Approve ${provider?.name}? They will be able to receive service requests.`,
      confirmLabel: '✅ Approve',
      confirmColor: '#2E7D32',
      onConfirm:    handleApprove,
    },
    reject: {
      message:      `Reject ${provider?.name}? Their account will be disabled.`,
      confirmLabel: '❌ Reject',
      confirmColor: '#C62828',
      onConfirm:    handleReject,
    },
    delete: {
      message:      `Permanently delete ${provider?.name}? This cannot be undone.`,
      confirmLabel: '🗑 Delete',
      confirmColor: '#B71C1C',
      onConfirm:    handleDelete,
    },
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">

        <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn btn-secondary"
            style={{ padding: '6px 14px', fontSize: 13 }}
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <div>
            <h1>Provider Details</h1>
            <p>Review and manage this service provider's account</p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="spinner" style={{ margin: '0 auto 16px' }} />
            <p>Loading provider...</p>
          </div>
        ) : !provider ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3>Provider not found</h3>
            <p>This provider may have been deleted.</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="detail-layout">

            {/* Left column — profile */}
            <div className="detail-card">
              <div className="detail-profile-header">
                {provider.photo ? (
                  <img
                    src={provider.photo}
                    alt={provider.name}
                    className="detail-avatar"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <div className="detail-avatar-placeholder">
                    {provider.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                )}
                <div>
                  <h2 className="detail-name">{provider.name}</h2>
                  <StatusBadge status={provider.status} />
                </div>
              </div>

              <div className="detail-fields">
                <DetailRow icon="📞" label="Phone"        value={provider.phone}       />
                <DetailRow icon="✉️"  label="Email"        value={provider.email}       />
                <DetailRow icon="🪪"  label="NID Number"   value={provider.nid}         />
                <DetailRow icon="🔧"  label="Service Type" value={provider.serviceType} />
                <DetailRow icon="💰"  label="Base Fee"     value={provider.baseFee != null ? `৳ ${Number(provider.baseFee).toLocaleString()}` : null} />
                <DetailRow icon="⭐"  label="Rating"       value={provider.rating != null ? `${provider.rating} / 5` : null} />
                {provider.createdAt && (
                  <DetailRow
                    icon="📅"
                    label="Registered"
                    value={new Date(provider.createdAt.seconds * 1000).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  />
                )}
              </div>
            </div>

            {/* Right column — documents + actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Certificate */}
              <div className="detail-card">
                <h3 className="detail-section-title">📄 Certificate / License</h3>
                {provider.certificate ? (
                  <a href={provider.certificate} target="_blank" rel="noopener noreferrer">
                    <img
                      src={provider.certificate}
                      alt="Certificate"
                      className="detail-doc-image"
                      onError={e => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                    />
                    <div className="detail-doc-fallback" style={{ display: 'none' }}>
                      🔗 View Certificate (tap to open)
                    </div>
                  </a>
                ) : (
                  <div className="detail-doc-empty">No certificate uploaded</div>
                )}
              </div>

              {/* Actions */}
              <div className="detail-card">
                <h3 className="detail-section-title">⚡ Actions</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                  Current status: <strong><StatusBadge status={provider.status} /></strong>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {provider.status !== 'approved' && (
                    <button
                      className="btn action-btn action-approve"
                      disabled={acting}
                      onClick={() => setConfirm({ type: 'approve' })}
                    >
                      ✅ Approve Provider
                    </button>
                  )}
                  {provider.status !== 'rejected' && (
                    <button
                      className="btn action-btn action-reject"
                      disabled={acting}
                      onClick={() => setConfirm({ type: 'reject' })}
                    >
                      ❌ Reject Provider
                    </button>
                  )}
                  <button
                    className="btn action-btn action-delete"
                    disabled={acting}
                    onClick={() => setConfirm({ type: 'delete' })}
                  >
                    🗑 Delete Provider
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {confirm && (
        <ConfirmDialog
          {...CONFIRM_CONFIGS[confirm.type]}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}

function DetailRow({ icon, label, value }) {
  if (!value) return null
  return (
    <div className="detail-row">
      <span className="detail-row-icon">{icon}</span>
      <div>
        <div className="detail-row-label">{label}</div>
        <div className="detail-row-value">{value}</div>
      </div>
    </div>
  )
}
