import { Fingerprint, MoonStar, SunMedium } from 'lucide-react'

type Theme = 'dark' | 'light'

type SessionUser = {
  name: string
  email: string
}

type SiteHeaderProps = {
  currentRoute: '/' | '/login' | '/register' | '/dashboard' | '/Demo-Attendance'
  theme: Theme
  onToggleTheme: () => void
  navigation: Array<{
    label: string
    href: string
  }>
  onNavigateHome: () => void
  onOpenLogin: (prefillEmail?: string) => void
  onOpenRegister: (prefillEmail?: string) => void
  onOpenDemoAttendance: () => void
  sessionUser: SessionUser | null
  onSignOut: () => void
}

function SiteHeader({
  currentRoute,
  theme,
  onToggleTheme,
  navigation,
  onNavigateHome,
  onOpenLogin,
  onOpenRegister,
  onOpenDemoAttendance,
  sessionUser,
  onSignOut,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[rgba(6,16,31,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <a
          href={currentRoute === '/' ? '#hero' : '/'}
          onClick={(event) => {
            if (currentRoute !== '/') {
              event.preventDefault()
              onNavigateHome()
            }
          }}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-slate-950 shadow-[0_16px_40px_rgba(34,197,94,0.22)]">
            <Fingerprint className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--muted)]">
              The Logic Lab
            </p>
            <p className="text-sm font-medium text-[var(--text)]">Smart Pass</p>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] lg:flex">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={
                item.label === 'Demo Attendance'
                  ? (event) => {
                      event.preventDefault()
                      onOpenDemoAttendance()
                    }
                  : undefined
              }
              className="transition hover:text-[var(--text)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {sessionUser ? (
            <span className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] md:inline-flex">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-2)] shadow-[0_0_0_6px_rgba(34,197,94,0.12)]" />
              Signed in as {sessionUser.name}
            </span>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => onOpenLogin()}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)]"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => onOpenRegister()}
                className="rounded-full bg-[linear-gradient(135deg,var(--accent-2),#7cf7a2)] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                Register
              </button>
            </div>
          )}

          {sessionUser ? (
            <button
              type="button"
              onClick={onSignOut}
              className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)]"
            >
              Sign out
            </button>
          ) : null}
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)]"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader