import dotenv from 'dotenv'
dotenv.config()

import { connectDB, disconnectDB } from '../config/db.js'
import User from '../models/User.js'

/**
 * Bootstraps or verifies the initial system administrator.
 * Reads administrator credentials from environment variables:
 * - ADMIN_EMAIL (default: admin@plottagehub.com)
 * - ADMIN_PASSWORD (default: Admin@12345)
 * - ADMIN_NAME (default: Plottage Hub SuperAdmin)
 * - ADMIN_PHONE (default: 9820000001)
 *
 * This script is executed during system deployment or container initialization,
 * ensuring public registration endpoints can never create an administrator.
 */
async function bootstrapAdmin() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@plottagehub.com').trim().toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345'
  const adminName = (process.env.ADMIN_NAME || 'Plottage Hub SuperAdmin').trim()
  const adminPhone = (process.env.ADMIN_PHONE || '9820000001').trim()

  if (adminPassword.length < 8) {
    console.error('❌ Bootstrap Error: ADMIN_PASSWORD must be at least 8 characters long.')
    process.exit(1)
  }

  try {
    await connectDB()

    let admin = await User.findOne({ email: adminEmail })

    if (!admin) {
      admin = new User({
        name: adminName,
        email: adminEmail,
        password: adminPassword, // Pre-save hook securely hashes with bcrypt
        phone: adminPhone,
        role: 'Admin',
      })
      await admin.save()
      console.log(`✅ [BOOTSTRAP SUCCESS] Initial administrator created: ${adminEmail} (Role: Admin)`)
    } else {
      let modified = false
      if (admin.role !== 'Admin' && admin.role !== 'admin') {
        admin.role = 'Admin'
        modified = true
      }
      if (modified) {
        await admin.save()
        console.log(`✅ [BOOTSTRAP SUCCESS] Existing user promoted to administrator: ${adminEmail}`)
      } else {
        console.log(`ℹ️ [BOOTSTRAP INFO] Administrator account already active: ${adminEmail}`)
      }
    }
  } catch (err) {
    console.error('❌ Bootstrap Failure:', err.message)
    process.exit(1)
  } finally {
    await disconnectDB()
    process.exit(0)
  }
}

bootstrapAdmin()
