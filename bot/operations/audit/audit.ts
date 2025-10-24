import { Prisma, prismaClient } from 'prisma'

type AuditTypes = 'MY_CHAT_MEMBER' | 'CHAT_MEMBER' | 'VERIFY_ATTEMPT'

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
