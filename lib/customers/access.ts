import type { Catalog, MembershipRecord, OrganizationRecord, UserRecord } from '@/lib/customers/types'

export class CustomerDataError extends Error {
  status: number
  errors: { row?: number; column?: string; message: string }[]

  constructor(message: string, status = 400, errors: { row?: number; column?: string; message: string }[] = []) {
    super(message)
    this.name = 'CustomerDataError'
    this.status = status
    this.errors = errors.length ? errors : [{ message }]
  }
}

export function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 40
}

export function canReadOrganization(user: UserRecord, organizationId: string, memberships: MembershipRecord[]): boolean {
  if (user.status !== 'active') return false
  if (user.platformAdmin) return true
  return memberships.some((membership) => membership.userId === user.id && membership.organizationId === organizationId)
}

export function canAdminOrganization(user: UserRecord, organizationId: string, memberships: MembershipRecord[]): boolean {
  if (user.status !== 'active') return false
  if (user.platformAdmin) return true
  return memberships.some(
    (membership) =>
      membership.userId === user.id && membership.organizationId === organizationId && membership.role === 'admin',
  )
}

/** Admins and analysts can save an action draft. Viewers can read the report and ask. */
export function canWriteActions(user: UserRecord, organizationId: string, memberships: MembershipRecord[]): boolean {
  if (user.status !== 'active') return false
  if (user.platformAdmin) return true
  return memberships.some(
    (membership) =>
      membership.userId === user.id &&
      membership.organizationId === organizationId &&
      (membership.role === 'admin' || membership.role === 'analyst'),
  )
}

export function assertCanRead(user: UserRecord, organization: OrganizationRecord, catalog: Catalog): void {
  if (!canReadOrganization(user, organization.id, catalog.memberships)) {
    throw new CustomerDataError('You do not have access to that customer.', 403)
  }
}

export function assertCanAdmin(user: UserRecord, organization: OrganizationRecord, catalog: Catalog): void {
  if (!canAdminOrganization(user, organization.id, catalog.memberships)) {
    throw new CustomerDataError('You do not have admin access to that customer.', 403)
  }
}

export function readableOrganizations(user: UserRecord, catalog: Catalog): OrganizationRecord[] {
  return catalog.organizations.filter((organization) =>
    canReadOrganization(user, organization.id, catalog.memberships),
  )
}
