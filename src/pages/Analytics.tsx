import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  Eye, 
  Heart, 
  Share2,
  Users,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useBrandStore } from '../store/brandStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

interface AnalyticsOverview {
  totalContent: number;
  totalImpressions: number;
  totalReach: number;
  totalEngagement: number;
  avgEngagementRate: number;
}

interface PlatformMetric {
  _id: string;
  contentCount: number;
  impressions: number;
  reach: number;
  engagement: number;
  avgEngagementRate: number;
}

interface ContentTypeMetric {
  _id: string;
  count: number;
  avgEngagementRate: number;
  totalImpressions: number;
}

interface TopContent {
  _id: string;
  title: string;
  platform: string;
  type: string;
  performance: {
    engagementRate: number;
    impressions: number;
    engagement: {
      likes: number;
      comments: number;
      shares: number;
    };
  };
  createdAt: string;
}

const Analytics: React.FC = () => {
  const { currentBrand } = useBrandStore();
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetric[]>([]);
  const [contentTypeMetrics, setContentTypeMetrics] = useState<ContentTypeMetric[]>([]);
  const [topContent, setTopContent] = useState<TopContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  useEffect(() => {
    if (currentBrand) {
      fetchAnalytics();
    }
  }, [currentBrand, timeframe, selectedPlatform]);

  const fetchAnalytics = async () => {
    if (!currentBrand) return;

    setIsLoading(true);
    try {
      const response = await api.get('/analytics/dashboard', {
        params: {
          brandId: currentBrand.id,
          timeframe,
          platform: selectedPlatform !== 'all' ? selectedPlatform : undefined
        }
      });

      const { overview: overviewData, platformMetrics: platforms, contentTypeMetrics: contentTypes, topContent: top } = response.data;
      setOverview(overviewData);
      setPlatformMetrics(platforms);
      setContentTypeMetrics(contentTypes);
      setTopContent(top);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = 'blue',
    format = 'number'
  }: {
    title: string;
    value: number;
    change?: number;
    icon: any;
    color?: string;
    format?: 'number' | 'percentage';
  }) => {
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      pink: 'text-pink-600 bg-pink-100',
      orange: 'text-orange-600 bg-orange-100'
    };

    return (
      <Card hover className="relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {format === 'percentage' ? `${value.toFixed(1)}%` : formatNumber(value)}
            </p>
            {change !== undefined && (
              <div className={`flex items-center mt-2 text-sm ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(change).toFixed(1)}% vs last period</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </Card>
    );
  };

  const PlatformChart = () => {
    const totalImpressions = platformMetrics.reduce((sum, platform) => sum + platform.impressions, 0);
    
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Platform Performance</h2>
          <PieChart className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {platformMetrics.map((platform, index) => {
            const percentage = totalImpressions > 0 ? (platform.impressions / totalImpressions) * 100 : 0;
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];
            
            return (
              <div key={platform._id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                    <span className="font-medium text-gray-900 capitalize">{platform._id}</span>
                  </div>
                  <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-2 rounded-full ${colors[index % colors.length]}`}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatNumber(platform.impressions)} impressions</span>
                  <span>{platform.avgEngagementRate.toFixed(1)}% engagement</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  const ContentTypeChart = () => {
    const maxCount = Math.max(...contentTypeMetrics.map(type => type.count));
    
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Content Type Performance</h2>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {contentTypeMetrics.map((type, index) => {
            const percentage = maxCount > 0 ? (type.count / maxCount) * 100 : 0;
            const colors = ['bg-indigo-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
            
            return (
              <div key={type._id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 capitalize">{type._id}</span>
                  <span className="text-sm text-gray-600">{type.count} posts</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-3 rounded-full ${colors[index % colors.length]}`}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{type.avgEngagementRate.toFixed(1)}% avg engagement</span>
                  <span>{formatNumber(type.totalImpressions)} impressions</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  const TopContentTable = () => (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Top Performing Content</h2>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Content</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Platform</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Impressions</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Engagement</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Rate</th>
            </tr>
          </thead>
          <tbody>
            {topContent.slice(0, 10).map((content, index) => (
              <tr key={content._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900 line-clamp-1">{content.title}</p>
                    <p className="text-sm text-gray-500 capitalize">{content.type}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 capitalize">
                    {content.platform}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {formatNumber(content.performance.impressions)}
                </td>
                <td className="py-3 px-4 text-gray-900">
                  {formatNumber(
                    content.performance.engagement.likes + 
                    content.performance.engagement.comments + 
                    content.performance.engagement.shares
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <span className="text-gray-900 font-medium">
                      {content.performance.engagementRate.toFixed(1)}%
                    </span>
                    {index < 3 && (
                      <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  if (!currentBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <BarChart3 className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Brand Selected</h3>
        <p className="text-gray-500 text-center">
          Please select a brand to view analytics data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600">Track your content performance and audience engagement</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
          </select>
          
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <Button variant="outline" icon={<Download className="h-4 w-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Impressions"
          value={overview?.totalImpressions || 0}
          change={12.5}
          icon={Eye}
          color="blue"
        />
        <MetricCard
          title="Total Reach"
          value={overview?.totalReach || 0}
          change={8.3}
          icon={Users}
          color="green"
        />
        <MetricCard
          title="Total Engagement"
          value={overview?.totalEngagement || 0}
          change={15.7}
          icon={Heart}
          color="pink"
        />
        <MetricCard
          title="Engagement Rate"
          value={overview?.avgEngagementRate || 0}
          change={-2.1}
          icon={TrendingUp}
          color="purple"
          format="percentage"
        />
        <MetricCard
          title="Content Published"
          value={overview?.totalContent || 0}
          change={25.0}
          icon={BarChart3}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformChart />
        <ContentTypeChart />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopContentTable />
        </div>
        
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Engagement Growing</h3>
                  <p className="text-sm text-blue-700">Your engagement rate increased by 15.7% this month</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-900">Best Posting Time</h3>
                  <p className="text-sm text-green-700">9:00 AM - 11:00 AM shows highest engagement</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Share2 className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-purple-900">Top Content Type</h3>
                  <p className="text-sm text-purple-700">Video content performs 40% better than images</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-orange-900">Audience Growth</h3>
                  <p className="text-sm text-orange-700">Gained 1,234 new followers this month</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Recommendations</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Post more video content for higher engagement</li>
              <li>• Schedule posts between 9-11 AM for best reach</li>
              <li>• Use trending hashtags to increase visibility</li>
              <li>• Engage with comments within first hour</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;