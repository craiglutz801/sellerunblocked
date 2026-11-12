import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BarChart2,
  FolderKanban,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  MessageSquare,
  Settings,
  Sparkles,
  Target,
} from 'lucide-react'

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
}

export const EXEC_NAV: NavItem[] = [
  { href: '/app/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/app/diagnostics', label: 'Diagnostics', icon: Activity },
  { href: '/app/insights', label: 'Insights', icon: Lightbulb },
  { href: '/app/unblocked-ai', label: 'UnblockedAI', icon: Sparkles },
  { href: '/app/recommendations', label: 'Recommendations', icon: Target },
  { href: '/app/actions', label: 'Actions', icon: ListChecks },
  { href: '/app/benchmarks', label: 'Benchmarks', icon: BarChart2 },
  { href: '/app/responses', label: 'Responses', icon: MessageSquare },
  { href: '/app/programs', label: 'Programs', icon: FolderKanban },
  { href: '/app/settings', label: 'Settings', icon: Settings },
]

export const EXEC_PORTAL = {
  id: 'exec' as const,
  name: 'Leadership',
  homeHref: '/app/overview',
  badge: 'DemoTech · Executive',
}
