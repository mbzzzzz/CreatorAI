const express = require('express');
const Content = require('../models/Content');
const Brand = require('../models/Brand');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all content for user
router.get('/', auth, async (req, res) => {
  try {
    const { brandId, platform, status, page = 1, limit = 20 } = req.query;
    
    const filter = { userId: req.userId, isArchived: false };
    if (brandId) filter.brandId = brandId;
    if (platform) filter.platform = platform;
    if (status) filter['scheduling.status'] = status;

    const content = await Content.find(filter)
      .populate('brandId', 'name industry')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Content.countDocuments(filter);

    res.json({
      content,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single content item
router.get('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    }).populate('brandId', 'name industry');
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new content
router.post('/', auth, async (req, res) => {
  try {
    // Verify brand belongs to user
    const brand = await Brand.findOne({ 
      _id: req.body.brandId, 
      userId: req.userId 
    });
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    const contentData = {
      ...req.body,
      userId: req.userId
    };

    const content = new Content(contentData);
    await content.save();

    const populatedContent = await Content.findById(content._id)
      .populate('brandId', 'name industry');

    res.status(201).json(populatedContent);
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update content
router.put('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    ).populate('brandId', 'name industry');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete content (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isArchived: true },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Schedule content
router.post('/:id/schedule', auth, async (req, res) => {
  try {
    const { scheduledFor, timezone = 'UTC' } = req.body;

    const content = await Content.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        'scheduling.status': 'scheduled',
        'scheduling.scheduledFor': new Date(scheduledFor),
        'scheduling.timezone': timezone
      },
      { new: true }
    ).populate('brandId', 'name industry');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.error('Error scheduling content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Publish content immediately
router.post('/:id/publish', auth, async (req, res) => {
  try {
    const content = await Content.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        'scheduling.status': 'published',
        'scheduling.publishedAt': new Date()
      },
      { new: true }
    ).populate('brandId', 'name industry');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Here you would integrate with social media APIs to actually publish
    // For now, we'll just update the status

    res.json(content);
  } catch (error) {
    console.error('Error publishing content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update content performance metrics
router.put('/:id/performance', auth, async (req, res) => {
  try {
    const { impressions, reach, engagement } = req.body;

    const content = await Content.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        'performance.impressions': impressions,
        'performance.reach': reach,
        'performance.engagement': engagement,
        'performance.lastUpdated': new Date()
      },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.error('Error updating performance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get content analytics
router.get('/analytics/overview', auth, async (req, res) => {
  try {
    const { brandId, timeframe = '30d' } = req.query;
    
    const filter = { userId: req.userId, isArchived: false };
    if (brandId) filter.brandId = brandId;

    // Calculate date range
    const now = new Date();
    const daysAgo = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    filter.createdAt = { $gte: startDate };

    const analytics = await Content.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalContent: { $sum: 1 },
          totalImpressions: { $sum: '$performance.impressions' },
          totalReach: { $sum: '$performance.reach' },
          totalLikes: { $sum: '$performance.engagement.likes' },
          totalComments: { $sum: '$performance.engagement.comments' },
          totalShares: { $sum: '$performance.engagement.shares' },
          avgEngagementRate: { $avg: '$performance.engagementRate' }
        }
      }
    ]);

    const platformBreakdown = await Content.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$platform',
          count: { $sum: 1 },
          impressions: { $sum: '$performance.impressions' },
          engagement: { $sum: { $add: ['$performance.engagement.likes', '$performance.engagement.comments', '$performance.engagement.shares'] } }
        }
      }
    ]);

    const contentTypeBreakdown = await Content.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgEngagement: { $avg: '$performance.engagementRate' }
        }
      }
    ]);

    res.json({
      overview: analytics[0] || {
        totalContent: 0,
        totalImpressions: 0,
        totalReach: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        avgEngagementRate: 0
      },
      platformBreakdown,
      contentTypeBreakdown
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;