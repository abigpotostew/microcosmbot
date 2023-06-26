import { Prisma, prismaClient } from '@microcosms/db'
import { AuditTypes } from '.prisma/client'

export const insertAudit = async (audit: {
  auditType: AuditTypes
  groupId?: string | number
  updateId?: string | number
  updateDate: Date
  data: any
}) => {
  if (process.env.DISABLE_AUDIT_LOGS !== 'true') {
    await prismaClient().auditLog.create({
      data: {
        auditType: 'CHAT_MEMBER',
        groupId: audit.groupId?.toString(),
        data: JSON.parse(JSON.stringify(audit.data)),
        updateDate: audit.updateDate,
        updateId: audit.updateId?.toString(),
      },
    })
  }
}
