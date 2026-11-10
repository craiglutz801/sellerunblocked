import { cookies } from 'next/headers'
import { buildReport } from '@/lib/customers/report'
import { customerRoot, operatorUser } from '@/lib/customers/store'
import type { WorkspaceReport } from '@/lib/customers/types'

export function loadReport(): WorkspaceReport {
  const slug = cookies().get('su-customer')?.value
  const root = customerRoot()
  return buildReport({ root, user: operatorUser(root), slug })
}
