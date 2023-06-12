import { PrismaClient } from '@prisma/client'

let client: PrismaClient | null = null
export const prismaClient = () => {
  if (!client) {
    client = new PrismaClient()
  }
  return client
}
