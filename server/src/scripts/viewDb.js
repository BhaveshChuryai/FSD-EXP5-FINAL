import dotenv from 'dotenv'
dotenv.config()

import { connectDB, disconnectDB } from '../config/db.js'
import Property from '../models/Property.js'
import User from '../models/User.js'
import Lead from '../models/Lead.js'
import PartnerApplication from '../models/PartnerApplication.js'

async function inspectDatabase() {
  try {
    console.log('\n======================================================')
    console.log('📊 PLOTTAGE HUB — MONGODB DATABASE INSPECTOR')
    console.log('======================================================')

    await connectDB()

    const propertyCount = await Property.countDocuments()
    const userCount = await User.countDocuments()
    const leadCount = await Lead.countDocuments()
    const partnerCount = await PartnerApplication.countDocuments()

    console.log('\n📁 Database: plottage_hub')
    console.log(`  • Properties Collection:           ${propertyCount} documents`)
    console.log(`  • Users Collection:                ${userCount} documents`)
    console.log(`  • Leads Collection:                ${leadCount} documents`)
    console.log(`  • Partner Applications Collection: ${partnerCount} documents`)

    // 1. Properties
    console.log('\n🏡 PROPERTIES (Sample Records):')
    const properties = await Property.find({})
      .select('title propertyType location price status area areaUnit')
      .limit(6)
      .lean()

    console.table(
      properties.map((p) => ({
        ID: String(p._id).slice(-6),
        Title: p.title.length > 28 ? p.title.slice(0, 25) + '...' : p.title,
        Type: p.propertyType,
        Location: p.location,
        Price: p.price,
        Area: `${p.area} ${p.areaUnit}`,
        Status: p.status,
      }))
    )

    // 2. Users
    console.log('\n👥 REGISTERED USERS:')
    const users = await User.find({}).select('name email role phone createdAt').lean()
    console.table(
      users.map((u) => ({
        ID: String(u._id).slice(-6),
        Name: u.name,
        Email: u.email,
        Role: u.role,
        Phone: u.phone,
      }))
    )

    // 3. Leads / Inquiries
    console.log('\n📋 BUYER LEADS / ENQUIRIES:')
    const leads = await Lead.find({}).select('name phone email location propertyType status').limit(5).lean()
    console.table(
      leads.map((l) => ({
        ID: String(l._id).slice(-6),
        Name: l.name || 'Anonymous',
        Phone: l.phone,
        Email: l.email || '-',
        Location: l.location || 'Any',
        Type: l.propertyType || '-',
        Status: l.status,
      }))
    )

    console.log('\n✅ Database inspection finished successfully.')
    console.log('======================================================\n')
  } catch (error) {
    console.error('❌ Error inspecting database:', error.message)
  } finally {
    await disconnectDB()
    process.exit(0)
  }
}

inspectDatabase()
