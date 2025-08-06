import api from './api';
import { GeneratedContent, AIUsage } from '../types';

export interface GenerateContentRequest {
  brandId: string;
  platform: string;
  contentType: string;
  topic: string;
  tone?: string;
  targetAudience?: string;
}

export interface GenerateImageConceptRequest {
  brandId: string;
  topic: string;
  style: string;
  mood: string;
  platform: string;
}

export interface GenerateVideoScriptRequest {
  brandId: string;
  topic: string;
  duration: number;
  platform: string;
  scriptType: string;
}

class AIService {
  async generateCaption(request: GenerateContentRequest): Promise<{
    content: GeneratedContent;
    usage: AIUsage;
  }> {
    try {
      const response = await api.post('/ai/generate-caption', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate caption');
    }
  }

  async generateImageConcept(request: GenerateImageConceptRequest): Promise<{
    concept: string;
    usage: AIUsage;
  }> {
    try {
      const response = await api.post('/ai/generate-image-concept', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate image concept');
    }
  }

  async generateVideoScript(request: GenerateVideoScriptRequest): Promise<{
    script: string;
    usage: AIUsage;
  }> {
    try {
      const response = await api.post('/ai/generate-video-script', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to generate video script');
    }
  }

  async analyzePerformance(contentData: any, timeframe: string): Promise<{
    analysis: string;
    usage: AIUsage;
  }> {
    try {
      const response = await api.post('/ai/analyze-performance', {
        contentData,
        timeframe
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to analyze performance');
    }
  }

  async getUsageStats(): Promise<AIUsage> {
    try {
      const response = await api.get('/ai/usage');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch usage stats');
    }
  }

  // Content optimization suggestions
  async optimizeContent(content: string, platform: string, brandId: string): Promise<{
    suggestions: string[];
    optimizedContent: string;
  }> {
    try {
      const response = await api.post('/ai/optimize-content', {
        content,
        platform,
        brandId
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to optimize content');
    }
  }

  // Hashtag suggestions
  async suggestHashtags(content: string, platform: string, brandId: string): Promise<{
    hashtags: string[];
    trending: string[];
    branded: string[];
  }> {
    try {
      const response = await api.post('/ai/suggest-hashtags', {
        content,
        platform,
        brandId
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to suggest hashtags');
    }
  }

  // Trend analysis
  async analyzeTrends(industry: string, platform: string): Promise<{
    trends: Array<{
      topic: string;
      popularity: number;
      growth: number;
      relevance: number;
    }>;
    recommendations: string[];
  }> {
    try {
      const response = await api.post('/ai/analyze-trends', {
        industry,
        platform
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to analyze trends');
    }
  }
}

export default new AIService();