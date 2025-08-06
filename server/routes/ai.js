const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Brand = require('../models/Brand');

const router = express.Router();

const AI_MODELS = {
  content: 'anthropic/claude-3.5-sonnet',
  creative: 'openai/gpt-4-turbo',
  analysis: 'meta-llama/llama-3.1-70b-instruct'
};

const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_API_KEY;

// Usage limits by plan
const USAGE_LIMITS = {
  free: 50,
  pro: 500,
  enterprise: -1 // unlimited
};

// Check usage limits middleware
const checkUsageLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const limit = USAGE_LIMITS[user.subscription.plan];
    
    if (limit !== -1 && user.usage.aiCallsThisMonth >= limit) {
      return res.status(429).json({ 
        message: 'AI usage limit exceeded for your plan',
        currentUsage: user.usage.aiCallsThisMonth,
        limit: limit
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking usage limits' });
  }
};

// Generate content caption
router.post('/generate-caption', auth, checkUsageLimit, async (req, res) => {
  try {
    const { brandId, platform, contentType, topic, tone, targetAudience } = req.body;

    // Get brand information
    const brand = await Brand.findOne({ _id: brandId, userId: req.userId });
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Construct AI prompt
    const systemPrompt = `You are an expert social media content creator specializing in ${platform} content. 
    Create engaging, platform-optimized content that drives engagement and conversions.
    
    Brand Information:
    - Name: ${brand.name}
    - Industry: ${brand.industry}
    - Brand Voice: ${brand.brandVoice.tone}
    - Target Audience: ${targetAudience || 'General audience'}
    - Key Messages: ${brand.brandVoice.keyMessages?.join(', ') || 'Not specified'}
    
    Platform: ${platform}
    Content Type: ${contentType}
    Topic: ${topic}
    Tone: ${tone}
    
    Requirements:
    - Create a compelling caption that matches the brand voice
    - Include relevant hashtags (5-10 for Instagram, 2-5 for LinkedIn, 1-3 for Twitter)
    - Add a clear call-to-action
    - Optimize for ${platform} best practices
    - Keep within platform character limits
    - Make it engaging and shareable`;

    const userPrompt = `Create a ${contentType} caption for ${platform} about: ${topic}`;

    // Call OpenRouter API
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: AI_MODELS.content,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'CreatorAI'
      }
    });

    // Update user usage
    req.user.usage.aiCallsThisMonth += 1;
    req.user.usage.contentGenerated += 1;
    await req.user.save();

    const generatedContent = response.data.choices[0].message.content;

    // Parse the response to extract caption, hashtags, and CTA
    const lines = generatedContent.split('\n').filter(line => line.trim());
    let caption = '';
    let hashtags = [];
    let cta = '';

    for (const line of lines) {
      if (line.includes('#')) {
        hashtags = line.match(/#\w+/g) || [];
      } else if (line.toLowerCase().includes('call to action') || line.toLowerCase().includes('cta')) {
        cta = line.replace(/call to action:?/i, '').replace(/cta:?/i, '').trim();
      } else if (line.trim() && !caption) {
        caption = line.trim();
      } else if (caption && !line.includes('#') && !line.toLowerCase().includes('cta')) {
        caption += '\n' + line.trim();
      }
    }

    res.json({
      success: true,
      content: {
        caption: caption || generatedContent,
        hashtags: hashtags,
        cta: cta,
        fullResponse: generatedContent
      },
      usage: {
        current: req.user.usage.aiCallsThisMonth,
        limit: USAGE_LIMITS[req.user.subscription.plan]
      }
    });

  } catch (error) {
    console.error('AI generation error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error generating content',
      error: error.response?.data?.error || error.message
    });
  }
});

// Generate image concept
router.post('/generate-image-concept', auth, checkUsageLimit, async (req, res) => {
  try {
    const { brandId, topic, style, mood, platform } = req.body;

    const brand = await Brand.findOne({ _id: brandId, userId: req.userId });
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    const systemPrompt = `You are a creative director specializing in visual content for social media.
    Create detailed, actionable image concepts that align with brand identity and platform requirements.
    
    Brand Information:
    - Name: ${brand.name}
    - Industry: ${brand.industry}
    - Primary Color: ${brand.visualIdentity.colors.primary}
    - Brand Personality: ${brand.brandVoice.personality?.join(', ') || 'Professional'}
    
    Platform: ${platform}
    Topic: ${topic}
    Style: ${style}
    Mood: ${mood}
    
    Create a detailed image concept including:
    1. Main visual elements
    2. Color scheme
    3. Composition and layout
    4. Text overlay suggestions
    5. Props or background elements
    6. Lighting and mood
    7. Platform-specific optimization tips`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: AI_MODELS.creative,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create an image concept for: ${topic}` }
      ],
      temperature: 0.8,
      max_tokens: 800
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'CreatorAI'
      }
    });

    req.user.usage.aiCallsThisMonth += 1;
    await req.user.save();

    res.json({
      success: true,
      concept: response.data.choices[0].message.content,
      usage: {
        current: req.user.usage.aiCallsThisMonth,
        limit: USAGE_LIMITS[req.user.subscription.plan]
      }
    });

  } catch (error) {
    console.error('Image concept generation error:', error);
    res.status(500).json({ message: 'Error generating image concept' });
  }
});

// Generate video script
router.post('/generate-video-script', auth, checkUsageLimit, async (req, res) => {
  try {
    const { brandId, topic, duration, platform, scriptType } = req.body;

    const brand = await Brand.findOne({ _id: brandId, userId: req.userId });
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    const systemPrompt = `You are a video script writer specializing in ${platform} content.
    Create engaging, platform-optimized video scripts that capture attention and drive action.
    
    Brand Information:
    - Name: ${brand.name}
    - Industry: ${brand.industry}
    - Brand Voice: ${brand.brandVoice.tone}
    - Key Messages: ${brand.brandVoice.keyMessages?.join(', ') || 'Not specified'}
    
    Platform: ${platform}
    Duration: ${duration} seconds
    Script Type: ${scriptType}
    Topic: ${topic}
    
    Create a detailed script including:
    1. Hook (first 3 seconds)
    2. Main content structure
    3. Visual cues and directions
    4. Call-to-action
    5. Text overlays
    6. Music/sound suggestions
    7. Platform-specific optimization tips`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: AI_MODELS.creative,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create a ${duration}-second video script about: ${topic}` }
      ],
      temperature: 0.7,
      max_tokens: 1200
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'CreatorAI'
      }
    });

    req.user.usage.aiCallsThisMonth += 1;
    await req.user.save();

    res.json({
      success: true,
      script: response.data.choices[0].message.content,
      usage: {
        current: req.user.usage.aiCallsThisMonth,
        limit: USAGE_LIMITS[req.user.subscription.plan]
      }
    });

  } catch (error) {
    console.error('Video script generation error:', error);
    res.status(500).json({ message: 'Error generating video script' });
  }
});

// Analyze content performance
router.post('/analyze-performance', auth, checkUsageLimit, async (req, res) => {
  try {
    const { contentData, timeframe } = req.body;

    const systemPrompt = `You are a social media analytics expert. Analyze the provided content performance data and provide actionable insights.
    
    Analyze the following metrics and provide:
    1. Performance summary
    2. Top performing content types
    3. Engagement patterns
    4. Audience insights
    5. Recommendations for improvement
    6. Content strategy suggestions
    7. Optimal posting times
    8. Hashtag performance analysis
    
    Be specific and actionable in your recommendations.`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: AI_MODELS.analysis,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this content performance data: ${JSON.stringify(contentData)}` }
      ],
      temperature: 0.3,
      max_tokens: 1500
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'CreatorAI'
      }
    });

    req.user.usage.aiCallsThisMonth += 1;
    await req.user.save();

    res.json({
      success: true,
      analysis: response.data.choices[0].message.content,
      usage: {
        current: req.user.usage.aiCallsThisMonth,
        limit: USAGE_LIMITS[req.user.subscription.plan]
      }
    });

  } catch (error) {
    console.error('Performance analysis error:', error);
    res.status(500).json({ message: 'Error analyzing performance' });
  }
});

// Get usage statistics
router.get('/usage', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const limit = USAGE_LIMITS[user.subscription.plan];

    res.json({
      current: user.usage.aiCallsThisMonth,
      limit: limit,
      percentage: limit === -1 ? 0 : (user.usage.aiCallsThisMonth / limit) * 100,
      plan: user.subscription.plan,
      resetDate: new Date(user.usage.lastResetDate.getFullYear(), user.usage.lastResetDate.getMonth() + 1, 1)
    });
  } catch (error) {
    console.error('Usage stats error:', error);
    res.status(500).json({ message: 'Error fetching usage statistics' });
  }
});

module.exports = router;