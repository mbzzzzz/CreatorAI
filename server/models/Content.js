const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['post', 'story', 'reel', 'video', 'article', 'thread', 'carousel']
  },
  platform: {
    type: String,
    required: true,
    enum: ['instagram', 'linkedin', 'twitter', 'facebook', 'youtube', 'tiktok', 'all']
  },
  content: {
    caption: {
      type: String,
      required: true
    },
    hashtags: [String],
    mentions: [String],
    cta: String
  },
  media: {
    images: [{
      url: String,
      alt: String,
      cloudinaryId: String
    }],
    videos: [{
      url: String,
      thumbnail: String,
      duration: Number,
      cloudinaryId: String
    }],
    aiPrompts: [{
      type: String,
      prompt: String,
      generated: Boolean
    }]
  },
  scheduling: {
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published', 'failed'],
      default: 'draft'
    },
    scheduledFor: Date,
    publishedAt: Date,
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  performance: {
    impressions: {
      type: Number,
      default: 0
    },
    reach: {
      type: Number,
      default: 0
    },
    engagement: {
      likes: {
        type: Number,
        default: 0
      },
      comments: {
        type: Number,
        default: 0
      },
      shares: {
        type: Number,
        default: 0
      },
      saves: {
        type: Number,
        default: 0
      },
      clicks: {
        type: Number,
        default: 0
      }
    },
    engagementRate: {
      type: Number,
      default: 0
    },
    lastUpdated: Date
  },
  aiGenerated: {
    isAiGenerated: {
      type: Boolean,
      default: false
    },
    model: String,
    prompt: String,
    confidence: Number,
    iterations: {
      type: Number,
      default: 1
    }
  },
  campaign: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign'
    },
    name: String
  },
  tags: [String],
  notes: String,
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
contentSchema.index({ userId: 1, brandId: 1, 'scheduling.status': 1 });
contentSchema.index({ 'scheduling.scheduledFor': 1 });
contentSchema.index({ platform: 1, type: 1 });

// Calculate engagement rate before saving
contentSchema.pre('save', function(next) {
  if (this.performance.impressions > 0) {
    const totalEngagement = this.performance.engagement.likes + 
                           this.performance.engagement.comments + 
                           this.performance.engagement.shares + 
                           this.performance.engagement.saves;
    this.performance.engagementRate = (totalEngagement / this.performance.impressions) * 100;
  }
  next();
});

module.exports = mongoose.model('Content', contentSchema);