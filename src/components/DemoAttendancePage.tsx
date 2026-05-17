import { Fingerprint, LayoutDashboard, ScanLine } from 'lucide-react'
import DemoSection from './DemoSection'

type ScanStatus = 'IN' | 'OUT'

type ScanRecord = {
  name: string
  id: string
  status: ScanStatus
  time: string
  gate: string
}

type DemoAttendancePageProps = {
  currentScan: ScanRecord
  scanLog: ScanRecord[]
  liveScanTotal: string
  verifiedEntries: string
  onSimulateScan: () => void
  onMockLogin: () => void
}

function DemoAttendancePage({
  currentScan,
  scanLog,
  liveScanTotal,
  verifiedEntries,
  onSimulateScan,
  onMockLogin,
}: DemoAttendancePageProps) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="panel rounded-[2.25rem] p-6 sm:p-8 lg:p-10" data-aos="fade-up">
          <span className="section-kicker">Demo attendance / route view</span>

          <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="space-y-4">
              <h1 className="section-title">Demo Attendance</h1>
              <p className="section-copy">
                This route keeps the same site header and footer in place. Only the body changes so you can
                focus on the live attendance simulation, scan history, and mock login flow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-(--border) bg-(--surface-soft) p-4">
                <div className="flex items-center gap-2 text-(--accent-2)">
                  <ScanLine className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--muted)">
                    Today
                  </p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-(--text)">{liveScanTotal}</p>
                <p className="mt-2 text-sm text-(--muted)">Access records</p>
              </div>

              <div className="rounded-3xl border border-(--border) bg-(--surface-soft) p-4">
                <div className="flex items-center gap-2 text-(--accent-3)">
                  <Fingerprint className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--muted)">
                    Verified
                  </p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-(--text)">{verifiedEntries}</p>
                <p className="mt-2 text-sm text-(--muted)">Credential checks</p>
              </div>

              <div className="rounded-3xl border border-(--border) bg-(--surface-soft) p-4">
                <div className="flex items-center gap-2 text-(--accent)">
                  <LayoutDashboard className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--muted)">
                    Latest
                  </p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-(--text)">{currentScan.status}</p>
                <p className="mt-2 text-sm text-(--muted)">{currentScan.gate}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <DemoSection
            currentScan={currentScan}
            scanLog={scanLog}
            liveScanTotal={liveScanTotal}
            verifiedEntries={verifiedEntries}
            onSimulateScan={onSimulateScan}
            onMockLogin={onMockLogin}
          />
        </div>
      </section>
    </>
  )
}

export default DemoAttendancePage