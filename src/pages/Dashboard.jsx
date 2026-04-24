import { useState, useMemo } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import Navbar       from '../components/Navbar'
import ProviderCard from '../components/ProviderCard'
import { useProviders } from '../hooks/useProviders'

function generateToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

function InviteModal({ onClose }) {
  const [step,  setStep]  = useState('idle') // idle | loading | done
  const [link,  setLink]  = useState('')
  const [copied, setCopied] = useState(false)

  async function createInvite() {
    setStep('loading')
    const token    = generateToken()
    const expires  = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    await setDoc(doc(db, 'invites', token), {
      used: false, createdAt: serverTimestamp(), expiresAt: expires,
    })
    const url = `${window.location.origin}/register?invite=${token}`
    setLink(url)
    setStep('done')
  }

  async function copy() {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-box" onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 8, fontSize: 16 }}>🔗 Invite Admin</h3>

        {step === 'idle' && (
          <>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Generate a one-time invite link. It expires in 24 hours and can only be used once.
            </p>
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={createInvite}>Generate Link</button>
            </div>
          </>
        )}

        {step === 'loading' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        )}

        {step === 'done' && (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
              Share this link. Valid for 24 hours, single use.
            </p>
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--divider)',
              borderRadius: 8, padding: '10px 12px', fontSize: 12,
              fontFamily: 'monospace', wordBreak: 'break-all',
              color: 'var(--primary)', marginBottom: 14,
            }}>
              {link}
            </div>
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
              <button className="btn btn-primary" onClick={copy}>
                {copied ? '✅ Copied!' : '📋 Copy Link'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const FILTERS = ['all', 'pending', 'approved', 'rejected']

const STAT_CONFIGS = [
  { key: 'all',      label: 'Total Providers', icon: '👥', color: '#1A237E', bg: '#E8EAF6' },
  { key: 'pending',  label: 'Pending Review',  icon: '⏳', color: '#1565C0', bg: '#E3F2FD' },
  { key: 'approved', label: 'Approved',         icon: '✅', color: '#2E7D32', bg: '#E8F5E9' },
  { key: 'rejected', label: 'Rejected',         icon: '❌', color: '#C62828', bg: '#FFEBEE' },
]

export default function Dashboard() {
  const { providers, loading, error } = useProviders()
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch]             = useState('')
  const [showInvite, setShowInvite]     = useState(false)

  const counts = useMemo(() => ({
    all:      providers.length,
    pending:  providers.filter(p => p.status === 'pending').length,
    approved: providers.filter(p => p.status === 'approved').length,
    rejected: providers.filter(p => p.status === 'rejected').length,
  }), [providers])

  const filtered = useMemo(() => {
    let list = activeFilter === 'all'
      ? providers
      : providers.filter(p => p.status === activeFilter)

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.serviceType?.toLowerCase().includes(q)
      )
    }
    return list
  }, [providers, activeFilter, search])

  if (error) return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h3>Failed to load providers</h3>
          <p>{error}</p>
        </div>
      </main>
    </div>
  )

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">

        {/* Page header */}
        <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1>Provider Dashboard</h1>
            <p>Manage and review service provider registrations in real-time</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowInvite(true)}>
            🔗 Invite Admin
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {STAT_CONFIGS.map(s => (
            <div
              key={s.key}
              className="stat-card"
              style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
              onClick={() => setActiveFilter(s.key)}
            >
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <div className="stat-info">
                <div className="label">{s.label}</div>
                <div className="value" style={{ color: s.color }}>
                  {loading ? '—' : counts[s.key]}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="filter-tabs">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="count">{counts[f]}</span>
              </button>
            ))}
          </div>

          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, phone or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="providers-table-wrap">
          <table className="providers-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Phone</th>
                <th>Service Type</th>
                <th>Base Fee</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="loading-row">
                  <td colSpan={6}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <div className="spinner spinner-sm" />
                      Loading providers...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="empty-icon">
                        {search ? '🔍' : activeFilter === 'pending' ? '⏳' : '👥'}
                      </div>
                      <h3>
                        {search
                          ? `No results for "${search}"`
                          : activeFilter === 'all'
                          ? 'No providers registered yet'
                          : `No ${activeFilter} providers`}
                      </h3>
                      <p>
                        {search
                          ? 'Try a different search term'
                          : 'Providers will appear here once they register'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(provider => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Result count */}
        {!loading && filtered.length > 0 && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, textAlign: 'right' }}>
            Showing {filtered.length} of {counts[activeFilter === 'all' ? 'all' : activeFilter]} providers
          </p>
        )}

      </main>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  )
}
