import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useProviders() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    const q = query(
      collection(db, 'providers'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Normalize approval status
          status: doc.data().isApproved === true
            ? 'approved'
            : doc.data().isApproved === false
            ? 'rejected'
            : 'pending',
        }))
        setProviders(data)
        setLoading(false)
      },
      (err) => {
        console.error('Firestore error:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [])

  return { providers, loading, error }
}
