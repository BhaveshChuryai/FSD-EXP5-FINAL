import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LOCAL_URI = 'mongodb://127.0.0.1:27017/plottage_hub'
const BACKUP_DIR = path.resolve(__dirname, '../../backup')

async function backupLocalDatabase() {
  console.log('\n======================================================')
  console.log('💾 PLOTTAGE HUB — LOCAL DATABASE BACKUP UTILITY')
  console.log('======================================================')

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
  }

  try {
    console.log('Connecting to local MongoDB:', LOCAL_URI)
    const conn = await mongoose.connect(LOCAL_URI, {
      serverSelectionTimeoutMS: 5000,
    })

    const db = conn.connection.db
    const collections = await db.collections()

    console.log(`Found ${collections.length} collections to back up.\n`)

    const backupSummary = {
      timestamp: new Date().toISOString(),
      database: 'plottage_hub',
      source: '127.0.0.1:27017',
      collections: {},
    }

    for (const col of collections) {
      const colName = col.collectionName
      const docs = await col.find({}).toArray()
      const filePath = path.join(BACKUP_DIR, `${colName}.json`)
      fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf-8')
      backupSummary.collections[colName] = docs.length
      console.log(`  ✅ Backed up collection [${colName}]: ${docs.length} documents -> backup/${colName}.json`)
    }

    const summaryPath = path.join(BACKUP_DIR, 'backup-manifest.json')
    fs.writeFileSync(summaryPath, JSON.stringify(backupSummary, null, 2), 'utf-8')

    console.log('\n🎉 Backup completed successfully!')
    console.log(`📁 Files saved safely to: ${BACKUP_DIR}`)
    console.log('======================================================\n')
  } catch (error) {
    console.error('❌ Backup failed:', error.message)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
  }
}

backupLocalDatabase()
