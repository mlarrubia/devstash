import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🔍 Testing database...\n')

  // ── Item Types ──────────────────────────────────────────
  const itemTypes = await prisma.itemType.findMany({ orderBy: { name: 'asc' } })
  console.log(`📦 Item Types (${itemTypes.length})`)
  itemTypes.forEach((t) => console.log(`   ${t.color}  ${t.name} — icon: ${t.icon}`))

  // ── Users ───────────────────────────────────────────────
  const users = await prisma.user.findMany()
  console.log(`\n👤 Users (${users.length})`)
  users.forEach((u) =>
    console.log(`   ${u.email} | name: ${u.name} | isPro: ${u.isPro} | verified: ${u.emailVerified ? '✓' : '✗'}`)
  )

  // ── Collections with item counts ────────────────────────
  const collections = await prisma.collection.findMany({
    include: { items: true, defaultType: true },
    orderBy: { name: 'asc' },
  })
  console.log(`\n📁 Collections (${collections.length})`)
  collections.forEach((c) => {
    const type = c.defaultType ? ` [default: ${c.defaultType.name}]` : ''
    const fav = c.isFavorite ? ' ⭐' : ''
    console.log(`   ${c.name}${fav}${type} — ${c.items.length} items`)
    console.log(`   └─ ${c.description}`)
  })

  // ── Items grouped by collection ─────────────────────────
  const collectionsWithItems = await prisma.collection.findMany({
    include: {
      items: {
        include: {
          item: { include: { itemType: true } },
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  console.log('\n📝 Items by Collection')
  collectionsWithItems.forEach((c) => {
    console.log(`\n   📁 ${c.name}`)
    c.items.forEach(({ item: i }) => {
      const pinned = i.isPinned ? ' 📌' : ''
      const fav = i.isFavorite ? ' ⭐' : ''
      const meta = i.contentType === 'URL' ? ` → ${i.url}` : i.language ? ` (${i.language})` : ''
      console.log(`      [${i.itemType.name}]${pinned}${fav} ${i.title}${meta}`)
    })
  })

  // ── Summary ─────────────────────────────────────────────
  const totalItems = await prisma.item.count()
  const pinnedItems = await prisma.item.count({ where: { isPinned: true } })
  const favItems = await prisma.item.count({ where: { isFavorite: true } })
  const favCollections = await prisma.collection.count({ where: { isFavorite: true } })

  console.log('\n📊 Summary')
  console.log(`   Items: ${totalItems} total | ${pinnedItems} pinned | ${favItems} favorited`)
  console.log(`   Collections: ${collections.length} total | ${favCollections} favorited`)
  console.log(`   Item types: ${itemTypes.length}`)

  console.log('\n✅ All checks passed!')
}

main()
  .catch((e) => {
    console.error('❌ Test failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
