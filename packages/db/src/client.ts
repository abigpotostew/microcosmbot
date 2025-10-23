import { PrismaClient } from '@prisma/client'

let client: ReturnType<typeof createClient> | null = null
export const prismaClient = () => {
  if (!client) {
    client = createClient()
  }
  return client
}
export const createClient = () => {
  const client = new PrismaClient()
  // if(process.env.PRISMA_ACCELERATE_ENABLED==='true'){
  //   client.$extends(withAccelerate())
  // }
  return client
}

export const goforit = true
