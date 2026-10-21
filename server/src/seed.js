import dotenv from 'dotenv'
dotenv.config()

import { connectDB, disconnectDB } from './config/db.js'
import Property from './models/Property.js'
import User from './models/User.js'
import Lead from './models/Lead.js'
import PartnerApplication from './models/PartnerApplication.js'

const SEED_PROPERTIES = [
  {
    title: 'Agricultural Land — Karjat Riverside',
    description: 'Scenic fertile agricultural land along the riverbank in Karjat. Ideal for organic farming, wellness retreat, or private estate. 24/7 natural river water and clear single 7/12 title.',
    location: 'Karjat, Raigad',
    detailedAddress: 'Near Poshir River, Karjat-Matheran Foothills',
    propertyType: 'Agricultural',
    area: 5,
    areaUnit: 'Acre',
    acreEquivalent: 5.0,
    price: '₹ 45 – 55 Lakh',
    priceAmount: 50,
    priceFlexibility: 'Negotiable based on payment terms',
    images: ['/assets/property-agri.jpg', '/assets/karjat.jpg'],
    infrastructure: ['Tar Road Access', 'River Frontage', '3-Phase Electricity', 'Boundary Fenced'],
    docStatus: '7/12 Extract Available & Single Owner',
    ownership: 'Sole Landowner',
    featured: true,
    status: 'Published',
  },
  {
    title: 'Residential Plot — Lonavala Foothills',
    description: 'Exclusive residential plot in a gated sanctuary overlooking the misty hills of Lonavala with ready Collector NA sanction.',
    location: 'Lonavala, Pune',
    detailedAddress: 'Pawna Dam Road, Near Lonavala Valley',
    propertyType: 'Residential',
    area: 2400,
    areaUnit: 'Sq.ft',
    acreEquivalent: 0.055,
    price: '₹ 18 – 24 Lakh',
    priceAmount: 21,
    priceFlexibility: 'Fixed Price with bank loan availability',
    images: ['/assets/property-residential.jpg', '/assets/lonavala.jpg'],
    infrastructure: ['Internal Tar Roads', 'Sanctioned Collector NA', 'Underground Electricity', 'Water Supply'],
    docStatus: 'Clear Collector NA Title with RERA Layout',
    ownership: 'Sanctioned Layout Developer',
    featured: true,
    status: 'Published',
  },
  {
    title: 'Coastal Farmhouse Land — Alibaug',
    description: 'Serene coastal paradise located 20 minutes from Mandwa Jetty in Alibaug. Surrounded by lush flora, fruit orchards, and cool sea breezes.',
    location: 'Alibaug, Raigad',
    detailedAddress: 'Awas Road, Near Mandwa Beach Jetty',
    propertyType: 'Farmhouse',
    area: 15,
    areaUnit: 'Guntha',
    acreEquivalent: 0.375,
    price: '₹ 35 – 50 Lakh',
    priceAmount: 42,
    priceFlexibility: 'Negotiable for direct buyers',
    images: ['/assets/alibaug.jpg'],
    infrastructure: ['Coastal Highway Access', 'Sweet Water Well', 'Fenced Boundary', 'Street Lighting'],
    docStatus: '7/12 Title Search Complete (30 Years)',
    ownership: 'Sole Landowner',
    featured: true,
    status: 'Published',
  },
  {
    title: 'Agricultural Land — Karjat Hills',
    description: 'Expansive hillside agricultural parcel capturing panoramic Sahyadri views, ideal for private farmhouses or horticulture.',
    location: 'Karjat, Raigad',
    detailedAddress: 'Kashele-Bhimashankar Road, Karjat',
    propertyType: 'Agricultural',
    area: 8,
    areaUnit: 'Acre',
    acreEquivalent: 8.0,
    price: '₹ 60 – 75 Lakh',
    priceAmount: 68,
    priceFlexibility: 'Negotiable based on payment milestones',
    images: ['/assets/karjat.jpg'],
    infrastructure: ['Highway Connectivity', 'Perennial Stream', 'Single 7/12 Title', 'High Voltage Line'],
    docStatus: '7/12 Extract Available & Single Owner',
    ownership: 'Sole Landowner',
    featured: false,
    status: 'Published',
  },
  {
    title: 'Investment Plot — Panvel Growth Corridor',
    description: 'High-growth potential land parcel located in the vicinity of the Navi Mumbai International Airport economic hub.',
    location: 'Panvel, Raigad',
    detailedAddress: 'Near Palaspe Phata, Old Mumbai-Pune Expressway',
    propertyType: 'Investment',
    area: 1200,
    areaUnit: 'Sq.ft',
    acreEquivalent: 0.0275,
    price: '₹ 12 – 16 Lakh',
    priceAmount: 14,
    priceFlexibility: 'Non-negotiable institutional pricing',
    images: ['/assets/panvel.jpg'],
    infrastructure: ['Metro Vicinity', 'Clear Title', 'Demarcated Boundary', 'High Appreciation Corridor'],
    docStatus: 'Sanctioned NA Layout Title',
    ownership: 'Developer Partner',
    featured: false,
    status: 'Published',
  },
  {
    title: 'Farmhouse Estate — Lonavala Valley',
    description: 'Premium table-land parcel capturing mist-filled cliff vistas in prime Lonavala, ready for bespoke architectural estate development.',
    location: 'Lonavala, Pune',
    detailedAddress: 'Khandala-Lonavala Ridge Viewpoint',
    propertyType: 'Farmhouse',
    area: 20,
    areaUnit: 'Guntha',
    acreEquivalent: 0.5,
    price: '₹ 80 Lakh – 1.2 Cr',
    priceAmount: 100,
    priceFlexibility: 'Negotiable for quick closing',
    images: ['/assets/lonavala.jpg'],
    infrastructure: ['Valley View Plateau', 'Private Concrete Access Road', 'Gated Compound Wall', 'Direct Power Line'],
    docStatus: 'Clear Title with 7/12 & NOC',
    ownership: 'Sole Landowner',
    featured: false,
    status: 'Published',
  },
]

const SEED_USERS = [
  {
    name: 'Plottage Hub Admin',
    email: 'admin@plottagehub.com',
    phone: '9820000001',
    password: 'Admin@12345',
    role: 'Admin',
  },
  {
    name: 'Aarav Mehta',
    email: 'buyer@plottagehub.com',
    phone: '9820123456',
    password: 'Buyer@12345',
    role: 'Customer',
  },
]

const SEED_LEADS = [
  {
    referenceId: 'PH-LEAD-109201',
    name: 'Rajesh Varma',
    phone: '9820144321',
    email: 'rajesh.varma@example.com',
    propertyType: 'Agricultural Land',
    location: 'Karjat',
    minBudget: 40,
    maxBudget: 60,
    area: '5',
    areaUnit: 'Acre',
    purpose: 'Investment & Farming',
    timeline: 'Within 1 month',
    requirements: 'Looking for riverside fertile agricultural parcel with road access.',
    status: 'New',
  },
  {
    referenceId: 'PH-LEAD-109202',
    name: 'Dr. Sameer Joshi',
    phone: '9892011984',
    email: 'sameer.joshi@example.com',
    propertyType: 'Residential Plots',
    location: 'Lonavala',
    minBudget: 20,
    maxBudget: 30,
    area: '2400',
    areaUnit: 'Sq.ft',
    purpose: 'Second Home',
    timeline: '1–3 months',
    requirements: 'Collector NA plot with clear hill views.',
    status: 'Contacted',
  },
]

const SEED_PARTNERS = [
  {
    referenceId: 'PH-APP-801001',
    partnerType: 'Landowner',
    name: 'Nitin Kadam',
    phone: '9822399881',
    email: 'nitin.kadam@example.com',
    location: 'Khopoli (12 Acres)',
    docStatus: '7/12 Available & Single Owner',
    status: 'Pending Review',
  },
  {
    referenceId: 'PH-APP-801002',
    partnerType: 'Broker',
    name: 'Akruti Realty Brokers',
    phone: '9819944321',
    email: 'contact@akrutirealty.in',
    location: 'Lonavala & Khandala',
    docStatus: 'RERA Registered A519000189',
    status: 'Approved',
  },
]

async function seed() {
  try {
    await connectDB()

    console.log('🌱 Seeding Plottage Hub database with initial records...')

    // 1. Seed Users (Admin & Demo Buyer)
    for (const u of SEED_USERS) {
      const exists = await User.findOne({ email: u.email })
      if (!exists) {
        await User.create(u)
        console.log(`  👤 Created user: ${u.email} [role: ${u.role}]`)
      } else {
        console.log(`  👤 User already exists: ${u.email}`)
      }
    }

    // 2. Seed Published Properties
    const propCount = await Property.countDocuments()
    if (propCount === 0) {
      await Property.insertMany(SEED_PROPERTIES)
      console.log(`  🏡 Inserted ${SEED_PROPERTIES.length} verified land properties.`)
    } else {
      console.log(`  🏡 Properties collection already contains ${propCount} records.`)
    }

    // 3. Seed Leads
    const leadCount = await Lead.countDocuments()
    if (leadCount === 0) {
      await Lead.insertMany(SEED_LEADS)
      console.log(`  📋 Inserted ${SEED_LEADS.length} initial buyer leads.`)
    } else {
      console.log(`  📋 Leads collection already contains ${leadCount} records.`)
    }

    // 4. Seed Partners
    const partCount = await PartnerApplication.countDocuments()
    if (partCount === 0) {
      await PartnerApplication.insertMany(SEED_PARTNERS)
      console.log(`  🤝 Inserted ${SEED_PARTNERS.length} partner applications.`)
    } else {
      console.log(`  🤝 Partner applications collection already contains ${partCount} records.`)
    }

    console.log('✨ Seeding completed successfully!')
  } catch (err) {
    console.error('❌ Seeding failed:', err.message)
  } finally {
    await disconnectDB()
    process.exit(0)
  }
}

seed()
