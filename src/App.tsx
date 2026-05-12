import { useEffect, useState } from 'react'
import AOS from 'aos'
import { BellRing } from 'lucide-react'
import AuthPage from './components/AuthPage'
import AboutSystemSection from './components/AboutSystemSection'
import DashboardPage from './components/DashboardPage'
import DemoSection from './components/DemoSection'
import FeaturesSection from './components/FeaturesSection'
import HardwareIntegrationSection from './components/HardwareIntegrationSection'
import HeroSection from './components/HeroSection'
import HowItWorksSection from './components/HowItWorksSection'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import TeamSection from './components/TeamSection'
import {
  clearSession,
  recordScan,
  resetDashboard,
  setDraftEmail,
  setError,
  setLoading,
  setSession,
  setSessionUser,
  setSummary,
  toggleTheme as toggleThemeAction,
  useAppDispatch,
  useAppSelector,
} from '../store/store'
import {
  getCurrentUserRequest,
  getDashboardSummaryRequest,
  loginRequest,
  registerRequest,
  simulateScanRequest,
} from './services/api'
import {
  comparisonCards,
  footerLinks,
  flowSteps,
  features,
  hardwareModules,
  heroFlowNodes,
  navigation,
  scanRoster,
  teamRoles,
} from './content/siteContent'
import './App.css'

type AppRoute = '/' | '/login' | '/register' | '/dashboard'
type ScanStatus = 'IN' | 'OUT'

type ScanRecord = {
  name: string
  id: string
  status: ScanStatus
  time: string
  gate: string
}

type AuthResponse = {
  success: boolean
  message: string
}

const numberFormatter = new Intl.NumberFormat('en-US')

function getInitialRoute(): AppRoute {
  if (typeof window === 'undefined') {
    return '/'
  }

  if (window.location.pathname === '/login') {
    return '/login'
  }

  if (window.location.pathname === '/register') {
    return '/register'
  }

  if (window.location.pathname === '/dashboard') {
    return '/dashboard'
  }

  return '/'
}

function App() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.ui.theme)
  const sessionToken = useAppSelector((state) => state.auth.token)
  const sessionUser = useAppSelector((state) => state.auth.user)
  const authDraftEmail = useAppSelector((state) => state.auth.draftEmail)
  const dashboardSummary = useAppSelector((state) => state.dashboard.summary)
  const dashboardLoading = useAppSelector((state) => state.dashboard.loading)
  const dashboardError = useAppSelector((state) => state.dashboard.error)
  const scanCount = useAppSelector((state) => state.demo.scanCount)
  const scanLog = useAppSelector((state) => state.demo.scanLog)

  const [route, setRoute] = useState<AppRoute>(() => getInitialRoute())
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
  }, [theme])

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      mirror: false,
    })
  }, [])

  useEffect(() => {
    if (!sessionToken) {
      return
    }

    let cancelled = false

    const syncSession = async () => {
      try {
        const result = await getCurrentUserRequest(sessionToken)

        if (cancelled) {
          return
        }

        dispatch(setSessionUser(result.user))
      } catch {
        if (cancelled) {
          return
        }

        dispatch(clearSession())
        dispatch(resetDashboard())
        setToast({
          title: 'Session expired',
          description: 'Please sign in again to continue.',
        })

        if (window.location.pathname === '/dashboard') {
          window.history.pushState({}, '', '/login')
          setRoute('/login')
        }
      }
    }

    void syncSession()

    return () => {
      cancelled = true
    }
  }, [dispatch, sessionToken])

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timeoutId)
  }, [toast])

  useEffect(() => {
    if (route === '/dashboard' && !sessionToken) {
      setToast({
        title: 'Sign in required',
        description: 'Please sign in to access the protected dashboard.',
      })

      if (window.location.pathname !== '/login') {
        window.history.pushState({}, '', '/login')
      }

      setRoute('/login')
      return
    }

    if ((route === '/login' || route === '/register') && sessionToken && sessionUser) {
      if (window.location.pathname !== '/dashboard') {
        window.history.pushState({}, '', '/dashboard')
      }

      setRoute('/dashboard')
    }
  }, [route, sessionToken, sessionUser])

  useEffect(() => {
    if (route !== '/dashboard' || !sessionToken) {
      return
    }

    let cancelled = false

    const loadDashboardSummary = async () => {
      dispatch(setLoading(true))
      dispatch(setError(null))

      try {
        const summary = await getDashboardSummaryRequest(sessionToken)

        if (cancelled) {
          return
        }

        dispatch(setSummary(summary))
      } catch (error) {
        if (cancelled) {
          return
        }

        const message = error instanceof Error ? error.message : 'Unable to load the dashboard summary.'
        dispatch(setError(message))
        setToast({
          title: 'Dashboard sync failed',
          description: message,
        })
      } finally {
        if (!cancelled) {
          dispatch(setLoading(false))
        }
      }
    }

    void loadDashboardSummary()

    return () => {
      cancelled = true
    }
  }, [dispatch, route, sessionToken])

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getInitialRoute())
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)

    const frameId = window.requestAnimationFrame(() => {
      AOS.refreshHard()
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [route])

  const currentScan = scanLog[0]
  const liveScanTotal = numberFormatter.format(1284 + scanCount)
  const verifiedEntries = numberFormatter.format(463 + scanCount)
  const accessZones = numberFormatter.format(6)

  const navigateTo = (nextRoute: AppRoute) => {
    if (typeof window === 'undefined') {
      return
    }

    if (window.location.pathname !== nextRoute) {
      window.history.pushState({}, '', nextRoute)
    }

    setRoute(nextRoute)
  }

  const openLogin = (prefillEmail = authDraftEmail) => {
    dispatch(setDraftEmail(prefillEmail))
    navigateTo('/login')
  }

  const openRegister = (prefillEmail = authDraftEmail) => {
    dispatch(setDraftEmail(prefillEmail))
    navigateTo('/register')
  }

  const openDashboard = () => {
    navigateTo('/dashboard')
  }

  const recordLocalScan = () => {
    const nextPerson = scanRoster[scanCount % scanRoster.length]
    const status: ScanStatus = scanCount % 2 === 0 ? 'IN' : 'OUT'
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

    const record: ScanRecord = {
      name: nextPerson.name,
      id: nextPerson.id,
      status,
      time,
      gate: status === 'IN' ? 'North Gate' : 'South Exit',
    }

    dispatch(recordScan(record))
    setToast({
      title: `${record.name} checked ${record.status === 'IN' ? 'in' : 'out'}`,
      description: `${record.id} logged at ${record.time} through ${record.gate}.`,
    })
  }

  const refreshDashboard = async () => {
    if (!sessionToken || route !== '/dashboard') {
      return
    }

    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      const summary = await getDashboardSummaryRequest(sessionToken)
      dispatch(setSummary(summary))
      setToast({
        title: 'Dashboard refreshed',
        description: 'Live data synced from the API.',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to refresh the dashboard.'
      dispatch(setError(message))
      setToast({
        title: 'Refresh failed',
        description: message,
      })
    } finally {
      dispatch(setLoading(false))
    }
  }

  const simulateScan = async () => {
    if (route === '/dashboard' && sessionToken) {
      dispatch(setLoading(true))
      dispatch(setError(null))

      try {
        const summary = await simulateScanRequest(sessionToken)
        dispatch(setSummary(summary))

        const latestRecord = summary.currentScan

        if (latestRecord) {
          setToast({
            title: `${latestRecord.name} checked ${latestRecord.status === 'IN' ? 'in' : 'out'}`,
            description: `${latestRecord.id} logged at ${latestRecord.time} through ${latestRecord.gate}.`,
          })
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to record the simulated scan.'
        dispatch(setError(message))
        setToast({
          title: 'Scan failed',
          description: message,
        })
      } finally {
        dispatch(setLoading(false))
      }

      return
    }

    recordLocalScan()
  }

  const handleMockLogin = () => {
    openLogin('admin@logiclab.dev')
    setToast({
      title: 'Demo login ready',
      description: 'The login page is prefilled with the seeded backend account.',
    })
  }

  const handleLogin = async ({ email, password }: { email: string; password: string }): Promise<AuthResponse> => {
    try {
      const response = await loginRequest({ email, password })

      dispatch(setSession({ token: response.token, user: response.user }))
      dispatch(setDraftEmail(response.user.email))
      dispatch(resetDashboard())

      setToast({
        title: 'Signed in successfully',
        description: `${response.user.name} is now connected to the dashboard.`,
      })

      return {
        success: true,
        message: response.message,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in right now.'
      return {
        success: false,
        message,
      }
    }
  }

  const handleRegister = async ({ name, email, password }: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    try {
      const response = await registerRequest({ name, email, password })

      dispatch(setDraftEmail(response.user.email))

      setToast({
        title: 'Account created',
        description: `${response.user.name} is ready. Continue to the login page to sign in.`,
      })

      return {
        success: true,
        message: response.message,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create the account right now.'
      return {
        success: false,
        message,
      }
    }
  }

  const handleSignOut = () => {
    dispatch(clearSession())
    dispatch(resetDashboard())
    navigateTo('/')

    setToast({
      title: 'Signed out',
      description: 'Your session was cleared from this browser.',
    })
  }

  const toggleTheme = () => {
    dispatch(toggleThemeAction())
  }

  if (route !== '/') {
    if (route === '/dashboard') {
      return (
        <DashboardPage
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigateHome={() => navigateTo('/')}
          onSignOut={handleSignOut}
          onRefresh={() => {
            void refreshDashboard()
          }}
          onSimulateScan={() => {
            void simulateScan()
          }}
          sessionUser={sessionUser}
          summary={dashboardSummary}
          isLoading={dashboardLoading}
          errorMessage={dashboardError}
        />
      )
    }

    return (
      <AuthPage
        mode={route === '/login' ? 'login' : 'register'}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigateHome={() => navigateTo('/')}
        onNavigateDashboard={openDashboard}
        onOpenLogin={openLogin}
        onOpenRegister={openRegister}
        defaultEmail={authDraftEmail}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    )
  }

  return (
    <div className="app-shell min-h-screen overflow-hidden">
      <SiteHeader
        theme={theme}
        onToggleTheme={toggleTheme}
        navigation={navigation}
        onOpenLogin={openLogin}
        onOpenRegister={openRegister}
        sessionUser={sessionUser}
        onSignOut={handleSignOut}
      />

      <main>
        <HeroSection
          liveScanTotal={liveScanTotal}
          verifiedEntries={verifiedEntries}
          accessZones={accessZones}
          heroFlowNodes={heroFlowNodes}
          onOpenLogin={openLogin}
          onOpenRegister={openRegister}
        />
        <AboutSystemSection comparisonCards={comparisonCards} />
        <HowItWorksSection flowSteps={flowSteps} />
        <FeaturesSection features={features} />
        <DemoSection
          currentScan={currentScan}
          scanLog={scanLog}
          liveScanTotal={liveScanTotal}
          verifiedEntries={verifiedEntries}
          onSimulateScan={() => {
            void simulateScan()
          }}
          onMockLogin={handleMockLogin}
        />
        <HardwareIntegrationSection hardwareModules={hardwareModules} />
        <TeamSection teamRoles={teamRoles} />
      </main>

      <SiteFooter footerLinks={footerLinks} />

      {toast ? (
        <div className="toast-pop fixed bottom-5 right-5 z-50 w-[min(92vw,24rem)] rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-4 shadow-[var(--shadow)] backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(34,197,94,0.14)] text-[var(--accent-2)]">
              <BellRing className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--text)]">{toast.title}</p>
              <p className="text-sm leading-6 text-[var(--muted)]">{toast.description}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App