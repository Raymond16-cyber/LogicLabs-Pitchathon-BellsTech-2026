import { useState } from 'react'
import { BadgeCheck, ChevronDown, Clock3, GraduationCap, ScanLine } from 'lucide-react'

type Department =
  | 'College of Engineering'
  | 'College of Management Sciences'
  | 'College of Natural and Applied Sciences'

type Level = '100 Level' | '200 Level' | '300 Level' | '400 Level'

type AttendanceRecord = {
  id: string
  department: Department
  level: Level
  course: string
  status: 'Present'
  time: string
}

const departmentOptions: Department[] = [
  'College of Engineering',
  'College of Management Sciences',
  'College of Natural and Applied Sciences',
]

const levelOptions: Level[] = ['100 Level', '200 Level', '300 Level', '400 Level']

const departmentCodes: Record<Department, string> = {
  'College of Engineering': 'ENG',
  'College of Management Sciences': 'MGT',
  'College of Natural and Applied Sciences': 'NAS',
}

const levelCodes: Record<Level, string> = {
  '100 Level': '100',
  '200 Level': '200',
  '300 Level': '300',
  '400 Level': '400',
}

const courseCatalog: Record<Department, Record<Level, string[]>> = {
  'College of Engineering': {
    '100 Level': [
      'ENG 101 - Introduction to Engineering',
      'MTH 101 - Mathematics I',
      'PHY 101 - Physics I',
    ],
    '200 Level': [
      'ENG 201 - Engineering Mechanics',
      'MTH 201 - Differential Calculus',
      'EEE 201 - Circuit Theory',
    ],
    '300 Level': [
      'ENG 301 - Engineering Drawing',
      'CPE 301 - Programming Fundamentals',
      'MEE 301 - Thermodynamics',
    ],
    '400 Level': [
      'ENG 401 - Project Design',
      'CPE 402 - Control Systems',
      'MEE 401 - Industrial Engineering',
    ],
  },
  'College of Management Sciences': {
    '100 Level': [
      'MGT 101 - Introduction to Management',
      'ACC 101 - Principles of Accounting',
      'ECO 101 - Introductory Economics',
    ],
    '200 Level': [
      'MGT 201 - Business Communication',
      'ACC 201 - Financial Accounting',
      'ECO 201 - Macroeconomics',
    ],
    '300 Level': [
      'MKT 301 - Marketing Principles',
      'FIN 301 - Corporate Finance',
      'HRM 301 - Organizational Behavior',
    ],
    '400 Level': [
      'MGT 401 - Strategic Management',
      'FIN 402 - Investment Analysis',
      'BUS 401 - Entrepreneurship',
    ],
  },
  'College of Natural and Applied Sciences': {
    '100 Level': [
      'CHM 101 - General Chemistry I',
      'BIO 101 - General Biology I',
      'MTH 101 - Algebra and Trigonometry',
    ],
    '200 Level': [
      'CHM 201 - Organic Chemistry I',
      'PHY 201 - General Physics II',
      'BIO 201 - Cell Biology',
    ],
    '300 Level': [
      'CHM 301 - Analytical Chemistry',
      'MTH 301 - Numerical Methods',
      'CSC 301 - Data Structures',
    ],
    '400 Level': [
      'CHM 401 - Physical Chemistry',
      'PHY 401 - Electronics',
      'CSC 402 - Applied Computing',
    ],
  },
}

const selectOptionStyle = {
  backgroundColor: '#ffffff',
  color: '#081120',
}

type DemoAttendancePageProps = {
  liveScanTotal: string
  verifiedEntries: string
  currentScan: unknown
  scanLog: unknown[]
  onSimulateScan: () => void
  onMockLogin: () => void
}

function DemoAttendancePage({ liveScanTotal, verifiedEntries }: DemoAttendancePageProps) {
  const [department, setDepartment] = useState<Department>(departmentOptions[0])
  const [level, setLevel] = useState<Level>(levelOptions[0])
  const [course, setCourse] = useState<string>(courseCatalog[departmentOptions[0]][levelOptions[0]][0])
  const [attendanceLog, setAttendanceLog] = useState<AttendanceRecord[]>([])
  const [latestAttendance, setLatestAttendance] = useState<AttendanceRecord | null>(null)

  const availableCourses = courseCatalog[department][level]

  const handleDepartmentChange = (nextDepartment: Department) => {
    setDepartment(nextDepartment)

    const nextCourses = courseCatalog[nextDepartment][level]
    setCourse(nextCourses[0])
  }

  const handleLevelChange = (nextLevel: Level) => {
    setLevel(nextLevel)

    const nextCourses = courseCatalog[department][nextLevel]
    setCourse(nextCourses[0])
  }

  const handleSimulateAttendance = () => {
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

    const nextIndex = attendanceLog.length + 1
    const record: AttendanceRecord = {
      id: `ATT-${departmentCodes[department]}-${levelCodes[level]}-${String(nextIndex).padStart(3, '0')}`,
      department,
      level,
      course,
      status: 'Present',
      time,
    }

    setLatestAttendance(record)
    setAttendanceLog((currentLog) => [record, ...currentLog].slice(0, 6))
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="panel rounded-[2.25rem] p-6 sm:p-8 lg:p-10" data-aos="fade-up">
        <span className="section-kicker">Demo attendance / route view</span>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="section-title">Demo Attendance</h1>
              <p className="section-copy">
                Choose a college, level, and course. The course list changes automatically based on the
                selected department and level, then you can simulate attendance and see the generated
                record on the page.
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
                <p className="mt-2 text-sm text-(--muted)">Live scans</p>
              </div>

              <div className="rounded-3xl border border-(--border) bg-(--surface-soft) p-4">
                <div className="flex items-center gap-2 text-(--accent-3)">
                  <BadgeCheck className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--muted)">
                    Verified
                  </p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-(--text)">{verifiedEntries}</p>
                <p className="mt-2 text-sm text-(--muted)">Credential checks</p>
              </div>

              <div className="rounded-3xl border border-(--border) bg-(--surface-soft) p-4">
                <div className="flex items-center gap-2 text-(--accent)">
                  <Clock3 className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--muted)">
                    Simulated
                  </p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-(--text)">{attendanceLog.length}</p>
                <p className="mt-2 text-sm text-(--muted)">Attendance records</p>
              </div>
            </div>

            <div className="rounded-4xl border border-(--border) bg-(--surface-soft) p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(34,197,94,0.14)] text-(--accent-2)">
                  <ScanLine className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-(--muted)">
                    Attendance form
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-(--text)">
                    Filter by department, level, and course
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-(--muted)">
                    Department
                  </span>
                  <div className="relative">
                    <select
                      className="field-shell appearance-none pr-11"
                      value={department}
                      onChange={(event) => {
                        handleDepartmentChange(event.target.value as Department)
                      }}
                    >
                      {departmentOptions.map((item) => (
                        <option key={item} value={item} style={selectOptionStyle}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--muted)" />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-(--muted)">
                    Level
                  </span>
                  <div className="relative">
                    <select
                      className="field-shell appearance-none pr-11"
                      value={level}
                      onChange={(event) => {
                        handleLevelChange(event.target.value as Level)
                      }}
                    >
                      {levelOptions.map((item) => (
                        <option key={item} value={item} style={selectOptionStyle}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--muted)" />
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-(--muted)">
                    Course
                  </span>
                  <div className="relative">
                    <select
                      className="field-shell appearance-none pr-11"
                      value={course}
                      onChange={(event) => {
                        setCourse(event.target.value)
                      }}
                    >
                      {availableCourses.map((item) => (
                        <option key={item} value={item} style={selectOptionStyle}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--muted)" />
                  </div>
                </label>
              </div>

              <p className="mt-4 text-sm leading-7 text-(--muted)">
                Course options refresh automatically when you change the department or level.
              </p>

              <button
                type="button"
                onClick={handleSimulateAttendance}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--accent-2),#7cf7a2)] px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                <ScanLine className="h-4 w-4" />
                Simulate attendance
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-4xl border border-(--border) bg-(--surface-soft) p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-(--muted)">
                    Latest result
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-(--text)">Attendance record</h2>
                </div>
                <span className="status-chip green">
                  <BadgeCheck className="h-4 w-4" />
                  Ready
                </span>
              </div>

              {latestAttendance ? (
                <div className="mt-5 rounded-[1.75rem] border border-(--border) bg-(--surface-strong) p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-(--muted)">Generated ID</p>
                      <h3 className="mt-2 text-2xl font-semibold text-(--text)">{latestAttendance.id}</h3>
                      <p className="mt-2 text-sm leading-7 text-(--muted)">
                        {latestAttendance.department} | {latestAttendance.level}
                      </p>
                    </div>

                    <span className="status-chip green">
                      <BadgeCheck className="h-4 w-4" />
                      {latestAttendance.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl border border-(--border) bg-(--surface-soft) p-4">
                      <div className="flex items-center gap-2 text-(--accent-2)">
                        <GraduationCap className="h-4 w-4" />
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--muted)">
                          Course
                        </p>
                      </div>
                      <p className="mt-3 text-lg font-semibold text-(--text)">{latestAttendance.course}</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-(--border) bg-(--surface-soft) p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Time</p>
                        <p className="mt-2 text-lg font-semibold text-(--text)">{latestAttendance.time}</p>
                      </div>

                      <div className="rounded-2xl border border-(--border) bg-(--surface-soft) p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-(--muted)">Status</p>
                        <p className="mt-2 text-lg font-semibold text-(--text)">
                          {latestAttendance.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-[1.75rem] border border-(--border) bg-(--surface-strong) p-5 text-sm leading-7 text-(--muted)">
                  No attendance has been simulated yet. Select a department, level, and course, then click
                  Simulate attendance to generate the first record.
                </div>
              )}
            </div>

            <div className="rounded-4xl border border-(--border) bg-(--surface-soft) p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(56,189,248,0.14)] text-(--accent-3)">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-(--muted)">
                    Attendance history
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-(--text)">Recent simulated records</h3>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {attendanceLog.length ? (
                  attendanceLog.map((record) => (
                    <article key={record.id} className="rounded-3xl border border-(--border) bg-(--surface-strong) p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-(--text)">{record.course}</p>
                          <p className="mt-1 text-sm leading-6 text-(--muted)">
                            {record.department} | {record.level}
                          </p>
                        </div>

                        <span className="status-chip green">
                          <BadgeCheck className="h-4 w-4" />
                          {record.status}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-(--muted)">
                        <span className="rounded-full border border-(--border) px-3 py-1">
                          {record.id}
                        </span>
                        <span className="rounded-full border border-(--border) px-3 py-1">
                          {record.time}
                        </span>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-3xl border border-(--border) bg-(--surface-strong) p-4 text-sm leading-7 text-(--muted)">
                    Your simulated attendance entries will appear here after you generate the first record.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DemoAttendancePage