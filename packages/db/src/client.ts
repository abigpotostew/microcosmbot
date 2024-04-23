import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

let client: ReturnType<typeof createClient> | null = null
export const prismaClient = () => {
  if (!client) {
    client = createClient()
  }
  return client
}
export const createClient = () => {
  return new PrismaClient().$extends(withAccelerate())
}

export const goforit = true
