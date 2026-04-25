export default function AppLogo({ size = 72 }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, borderRadius: size * 0.22, display: 'block' }}
    >
      <defs>
        <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#283593"/>
          <stop offset="100%" stopColor="#1A237E"/>
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="100" height="100" rx="22" fill="url(#logoBg)"/>

      {/* Subtle radial glow */}
      <circle cx="50" cy="50" r="38" fill="rgba(255,255,255,0.05)"/>

      {/* Shield outline */}
      <path
        d="M50,18 C62,18 72,25 72,35 C72,52 62,63 50,69 C38,63 28,52 28,35 C28,25 38,18 50,18 Z"
        fill="rgba(255,255,255,0.15)"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="2.2"
      />

      {/* Inner shield ring */}
      <path
        d="M50,24 C59,24 66,29 66,37 C66,51 58,60 50,65 C42,60 34,51 34,37 C34,29 41,24 50,24 Z"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
      />

      {/* White wrench */}
      <path
        d="M63,55 L54,46 C55,43 54,40 52,38 C50,36 47,35 45,36 L49,40 L46,43 L42,39 C41,41 41,44 43,46 C45,48 48,48 50,47 L59,56 C60,57 61,57 62,56 L63,55 C64,54 64,55 63,55 Z"
        fill="white"
      />
    </svg>
  )
}
