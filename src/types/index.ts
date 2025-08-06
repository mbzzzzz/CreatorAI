export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
    expiresAt: string;
  };
  usage: {
    contentGenerated: number;
    postsScheduled: number;
    aiCallsThisMonth: number;
    lastResetDate: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
}

export interface Brand {
  id: string;
  userId: string;
  name: string;
  industry: string;
  description?: string;
  website?: string;
  targetAudience: {
    demographics: {
      ageRange: { min: number; max: number };
      gender: 'male' | 'female' | 'all';
      location: string[];
      interests: string[];
    };
    psychographics: {
      values: string[];
      lifestyle: string[];
      painPoints: string[];
    };
  };
  brandVoice: {
    tone: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'playful' | 'inspirational';
    personality: string[];
    doNotUse: string[];
    keyMessages: string[];
  };
  visualIdentity: {
    logo?: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string[];
    };
    fonts: {
      primary: string;
      secondary?: string;
    };
  };
  socialAccounts: {
    [key: string]: {
      connected: boolean;
      username?: string;
      accessToken?: string;
      refreshToken?: string;
    };
  };
  competitors: Array<{
    name: string;
    website: string;
    socialHandles: Record<string, string>;
    strengths: string[];
    weaknesses: string[];
  }>;
  contentGuidelines: {
    preferredContentTypes: string[];
    postingFrequency: Record<string, number>;
    hashtagStrategy: {
      branded: string[];
      industry: string[];
      trending: string[];
    };
    contentPillars: string[];
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  id: string;
  userId: string;
  brandId: string;
  title: string;
  type: 'post' | 'story' | 'reel' | 'video' | 'article' | 'thread' | 'carousel';
  platform: 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'youtube' | 'tiktok' | 'all';
  content: {
    caption: string;
    hashtags: string[];
    mentions: string[];
    cta?: string;
  };
  media: {
    images: Array<{
      url: string;
      alt: string;
      cloudinaryId?: string;
    }>;
    videos: Array<{
      url: string;
      thumbnail: string;
      duration: number;
      cloudinaryId?: string;
    }>;
    aiPrompts: Array<{
      type: string;
      prompt: string;
      generated: boolean;
    }>;
  };
  scheduling: {
    status: 'draft' | 'scheduled' | 'published' | 'failed';
    scheduledFor?: string;
    publishedAt?: string;
    timezone: string;
  };
  performance: {
    impressions: number;
    reach: number;
    engagement: {
      likes: number;
      comments: number;
      shares: number;
      saves: number;
      clicks: number;
    };
    engagementRate: number;
    lastUpdated?: string;
  };
  aiGenerated: {
    isAiGenerated: boolean;
    model?: string;
    prompt?: string;
    confidence?: number;
    iterations: number;
  };
  campaign?: {
    id: string;
    name: string;
  };
  tags: string[];
  notes?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AIUsage {
  current: number;
  limit: number;
  percentage: number;
  plan: string;
  resetDate: string;
}

export interface GeneratedContent {
  caption: string;
  hashtags: string[];
  cta?: string;
  fullResponse: string;
}

export interface Platform {
  id: string;
  name: string;
  icon: any;
  color: string;
  connected: boolean;
  username?: string;
}

export interface AnalyticsData {
  totalReach: number;
  engagement: number;
  followers: number;
  weeklyGrowth: number;
  topPerforming: string;
  contentTypes: Record<string, number>;
}