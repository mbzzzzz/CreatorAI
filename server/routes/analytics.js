const express = require('express');
const Content = require('../models/Content');
const Brand = require('../models/Brand');
const auth = require('../middleware/auth');

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { brandId, timeframe = '30d' } = req.query;
    
    const filter = { userId: req.userId, isArchived: false };
    if (brandId) filter.brandId = brandId;

    // Calculate date range
    const now = new Date();
    const daysAgo = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    filter.createdAt = { $gte: startDate };

    // Get overall metrics
    const overallMetrics = await Content.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalContent: { $sum: 1 },
          totalImpressions: { $sum: '$performance.impressions' },
          totalReach: { $sum: '$performance.reach' },
          totalEngagement: { 
            $sum: { 
              $add: [
                '$performance.engagement.likes',
                '$performance.engagement.comments', 
                '$performance.engagement.shares',
                '$performance.engagement.saves'
              ] 
            } 
          },
          avgEngagementRate: { $avg: '$performance.engagementRate' }
        }
      }
    ]);

    // Get platform performance
    const platformMetrics = await Content.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$platform',
          contentCount: { $sum: 1 },
          impressions: { $sum: '$performance.impressions' },
          reach: { $sum: '$performance.reach' },
          engagement: { 
            $sum: { 
              $add: [
                '$performance.engagement.likes',
                '$performance.engagement.comments', 
                '$performance.engagement.shares'
              ] 
            } 
          },
          avgEngagementRate: { $avg: '$performance.engagementRate' }
        }
      },
      { $sort: { impressions: -1 } }
    ]);

    // Get content type performance
    const contentTypeMetrics = await Content.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgEngagementRate: { $avg: '$performance.engagementRate' },
          totalImpressions: { $sum: '$performance.impressions' }
        }
      },
      { $sort: { avgEngagementRate: -1 } }
    ]);

    // Get top performing content
    const topContent = await Content.find(filter)
      .populate('brandId', 'name')
      .sort({ 'performance.engagementRate': -1 })
      .limit(10)
      .select('title platform type performance createdAt');

    // Get engagement trends (daily data for the timeframe)
    const engagementTrends = await Content.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          totalEngagement: { 
            $sum: { 
              $add: [
                '$performance.engagement.likes',
                '$performance.engagement.comments', 
                '$performance.engagement.shares'
              ] 
            } 
          },
          totalImpressions: { $sum: '$performance.impressions' },
          contentCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      overview: overallMetrics[0] || {
        totalContent: 0,
        totalImpressions: 0,
        totalReach: 0,
        totalEngagement: 0,
        avgEngagementRate: 0
      },
      platformMetrics,
      contentTypeMetrics,
      topContent,
      engagementTrends
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed platform analytics
router.get('/platforms/:platform', auth, async (req, res) => {
  try {
    const { platform } = req.params;
    const { brandId, timeframe = '30d' } = req.query;
    
    const filter = { 
      userId: req.userId, 
      platform: platform,
      isArchived: false 
    };
    if (brandId) filter.brandId = brandId;

    // Calculate date range
    const now = new Date();
    const daysAgo = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    filter.createdAt = { $gte: startDate };

    const platformAnalytics = await Content.aggregate([
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
          totalSaves: { $sum: '$performance.engagement.saves' },
          avgEngagementRate: { $avg: '$performance.engagementRate' }
        }
      }
    ]);

    // Get content type breakdown for this platform
    const contentTypeBreakdown = await Content.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgEngagementRate: { $avg: '$performance.engagementRate' },
          totalImpressions: { $sum: '$performance.impressions' }
        }
      }
    ]);

    // Get best performing posts
    const topPosts = await Content.find(filter)
      .populate('brandId', 'name')
      .sort({ 'performance.engagementRate': -1 })
      .limit(20)
      .select('title content performance createdAt scheduling');

    res.json({
      platform,
      analytics: platformAnalytics[0] || {
        totalContent: 0,
        totalImpressions: 0,
        totalReach: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalSaves: 0,
        avgEngagementRate: 0
      },
      contentTypeBreakdown,
      topPosts
    });
  } catch (error) {
    console.error('Error fetching platform analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get audience insights
router.get('/audience', auth, async (req, res) => {
  try {
    const { brandId, platform } = req.query;
    
    const filter = { userId: req.userId, isArchived: false };
    if (brandId) filter.brandId = brandId;
    if (platform) filter.platform = platform;

    // Get posting time analysis
    const postingTimeAnalysis = await Content.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { 
            hour: { $hour: '$scheduling.publishedAt' },
            dayOfWeek: { $dayOfWeek: '$scheduling.publishedAt' }
          },
          avgEngagementRate: { $avg: '$performance.engagementRate' },
          totalPosts: { $sum: 1 }
        }
      },
      { $sort: { avgEngagementRate: -1 } }
    ]);

    // Get hashtag performance
    const hashtagPerformance = await Content.aggregate([
      { $match: filter },
      { $unwind: '$content.hashtags' },
      {
        $group: {
          _id: '$content.hashtags',
          usageCount: { $sum: 1 },
          avgEngagementRate: { $avg: '$performance.engagementRate' },
          totalImpressions: { $sum: '$performance.impressions' }
        }
      },
      { $sort: { avgEngagementRate: -1 } },
      { $limit: 50 }
    ]);

    // Get content length analysis
    const contentLengthAnalysis = await Content.aggregate([
      { $match: filter },
      {
        $addFields: {
          captionLength: { $strLenCP: '$content.caption' }
        }
      },
      {
        $bucket: {
          groupBy: '$captionLength',
          boundaries: [0, 50, 100, 200, 500, 1000, 2000],
          default: '2000+',
          output: {
            count: { $sum: 1 },
            avgEngagementRate: { $avg: '$performance.engagementRate' }
          }
        }
      }
    ]);

    res.json({
      postingTimeAnalysis,
      hashtagPerformance,
      contentLengthAnalysis
    });
  } catch (error) {
    console.error('Error fetching audience insights:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get competitor analysis
router.get('/competitors', auth, async (req, res) => {
  try {
    const { brandId } = req.query;
    
    if (!brandId) {
      return res.status(400).json({ message: 'Brand ID is required' });
    }

    const brand = await Brand.findOne({ _id: brandId, userId: req.userId });
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // For now, return mock competitor data
    // In a real implementation, you'd integrate with social media APIs
    const competitorData = brand.competitors.map(competitor => ({
      name: competitor.name,
      website: competitor.website,
      socialHandles: competitor.socialHandles,
      estimatedFollowers: Math.floor(Math.random() * 100000) + 10000,
      estimatedEngagementRate: (Math.random() * 5 + 1).toFixed(2),
      contentFrequency: Math.floor(Math.random() * 10) + 1,
      topContentTypes: ['post', 'story', 'reel'].slice(0, Math.floor(Math.random() * 3) + 1),
      strengths: competitor.strengths,
      weaknesses: competitor.weaknesses
    }));

    res.json({
      competitors: competitorData,
      insights: [
        'Your engagement rate is 15% higher than the industry average',
        'Competitors are posting 2x more video content',
        'Your brand voice is more consistent than 80% of competitors',
        'Consider increasing posting frequency on weekends'
      ]
    });
  } catch (error) {
    console.error('Error fetching competitor analysis:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export analytics data
router.get('/export', auth, async (req, res) => {
  try {
    const { brandId, format = 'json', timeframe = '30d' } = req.query;
    
    const filter = { userId: req.userId, isArchived: false };
    if (brandId) filter.brandId = brandId;

    // Calculate date range
    const now = new Date();
    const daysAgo = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    filter.createdAt = { $gte: startDate };

    const exportData = await Content.find(filter)
      .populate('brandId', 'name industry')
      .select('title platform type content performance scheduling createdAt')
      .sort({ createdAt: -1 });

    if (format === 'csv') {
      // Convert to CSV format
      const csvHeaders = 'Title,Platform,Type,Caption,Impressions,Reach,Likes,Comments,Shares,Engagement Rate,Created At\n';
      const csvData = exportData.map(item => 
        `"${item.title}","${item.platform}","${item.type}","${item.content.caption.replace(/"/g, '""')}",${item.performance.impressions},${item.performance.reach},${item.performance.engagement.likes},${item.performance.engagement.comments},${item.performance.engagement.shares},${item.performance.engagementRate},"${item.createdAt}"`
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics-export.csv');
      res.send(csvHeaders + csvData);
    } else {
      res.json({
        exportDate: new Date(),
        timeframe,
        totalRecords: exportData.length,
        data: exportData
      });
    }
  } catch (error) {
    console.error('Error exporting analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;