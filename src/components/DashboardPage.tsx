import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  BellRing,
  Activity,
  Clock3,
  Fingerprint,
  LayoutDashboard,
  MoonStar,
  Menu,
  Search,
  RefreshCw,
  SlidersHorizontal,
  MapPin,
  ShieldCheck,
  X,
  SunMedium,
  Users,
} from 'lucide-react'
import SubscriptionPanel from './SubscriptionPanel'
import { useState } from 'react'
import type { AuthSessionUser, DashboardPanel, DashboardSnapshot } from '../services/api'

type Theme = 'dark' | 'light'

type DashboardPageProps = {
  theme: Theme
  onToggleTheme: () => void
  onNavigateHome: () => void
  onSignOut: () => void
  onRefresh: () => void
  onSimulateScan: () => void
  sessionUser: AuthSessionUser | null
  summary: DashboardSnapshot | null
  isLoading: boolean
  errorMessage: string | null
}

const fallbackPanels: DashboardPanel[] = [
  {
    title: 'Organization status',
    value: 'Loading status',
    description: 'The dashboard is waiting for the backend summary.',
  },
  {
    title: 'Active users',
    value: '0 active',
    description: 'Operators will appear here after the API responds.',
  },
  {
    title: 'Security posture',
    value: 'Syncing',
    description: 'No alerts, denied access spikes, or sensor faults yet.',
  },
  {
    title: 'Notification state',
    value: 'Waiting',
    description: 'The bell feed will update once a live scan lands.',
  },
]

function DashboardPage({
  theme,
  onToggleTheme,
  onNavigateHome,
  onSignOut,
  onRefresh,
  onSimulateScan,
  sessionUser,
  summary,
  isLoading,
  errorMessage,
}: DashboardPageProps) {
  const signedInUser = summary?.user ?? sessionUser ?? {
    name: 'Demo Operator',
    email: 'demo@logiclab.dev',
    role: 'staff',
    status: 'active',
    lastLogin: null,
    university: null,
  }

  const metrics = summary?.counters ?? {
    liveScanTotal: 0,
    verifiedEntries: 0,
    accessZones: 6,
    activeUsers: 0,
    responseTime: '0.0s',
  }

  const insights = summary?.insights ?? {
    checkIns: 0,
    checkOuts: 0,
    busiestGate: 'North Gate',
    busiestGateCount: 0,
    flowBias: 'Balanced' as const,
    healthLabel: 'Idle' as const,
    healthNote: 'Waiting for the first reader event.',
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'IN' | 'OUT'>('all')
  const [gateFilter, setGateFilter] = useState('all')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const recentScans = summary?.recentScans ?? []
  const operationsPanels = summary?.operationsPanels ?? fallbackPanels
  const isConnected = summary?.connectionState === 'connected'
  const lastUpdatedAt = summary?.lastUpdatedAt
    ? new Date(summary.lastUpdatedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'waiting for sync'
  const ThemeIcon = theme === 'dark' ? SunMedium : MoonStar
  const numberFormatter = new Intl.NumberFormat('en-US')
    const gateOptions = Array.from(new Set(recentScans.map((entry) => entry.gate)))
    const normalizedQuery = searchQuery.trim().toLowerCase()

    const filteredScans = recentScans.filter((entry) => {
      const queryMatch =
        normalizedQuery.length === 0 ||
        `${entry.name} ${entry.id} ${entry.gate} ${entry.status}`.toLowerCase().includes(normalizedQuery)
      const statusMatch = statusFilter === 'all' || entry.status === statusFilter
      const gateMatch = gateFilter === 'all' || entry.gate === gateFilter

      return queryMatch && statusMatch && gateMatch
    })

    const hasActiveFilters = normalizedQuery.length > 0 || statusFilter !== 'all' || gateFilter !== 'all'

    const resetFilters = () => {
      setSearchQuery('')
      setStatusFilter('all')
      setGateFilter('all')
    }

  return (
    <div className="app-shell min-h-screen overflow-hidden">
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className="panel relative rounded-4xl px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-3 text-left"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-slate-950 shadow-[0_16px_40px_rgba(34,197,94,0.22)]">
                <LayoutDashboard className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--muted)]">
                  The Logic Lab
                </p>

                <p className="text-sm font-medium text-[var(--text)]">Connected dashboard</p>
              </div>
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden flex-wrap items-center gap-3 sm:flex">
              <span className={isConnected ? 'status-chip green' : 'status-chip purple'}>
                <span className="h-2 w-2 rounded-full bg-current" />
                {isConnected ? 'Dashboard online' : isLoading ? 'Syncing feed' : 'Preview mode'}
              </span>

              <button
                type="button"
                onClick={onRefresh}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)]"
              >
                Refresh
              </button>

              <button
                type="button"
                onClick={onSimulateScan}
                className="rounded-full bg-[linear-gradient(135deg,var(--accent-2),#7cf7a2)] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                Simulate scan
              </button>

              <button
                type="button"
                onClick={onToggleTheme}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)]"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <ThemeIcon className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)]"
              >
                Sign Out
              </button>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-(--border) bg-(--surface-soft) text-(--text) transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)] sm:hidden"
                aria-label={isMobileMenuOpen ? 'Close dashboard menu' : 'Open dashboard menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="dashboard-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen ? (
            <div
              id="dashboard-mobile-menu"
              className="mt-4 grid gap-3 rounded-3xl border border-(--border) bg-(--surface-strong) p-4 sm:hidden"
            >
              <button
                type="button"
                onClick={() => {
                  onNavigateHome()
                  setIsMobileMenuOpen(false)
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-(--border) bg-(--surface-soft) px-4 py-3 text-sm font-semibold text-(--text) transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back home
              </button>

              <button
                type="button"
                onClick={() => {
                  onRefresh()
                  setIsMobileMenuOpen(false)
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-(--border) bg-(--surface-soft) px-4 py-3 text-sm font-semibold text-(--text) transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)]"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh feed
              </button>

              <button
                type="button"
                onClick={() => {
                  onSimulateScan()
                  setIsMobileMenuOpen(false)
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-(--border) bg-(--surface-soft) px-4 py-3 text-sm font-semibold text-(--text) transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)]"
              >
                <Fingerprint className="h-4 w-4" />
                Simulate scan
              </button>

              <button
                type="button"
                onClick={() => {
                  onToggleTheme()
                  setIsMobileMenuOpen(false)
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-(--border) bg-(--surface-soft) px-4 py-3 text-sm font-semibold text-(--text) transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)]"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <ThemeIcon className="h-4 w-4" />
                Toggle theme
              </button>

              <button
                type="button"
                onClick={() => {
                  onSignOut()
                  setIsMobileMenuOpen(false)
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-(--border) bg-(--surface-soft) px-4 py-3 text-sm font-semibold text-(--text) transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)]"
              >
                Sign Out
              </button>
            </div>
          ) : null}
        </header>

        <main className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] xl:items-start">
          <div className="space-y-6">
            <section className="panel rounded-[2.25rem] p-5 sm:p-8">
              <span className="section-kicker">Dashboard / live view</span>

              <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div className="space-y-4">
                  <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl xl:text-6xl">
                    Welcome back, {signedInUser.name}
                  </h1>

                  <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
                    This dashboard now binds to the backend session and scan feed.
                    The cards below update from the API, while the layout still
                    adapts from a stacked mobile view to a two-column workspace
                    on larger screens.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted)]">
                    Signed-in user
                  </p>

                  <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                    {signedInUser.name}
                  </p>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {signedInUser.email}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="status-chip green">{signedInUser.role || 'staff'}</span>
                    <span className={isConnected ? 'status-chip green' : 'status-chip purple'}>
                      {summary?.recommendedPlanId ? 'Backend connected' : 'Preview mode'}
                    </span>
                  </div>

                  {signedInUser.university ? (
                    <p className="mt-4 text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                      {signedInUser.university.name}
                    </p>
                  ) : null}

                  <p className="mt-3 text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                    Last sync {lastUpdatedAt}
                  </p>
                </div>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <div className="panel rounded-[1.75rem] p-5">
                <div className="flex items-center gap-2 text-[var(--accent-2)]">
                  <BarChart3 className="h-4 w-4" />

                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                    Live scans
                  </p>
                </div>

                <p className="mt-3 text-3xl font-semibold text-[var(--text)]">
                  {numberFormatter.format(metrics.liveScanTotal)}
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Activity captured across the current session.
                </p>
              </div>

              <div className="panel rounded-[1.75rem] p-5">
                <div className="flex items-center gap-2 text-[var(--accent)]">
                  <BadgeCheck className="h-4 w-4" />

                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                    Verified entries
                  </p>
                </div>

                <p className="mt-3 text-3xl font-semibold text-[var(--text)]">
                  {numberFormatter.format(metrics.verifiedEntries)}
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Approved scans and access decisions.
                </p>
              </div>

              <div className="panel rounded-[1.75rem] p-5">
                <div className="flex items-center gap-2 text-[var(--accent-3)]">
                  <ShieldCheck className="h-4 w-4" />

                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                    Access zones
                  </p>
                </div>

                <p className="mt-3 text-3xl font-semibold text-[var(--text)]">
                  {metrics.accessZones}
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Active gates and monitored checkpoints.
                </p>
              </div>

              <div className="panel rounded-[1.75rem] p-5">
                <div className="flex items-center gap-2 text-[var(--accent-2)]">
                  <Users className="h-4 w-4" />

                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                    Active users
                  </p>
                </div>

                <p className="mt-3 text-3xl font-semibold text-[var(--text)]">
                  {numberFormatter.format(metrics.activeUsers)}
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Authenticated users currently connected to the control plane.
                </p>
              </div>

              <div className="panel rounded-[1.75rem] p-5">
                <div className="flex items-center gap-2 text-[var(--accent-2)]">
                  <Clock3 className="h-4 w-4" />

                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                    Response time
                  </p>
                </div>

                <p className="mt-3 text-3xl font-semibold text-[var(--text)]">
                  {metrics.responseTime}
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Reader to dashboard response in the live flow.
                </p>
              </div>

              <div className="panel rounded-[1.75rem] p-5">
                <div className="flex items-center gap-2 text-[var(--accent)]">
                  <Fingerprint className="h-4 w-4" />

                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                    Sync state
                  </p>
                </div>

                <p className="mt-3 text-3xl font-semibold text-[var(--text)]">
                  {isConnected ? 'Live' : 'Syncing'}
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  The backend feed is {isConnected ? 'connected' : 'warming up'}.
                </p>
              </div>
            </section>

            <section className="panel rounded-[2rem] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted)]">
                    Operational insights
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                    Traffic balance and gate pressure
                  </h2>
                </div>

                <span className="status-chip green">
                  <Activity className="h-3.5 w-3.5" />
                  Live snapshot
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                    Check-ins
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{insights.checkIns}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Recent inbound confirmations.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                    Check-outs
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{insights.checkOuts}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Recent outbound confirmations.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                    Busiest gate
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--text)]">
                    {insights.busiestGate}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {insights.busiestGateCount} recent scan{insights.busiestGateCount === 1 ? '' : 's'}.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                    Health
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--text)]">
                    {insights.healthLabel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {insights.healthNote}
                  </p>
                </div>
              </div>
            </section>

            {errorMessage ? (
              <section className="rounded-[1.75rem] border border-[rgba(239,68,68,0.28)] bg-[rgba(239,68,68,0.1)] p-5 text-sm leading-7 text-[#fecaca]">
                {errorMessage}
              </section>
            ) : null}

            <section className="panel rounded-[2rem] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted)]">
                    Feed controls
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                    Search and filter scans
                  </h2>
                </div>

                <span className={hasActiveFilters ? 'status-chip purple' : 'status-chip green'}>
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  {filteredScans.length} shown / {recentScans.length} total
                </span>
              </div>

              <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    className="field-shell pl-11"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by name, ID, gate, or status"
                    aria-label="Search activity log"
                  />
                </label>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3.5 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)]"
                >
                  <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                  Reset filters
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(['all', 'IN', 'OUT'] as const).map((filterValue) => (
                  <button
                    key={filterValue}
                    type="button"
                    onClick={() => setStatusFilter(filterValue)}
                    className={
                      statusFilter === filterValue
                        ? 'status-chip green'
                        : 'status-chip purple'
                    }
                  >
                    {filterValue === 'all' ? 'All statuses' : filterValue}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setGateFilter('all')}
                  className={gateFilter === 'all' ? 'status-chip green' : 'status-chip purple'}
                >
                  All gates
                </button>

                {gateOptions.map((gateName) => (
                  <button
                    key={gateName}
                    type="button"
                    onClick={() => setGateFilter(gateName)}
                    className={gateFilter === gateName ? 'status-chip green' : 'status-chip purple'}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {gateName}
                  </button>
                ))}
              </div>
            </section>

            <section className="panel rounded-[2rem] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted)]">
                    Recent activity
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                    Activity stream
                  </h2>
                </div>

                <span className="status-chip green">
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {isConnected ? 'Live feed' : 'Live preview'}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {filteredScans.length > 0 ? (
                  filteredScans.map((entry) => (
                    <div
                      key={`${entry.id}-${entry.time}-${entry.status}`}
                      className="flex flex-col gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-[var(--text)]">{entry.name}</p>

                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {entry.id} | {entry.gate}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 sm:justify-end">
                        <span
                          className={
                            entry.status === 'IN'
                              ? 'status-chip green'
                              : 'status-chip purple'
                          }
                        >
                          {entry.status}
                        </span>

                        <p className="text-sm text-[var(--muted)]">{entry.time}</p>
                      </div>
                    </div>
                  ))
                ) : isLoading ? (
                  <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted)]">
                    Waiting for scan activity...
                  </div>
                ) : (
                  <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted)]">
                    {recentScans.length === 0
                      ? 'No scans have been captured yet.'
                      : 'No scans match the current filters.'}
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <SubscriptionPanel
              recommendedPlanId={summary?.recommendedPlanId}
              activeUsers={metrics.activeUsers}
            />

            <section className="panel rounded-[2rem] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <BellRing className="h-5 w-5 text-[var(--accent-2)]" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted)]">
                    Operations
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold text-[var(--text)]">
                    Live system snapshot
                  </h2>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {operationsPanels.map((panel) => (
                  <div
                    key={panel.title}
                    className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                      {panel.title}
                    </p>

                    <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                      {panel.value}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {panel.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel rounded-[2rem] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-[var(--accent)]" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted)]">
                    Quick actions
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold text-[var(--text)]">
                    Move around the app
                  </h2>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row xl:flex-col">
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3.5 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back home
                </button>

                <button
                  type="button"
                  onClick={onRefresh}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--accent-2),#7cf7a2)] px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh feed
                </button>

                <button
                  type="button"
                  onClick={onSimulateScan}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3.5 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.35)]"
                >
                  <Fingerprint className="h-4 w-4" />
                  Simulate scan
                </button>
              </div>
            </section>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage