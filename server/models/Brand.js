const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  website: {
    type: String,
    trim: true
  },
  targetAudience: {
    demographics: {
      ageRange: {
        min: Number,
        max: Number
      },
      gender: {
        type: String,
        enum: ['male', 'female', 'all']
      },
      location: [String],
      interests: [String]
    },
    psychographics: {
      values: [String],
      lifestyle: [String],
      painPoints: [String]
    }
  },
  brandVoice: {
    tone: {
      type: String,
      required: true,
      enum: ['professional', 'casual', 'friendly', 'authoritative', 'playful', 'inspirational']
    },
    personality: [String],
    doNotUse: [String],
    keyMessages: [String]
  },
  visualIdentity: {
    logo: {
      type: String,
      default: null
    },
    colors: {
      primary: {
        type: String,
        default: '#2563eb'
      },
      secondary: {
        type: String,
        default: '#3b82f6'
      },
      accent: [String]
    },
    fonts: {
      primary: {
        type: String,
        default: 'Inter'
      },
      secondary: String
    }
  },
  socialAccounts: {
    instagram: {
      connected: {
        type: Boolean,
        default: false
      },
      username: String,
      accessToken: String,
      refreshToken: String
    },
    linkedin: {
      connected: {
        type: Boolean,
        default: false
      },
      username: String,
      accessToken: String,
      refreshToken: String
    },
    twitter: {
      connected: {
        type: Boolean,
        default: false
      },
      username: String,
      accessToken: String,
      refreshToken: String
    },
    facebook: {
      connected: {
        type: Boolean,
        default: false
      },
      pageId: String,
      accessToken: String,
      refreshToken: String
    },
    youtube: {
      connected: {
        type: Boolean,
        default: false
      },
      channelId: String,
      accessToken: String,
      refreshToken: String
    },
    tiktok: {
      connected: {
        type: Boolean,
        default: false
      },
      username: String,
      accessToken: String,
      refreshToken: String
    }
  },
  competitors: [{
    name: String,
    website: String,
    socialHandles: {
      instagram: String,
      linkedin: String,
      twitter: String
    },
    strengths: [String],
    weaknesses: [String]
  }],
  contentGuidelines: {
    preferredContentTypes: [String],
    postingFrequency: {
      instagram: Number,
      linkedin: Number,
      twitter: Number,
      facebook: Number,
      youtube: Number,
      tiktok: Number
    },
    hashtagStrategy: {
      branded: [String],
      industry: [String],
      trending: [String]
    },
    contentPillars: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
brandSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Brand', brandSchema);