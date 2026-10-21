import mongoose from 'mongoose'

const partnerApplicationSchema = new mongoose.Schema(
  {
    referenceId: {
      type: String,
      unique: true,
      index: true,
    },
    partnerType: {
      type: String,
      required: [true, 'Partner type is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Full name or company name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    location: {
      type: String,
      trim: true,
      default: 'Maharashtra',
    },
    docStatus: {
      type: String,
      trim: true,
      default: '7/12 Available',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['Pending Review', 'Under Verification', 'Approved', 'Rejected'],
      default: 'Pending Review',
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

partnerApplicationSchema.pre('save', function (next) {
  if (!this.referenceId) {
    this.referenceId = `PH-APP-${Date.now().toString().slice(-6)}`
  }
  next()
})

const PartnerApplication = mongoose.model('PartnerApplication', partnerApplicationSchema)
export default PartnerApplication
