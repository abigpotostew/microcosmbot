import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

let client: PrismaClient | null = null
export const prismaClient = () => {
  if (!client) {
    // @ts-ignore
    client = new PrismaClient().$extends(withAccelerate())
  }
  return client
}

export const goforit = true
