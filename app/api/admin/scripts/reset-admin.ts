import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.admin.upsert({
    where: { id: 'admin' },
    update: { passwordHash: 'Admin' },
    create: {
      id: 'admin',
      passwordHash: 'Admin'
    }
  })
  console.log('Admin password reset to: Admin')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())