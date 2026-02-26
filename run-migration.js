import { config } from 'dotenv'
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env file
config({ path: path.resolve(__dirname, '.env') })

console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL)

// Run Prisma migration
try {
  execSync('npx prisma migrate dev --name init', { 
    stdio: 'inherit',
    env: process.env 
  })
} catch (error) {
  console.error('Migration failed:', error)
}