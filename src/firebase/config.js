import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const {
  VITE_FIREBASE_API_KEY:            apiKey,
  VITE_FIREBASE_AUTH_DOMAIN:        authDomain,
  VITE_FIREBASE_PROJECT_ID:         projectId,
  VITE_FIREBASE_STORAGE_BUCKET:     storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  VITE_FIREBASE_APP_ID:             appId,
} = import.meta.env

// Detect placeholder / missing config
const isConfigured =
  apiKey && apiKey !== 'your_api_key_here' &&
  projectId && projectId !== 'your_project_id'

export const firebaseReady = isConfigured

let app, db, auth

if (isConfigured) {
  app  = initializeApp({ apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId })
  db   = getFirestore(app)
  auth = getAuth(app)
} else {
  db   = null
  auth = null
}

export { db, auth }
