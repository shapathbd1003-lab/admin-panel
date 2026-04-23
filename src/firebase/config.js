import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'AIzaSyDcElwAuooYlJC3jHF4PaMKW265V0lQL1Y',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'servicepro-fc58a.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'servicepro-fc58a',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'servicepro-fc58a.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '749521391969',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '1:749521391969:web:8ae8ddcf7bd87f3367b520',
}

const app  = initializeApp(firebaseConfig)

export const db            = getFirestore(app)
export const auth          = getAuth(app)
export const firebaseReady = true
