import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import SplashScreen from './components/SplashScreen'
import PageLoader from './components/PageLoader'
import { usePageLoader } from './hooks/usePageLoader'

const gridStyle = {
  backgroundImage: `
    linear-gradient(rgba(17,17,17,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17,17,17,0.06) 1px, transparent 1px)
  `,
  backgroundSize: '32px 32px',
  backgroundPosition: 'center center',
}

function AppInner({ splashDone, setSplashDone }) {
  const loading = usePageLoader()

  return (
    <>
      {!splashDone && (
        <SplashScreen onComplete={() => setSplashDone(true)} />
      )}
      {splashDone && loading && <PageLoader />}
      <div
        style={{
          ...gridStyle,
          minHeight: '100vh',
          opacity: splashDone ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        <AppRoutes />
      </div>
    </>
  )
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <BrowserRouter>
      <AppInner splashDone={splashDone} setSplashDone={setSplashDone} />
    </BrowserRouter>
  )
}
