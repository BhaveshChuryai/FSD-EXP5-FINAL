import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [160, 'Title cannot exceed 160 characters'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location / district is required'],
      trim: true,
      index: true,
    },
    detailedAddress: {
      type: String,
      trim: true,
      default: '',
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: {
        values: [
          'Agricultural',
          'Agricultural Land',
          'Residential',
          'Residential Plots',
          'Residential Plots / Layout',
          'Commercial',
          'Commercial Land',
          'Investment',
          'Investment Land',
          'Farmhouse',
          'Farmhouse / Second Home Parcel',
          'Farmhouse / Second-Home Land',
          'Development',
          'Development Land',
          'Development / Joint Venture Parcel',
          'Industrial',
          'Industrial Zone Land',
          'Eco-Retreat / Hospitality Land',
        ],
        message: '{VALUE} is not a supported property type',
      },
      index: true,
    },
    area: {
      type: Number,
      required: [true, 'Area is required'],
      min: [0.01, 'Area must be greater than zero'],
    },
    areaUnit: {
      type: String,
      required: [true, 'Area unit is required'],
      enum: ['Sq.ft', 'Sq.m', 'Guntha', 'Acre', 'Acres', 'Hectare'],
      default: 'Acre',
    },
    acreEquivalent: {
      type: Number,
      default: 1,
      index: true,
    },
    price: {
      type: String,
      required: [true, 'Price display string is required'],
      trim: true,
    },
    priceAmount: {
      type: Number,
      default: 0,
      index: true,
    },
    priceFlexibility: {
      type: String,
      trim: true,
      default: 'Negotiable based on payment terms',
    },
    images: {
      type: [String],
      default: ['/assets/property-agri.jpg'],
    },
    infrastructure: {
      type: [String],
      default: [],
    },
    docStatus: {
      type: String,
      trim: true,
      default: '7/12 Extract Available',
    },
    ownership: {
      type: String,
      trim: true,
      default: 'Sole Landowner',
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['Pending Review', 'Approved', 'Published', 'Rejected'],
      default: 'Pending Review',
      index: true,
    },
    ownerContact: {
      name: { type: String, trim: true, select: false },
      phone: { type: String, trim: true, select: false },
      email: { type: String, trim: true, lowercase: true, select: false },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Pre-save hook to generate slug and acreEquivalent if not set
propertySchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    this.slug = `${baseSlug}-${randomSuffix}`
  }

  // Calculate acre equivalent for standardized filtering
  if (this.isModified('area') || this.isModified('areaUnit')) {
    const a = Number(this.area) || 1
    const unit = (this.areaUnit || '').toLowerCase()
    if (unit.startsWith('acre')) {
      this.acreEquivalent = a
    } else if (unit === 'guntha') {
      this.acreEquivalent = a / 40
    } else if (unit === 'hectare') {
      this.acreEquivalent = a * 2.471
    } else if (unit.includes('sq.ft')) {
      this.acreEquivalent = a / 43560
    } else if (unit.includes('sq.m')) {
      this.acreEquivalent = a / 4047
    }
  }

  next()
})

const Property = mongoose.model('Property', propertySchema)
export default Property
