import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { BadgeCheck, BarChart3, Check, ShieldCheck } from 'lucide-react'

type SubscriptionPlanId = 'starter' | 'pro' | 'enterprise'

type SubscriptionPlan = {
  id: SubscriptionPlanId
  name: string
  price: string
  billing: string
  description: string
  icon: LucideIcon
  features: string[]
  featured?: boolean
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₦50,000',
    billing: 'per month',
    description: 'For pilots and small teams testing the workflow.',
    icon: BadgeCheck,
    features: ['10 readers', 'Basic activity logs', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₦150,000',
    billing: 'per month',
    description: 'Best for active campuses and operations teams.',
    icon: BarChart3,
    features: ['Up to 30 readers', 'Dashboard analytics', 'Priority support', '+ Starter features'],
    featured: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    billing: 'pricing',
    description: 'For multi-building rollouts with admin control.',
    icon: ShieldCheck,
    features: ['Multi-site support', 'Access policy controls', 'Dedicated onboarding', 'Customizable Features'],
  },
]

type SubscriptionPanelProps = {
  recommendedPlanId?: SubscriptionPlanId
  activeUsers?: number
}

function SubscriptionPanel({ recommendedPlanId, activeUsers }: SubscriptionPanelProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>(recommendedPlanId ?? 'pro')

  useEffect(() => {
    if (recommendedPlanId) {
      setSelectedPlan(recommendedPlanId)
    }
  }, [recommendedPlanId])

  const activePlan =
    subscriptionPlans.find((plan) => plan.id === selectedPlan) ?? subscriptionPlans[1]

  const recommendedPlan =
    subscriptionPlans.find((plan) => plan.id === (recommendedPlanId ?? selectedPlan)) ??
    subscriptionPlans[1]

  const signalLabel = activeUsers !== undefined ? 'Live recommendation' : 'Preview only'

  return (
    <section className="panel rounded-[2rem] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted)]">
            Subscription
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Choose a plan</h2>
        </div>
        <span className={activeUsers !== undefined ? 'status-chip green' : 'status-chip purple'}>
          {signalLabel}
        </span>
      </div>

      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
        Pick Starter, Pro, or Enterprise to match the rollout size.
      </p>

      {activeUsers !== undefined ? (
        <div className="mt-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted)]">
            Recommendation
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            Based on {activeUsers} active users,{' '}
            <span className="font-semibold text-[var(--text)]">{recommendedPlan.name}</span> is the best fit right now.
          </p>
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {subscriptionPlans.map((plan, index) => {
          const Icon = plan.icon
          const isSelected = plan.id === selectedPlan

          return (
            <button
              key={plan.id || index}
              type="button"
              onClick={() => setSelectedPlan(plan.id)}
              aria-pressed={isSelected}
              className={`w-full rounded-[1.5rem] border p-4 text-left transition duration-200 ${
                isSelected
                  ? 'border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.08)] shadow-[0_0_0_1px_rgba(34,197,94,0.12)]'
                  : 'border-[var(--border)] bg-[var(--surface-soft)] hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.22)]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                      isSelected
                        ? 'border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.14)] text-[var(--accent-2)]'
                        : 'border-[var(--border)] bg-[var(--surface-strong)] text-[var(--accent)]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-[var(--text)]">{plan.name}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{plan.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-semibold text-[var(--text)]">{plan.price}</p>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">{plan.billing}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {plan.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1.5 text-xs font-medium text-[var(--text)]"
                  >
                    <Check className="h-3.5 w-3.5 text-[var(--accent-2)]" />
                    {feature}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                  {isSelected ? 'Selected plan' : 'Select plan'}
                </span>
                {plan.featured ? <span className="status-chip green">Recommended</span> : null}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted)]">
          Current selection
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-[var(--text)]">{activePlan.name}</h3>
            <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--muted)]">
              {activePlan.description}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-semibold text-[var(--text)]">{activePlan.price}</p>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">{activePlan.billing}</p>
          </div>
        </div>
        <p className="mt-4 text-xs leading-6 text-[var(--muted)]">
          The panel stays interactive, and the recommended plan can follow the live dashboard load.
        </p>
      </div>
    </section>
  )
}

export default SubscriptionPanel