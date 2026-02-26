import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Add default admin
  await prisma.admin.upsert({
    where: { id: 'admin' },
    update: {},
    create: {
      id: 'admin',
      passwordHash: 'Admin' // Change this in production!
    }
  })

  // Add curricula
  const curricula = ['IGCSE', 'A-Levels', 'O-Levels', 'Matric', 'Intermediate']
  for (const name of curricula) {
    await prisma.curriculum.upsert({
      where: { name },
      update: {},
      create: { name }
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())