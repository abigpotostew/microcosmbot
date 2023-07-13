import { prismaClient } from '../packages/db'

async function main() {
  prismaClient().account.findMany()
}
main()
