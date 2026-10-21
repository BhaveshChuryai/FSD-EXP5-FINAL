import mongoose from 'mongoose'

const leadSchema = new mongoose.Schema(
  {
    referenceId: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Lead contact name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Preferred location is required'],
      trim: true,
    },
    minBudget: {
      type: Number,
      default: 0,
    },
    maxBudget: {
      type: Number,
      default: 0,
    },
    area: {
      type: String,
      trim: true,
    },
    areaUnit: {
      type: String,
      trim: true,
      default: 'Acre',
    },
    purpose: {
      type: String,
      trim: true,
      default: 'Investment',
    },
    timeline: {
      type: String,
      trim: true,
      default: 'Exploring / No fixed timeline',
    },
    requirements: {
      type: String,
      trim: true,
      default: '',
    },
    propertyId: {
      type: String,
      trim: true,
      default: null,
    },
    propertyTitle: {
      type: String,
      trim: true,
      default: null,
    },
    preferredDate: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Visit Scheduled', 'Closed'],
      default: 'New',
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

leadSchema.pre('save', function (next) {
  if (!this.referenceId) {
    this.referenceId = `PH-LEAD-${Date.now().toString().slice(-6)}`
  }
  next()
})

const Lead = mongoose.model('Lead', leadSchema)
export default Lead
