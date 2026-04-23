const labels = {
  pending:  'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}

export default function StatusBadge({ status = 'pending' }) {
  return (
    <span className={`badge badge-${status}`}>
      {labels[status] ?? 'Pending'}
    </span>
  )
}
