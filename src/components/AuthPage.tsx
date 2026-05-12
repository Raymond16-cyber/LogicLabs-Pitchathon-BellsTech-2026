import {
  Eye,
  EyeOff,
  Fingerprint,
  LockKeyhole,
  MoonStar,
  ShieldCheck,
  Sparkles,
  SunMedium,
  UserRound,
} from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'

type Theme = 'dark' | 'light'
type AuthMode = 'login' | 'register'

type AuthResponse = {
  success: boolean
  message: string
}

type AuthPageProps = {
  mode: AuthMode
  theme: Theme
  onToggleTheme: () => void
  onNavigateHome: () => void
  onNavigateDashboard: () => void
  onOpenLogin: (prefillEmail?: string) => void
  onOpenRegister: (prefillEmail?: string) => void
  defaultEmail?: string
  onLogin: (payload: { email: string; password: string }) => Promise<AuthResponse> | AuthResponse
  onRegister: (payload: { name: string; email: string; password: string }) => Promise<AuthResponse> | AuthResponse
}

type PasswordFieldProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  ariaLabel: string
  autoComplete: 'current-password' | 'new-password'
  visible: boolean
  onToggleVisibility: () => void
  disabled?: boolean
}

function PasswordField({
  value,
  onChange,
  placeholder,
  ariaLabel,
  autoComplete,
  visible,
  onToggleVisibility,
  disabled,
}: PasswordFieldProps) {
  const VisibilityIcon = visible ? EyeOff : Eye

  return (
    <div className="relative">
      <input
        className="field-shell pr-12"
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete={autoComplete}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        disabled={disabled}
        className="absolute inset-y-0 right-0 flex h-full items-center justify-center px-4 text-[var(--muted)] transition hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        <VisibilityIcon className="h-4 w-4" />
      </button>
    </div>
  )
}

function AuthPage({
  mode,
  theme,
  onToggleTheme,
  onNavigateHome,
  onNavigateDashboard,
  onOpenLogin,
  onOpenRegister,
  defaultEmail,
  onLogin,
  onRegister,
}: AuthPageProps) {
  const isLogin = mode === 'login'
  const [name, setName] = useState('')
  const [email, setEmail] = useState(defaultEmail ?? '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setEmail(defaultEmail ?? '')
    setName('')
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
    setErrorMessage(null)
    setIsSubmitting(false)
  }, [defaultEmail, mode])

  const switchMode = () => {
    if (isSubmitting) {
      return
    }

    const trimmedEmail = email.trim()

    if (isLogin) {
      onOpenRegister(trimmedEmail || defaultEmail)
      return
    }

    onOpenLogin(trimmedEmail || defaultEmail)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const trimmedEmail = email.trim()

      if (isLogin) {
        if (!trimmedEmail || !password) {
          setErrorMessage('Enter both your email and password to continue.')
          return
        }

        const result = await onLogin({ email: trimmedEmail, password })

        if (!result.success) {
          setErrorMessage(result.message)
          return
        }

        onNavigateDashboard()
        return
      }

      const trimmedName = name.trim()

      if (!trimmedName || !trimmedEmail || !password) {
        setErrorMessage('Fill in your name, email, and password to create the account.')
        return
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.')
        return
      }

      const result = await onRegister({ name: trimmedName, email: trimmedEmail, password })

      if (!result.success) {
        setErrorMessage(result.message)
        return
      }

      onOpenLogin(trimmedEmail)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to reach the authentication service.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const pageTitle = isLogin ? 'Sign in to The Logic Lab' : 'Create your organization access account'
  const pageCopy = isLogin
    ? 'Use the seeded demo account or the account you created from the register page. A successful sign in now loads the live dashboard snapshot from the backend.'
    : 'Create an account against the API and move straight into the login screen. The session is now token-backed instead of browser-only.'

  return (
    <div className="app-shell min-h-screen overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex w-full items-center gap-3 text-left sm:w-auto"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-slate-950 shadow-[0_16px_40px_rgba(34,197,94,0.22)]">
              <Fingerprint className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--muted)]">
                The Logic Lab
              </p>
              <p className="text-sm font-medium text-[var(--text)]">Smart enterprise access system</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-11 w-11 self-end items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)] sm:self-auto"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
          </button>
        </header>

        <main className="grid flex-1 items-center gap-6 py-8 sm:gap-8 sm:py-12 lg:grid-cols-[0.92fr_1.08fr] lg:py-14">
          <section className="panel rounded-[2.25rem] p-5 sm:p-8">
            <span className="section-kicker">{isLogin ? 'Secure access' : 'Create account'}</span>

            <h1 className="mt-5 max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl xl:text-6xl">
              {pageTitle}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
              {pageCopy}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="stat-chip">
                <div className="flex items-center gap-2 text-[var(--accent-2)]">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--muted)]">
                    Backend auth
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Accounts are validated by the API and signed with a JWT session.
                </p>
              </div>

              <div className="stat-chip">
                <div className="flex items-center gap-2 text-[var(--accent)]">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--muted)]">
                    Token session
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Login and register now hand off to the protected dashboard state.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-soft)] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(56,189,248,0.14)] text-[var(--accent-3)]">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted)]">
                    Demo credentials
                  </p>
                  <p className="mt-1 text-sm leading-7 text-[var(--muted)]">
                    Login with admin@logiclab.dev and LogicLab123! for the seeded backend account.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="panel rounded-[2.25rem] p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted)]">
                  {isLogin ? 'Login page' : 'Register page'}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                  {isLogin ? 'Secure sign in' : 'Create your account'}
                </h2>
              </div>
              <span className={isLogin ? 'status-chip green' : 'status-chip purple'}>
                <span className="h-2 w-2 rounded-full bg-current" />
                {isLogin ? 'Login' : 'Register'}
              </span>
            </div>

            {errorMessage ? (
              <div className="mt-5 rounded-2xl border border-[rgba(239,68,68,0.28)] bg-[rgba(239,68,68,0.1)] px-4 py-3 text-sm leading-6 text-[#fecaca]">
                {errorMessage}
              </div>
            ) : null}

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              {!isLogin ? (
                <input
                  className="field-shell"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  aria-label="Full name"
                  autoComplete="name"
                  disabled={isSubmitting}
                />
              ) : null}

              <input
                className="field-shell"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@logiclab.dev"
                aria-label="Email address"
                autoComplete="email"
                disabled={isSubmitting}
              />

              <PasswordField
                value={password}
                onChange={setPassword}
                placeholder={isLogin ? 'Enter password' : 'Create a password'}
                ariaLabel="Password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                visible={showPassword}
                onToggleVisibility={() => setShowPassword((current) => !current)}
                disabled={isSubmitting}
              />

              {!isLogin ? (
                <PasswordField
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Confirm password"
                  ariaLabel="Confirm password"
                  autoComplete="new-password"
                  visible={showConfirmPassword}
                  onToggleVisibility={() => setShowConfirmPassword((current) => !current)}
                  disabled={isSubmitting}
                />
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--accent-2),#7cf7a2)] px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Working...' : isLogin ? 'Enter dashboard' : 'Create account'}
                <UserRound className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={switchMode}
                disabled={isSubmitting}
                className="text-left font-semibold text-[var(--accent-2)] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60 sm:text-center"
              >
                {isLogin ? 'Need an account? Register here.' : 'Already have an account? Log in here.'}
              </button>

              <button
                type="button"
                onClick={onNavigateHome}
                disabled={isSubmitting}
                className="text-left text-[var(--muted)] transition hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-60 sm:text-right"
              >
                Back to home
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default AuthPage