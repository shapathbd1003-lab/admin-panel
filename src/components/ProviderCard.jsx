import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'

export default function ProviderCard({ provider }) {
  const navigate = useNavigate()

  return (
    <tr onClick={() => navigate(`/provider/${provider.id}`)}>
      <td>
        <div className="provider-avatar-cell">
          {provider.photo ? (
            <img
              src={provider.photo}
              alt={provider.name}
              className="provider-avatar"
              onError={e => { e.target.style.display = 'none' }}
            />
          ) : (
            <div className="provider-avatar-placeholder">
              {provider.name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
          )}
          <div>
            <div className="provider-name">{provider.name}</div>
            <div className="provider-sub">{provider.email || '—'}</div>
          </div>
        </div>
      </td>
      <td>{provider.phone}</td>
      <td>{provider.serviceType || '—'}</td>
      <td>৳ {provider.baseFee?.toLocaleString() ?? '—'}</td>
      <td>
        <StatusBadge status={provider.status} />
      </td>
      <td>
        <button className="table-action-btn">
          View →
        </button>
      </td>
    </tr>
  )
}
