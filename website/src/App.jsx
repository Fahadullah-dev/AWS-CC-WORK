import { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { getCurrentUser } from 'aws-amplify/auth'
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

function AppInner({ splashDone, setSplashDone, user, checkUser }) {
  const loading = usePageLoader()

  return (
    <>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
      {splashDone && loading && <PageLoader />}
      <div style={{
        ...gridStyle,
        minHeight: '100vh',
        opacity: splashDone ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        <AppRoutes user={user} checkUser={checkUser} />  {/* ← pass them here */}
      </div>
    </>
  )
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch {
      setUser(null)
    } finally {
      setAuthLoading(false)
    }
  }

  // Wait for AWS to finish checking login before rendering anything
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        color: 'black',
        fontWeight: '900',
        fontSize: '20px',
        backgroundImage: 'radial-gradient(#d1d1d1 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}>
        INITIALIZING_NETWORK...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <AppInner
        splashDone={splashDone}
        setSplashDone={setSplashDone}
        user={user}              
        checkUser={checkUser}    
      />
    </BrowserRouter>
  )
}