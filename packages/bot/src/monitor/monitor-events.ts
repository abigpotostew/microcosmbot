import { z } from 'zod'

export enum MonitorEvents {
  // Group
  GROUP_CREATED = 'GROUP_CREATED',
  GROUP_UPDATED = 'GROUP_UPDATED',
  GROUP_DELETED = 'GROUP_DELETED',
  USER_VERIFIED = 'USER_VERIFIED',
  USER_REJECTED = 'USER_REJECTED',
}
const monitorEventSchema = z.discriminatedUnion('event', [
  z.object({
    event: z.literal(MonitorEvents.GROUP_CREATED),
    group: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
  z.object({
    event: z.literal(MonitorEvents.GROUP_UPDATED),
    group: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
  z.object({
    event: z.literal(MonitorEvents.GROUP_DELETED),
    group: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
  z.object({
    event: z.literal(MonitorEvents.USER_VERIFIED),
    group: z.object({
      id: z.string(),
      name: z.string(),
    }),
    user: z.object({
      id: z.string(),
      name: z.string().nullable(),
      address: z.string(),
    }),
  }),
  z.object({
    event: z.literal(MonitorEvents.USER_REJECTED),
    group: z.object({
      id: z.string(),
      name: z.string(),
    }),
    user: z.object({
      id: z.string(),
      name: z.string().nullable(),
      address: z.string(),
    }),
  }),
])

export type MonitorEvent = z.infer<typeof monitorEventSchema>
