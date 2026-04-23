export default function LoadingSpinner({ fullPage = false, small = false }) {
  return (
    <div className={`spinner-wrap ${fullPage ? 'full-page' : ''}`}>
      <div className={`spinner ${small ? 'spinner-sm' : ''}`} />
    </div>
  )
}
