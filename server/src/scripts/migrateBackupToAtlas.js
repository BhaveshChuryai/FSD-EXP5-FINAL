import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
dotenv.config()

import { connectDB, disconnectDB } from '../config/db.js'
import Property from '../models/Property.js'
import User from '../models/User.js'
import Lead from '../models/Lead.js'
import PartnerApplication from '../models/PartnerApplication.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const BACKUP_DIR = path.resolve(__dirname, '../../backup')

async function migrateData() {
  console.log('\n======================================================')
  console.log('🚀 PLOTTAGE HUB — DATABASE RESTORE / ATLAS MIGRATOR')
  console.log('======================================================')

  if (!fs.existsSync(BACKUP_DIR)) {
    console.error('❌ Backup directory not found at:', BACKUP_DIR)
    process.exit(1)
  }

  try {
    await connectDB()
    console.log('Target database connected successfully.\n')

    // 1. Properties
    const propFile = path.join(BACKUP_DIR, 'properties.json')
    if (fs.existsSync(propFile)) {
      const properties = JSON.parse(fs.readFileSync(propFile, 'utf-8'))
      let inserted = 0
      let skipped = 0
      for (const p of properties) {
        // Strip _id to allow clean insert or match on title to avoid duplicates
        const exists = await Property.findOne({ title: p.title })
        if (!exists) {
          const { _id, __v, ...data } = p
          await Property.create(data)
          inserted++
        } else {
          skipped++
        }
      }
      console.log(`🏡 Properties: ${inserted} inserted, ${skipped} already existed (no duplicates).`)
    }

    // 2. Users
    const userFile = path.join(BACKUP_DIR, 'users.json')
    if (fs.existsSync(userFile)) {
      const users = JSON.parse(fs.readFileSync(userFile, 'utf-8'))
      let inserted = 0
      let skipped = 0
      for (const u of users) {
        const exists = await User.findOne({ email: u.email })
        if (!exists) {
          const { _id, __v, ...data } = u
          // Insert raw document directly to preserve pre-existing bcrypt password hash
          await User.collection.insertOne(data)
          inserted++
        } else {
          skipped++
        }
      }
      console.log(`👥 Users: ${inserted} inserted, ${skipped} already existed (no duplicates).`)
    }

    // 3. Leads
    const leadFile = path.join(BACKUP_DIR, 'leads.json')
    if (fs.existsSync(leadFile)) {
      const leads = JSON.parse(fs.readFileSync(leadFile, 'utf-8'))
      let inserted = 0
      let skipped = 0
      for (const l of leads) {
        const query = l.referenceId ? { referenceId: l.referenceId } : { phone: l.phone, name: l.name }
        const exists = await Lead.findOne(query)
        if (!exists) {
          const { _id, __v, ...data } = l
          await Lead.create(data)
          inserted++
        } else {
          skipped++
        }
      }
      console.log(`📋 Leads: ${inserted} inserted, ${skipped} already existed (no duplicates).`)
    }

    // 4. Partner Applications
    const partnerFile = path.join(BACKUP_DIR, 'partnerapplications.json')
    if (fs.existsSync(partnerFile)) {
      const partners = JSON.parse(fs.readFileSync(partnerFile, 'utf-8'))
      let inserted = 0
      let skipped = 0
      for (const part of partners) {
        const exists = await PartnerApplication.findOne({ email: part.email })
        if (!exists) {
          const { _id, __v, ...data } = part
          await PartnerApplication.create(data)
          inserted++
        } else {
          skipped++
        }
      }
      console.log(`🤝 Partner Applications: ${inserted} inserted, ${skipped} already existed (no duplicates).`)
    }

    console.log('\n✨ Migration / Restore completed successfully without duplicates!')
    console.log('======================================================\n')
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    await disconnectDB()
    process.exit(0)
  }
}

migrateData()
