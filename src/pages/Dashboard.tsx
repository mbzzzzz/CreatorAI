import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  Share2,
  Calendar,
  Sparkles,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  Plus
} from 'lucide-react';
import { useBrandStore } from '../store/brandStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

interface DashboardMetrics {
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

const Dashboard: React.FC = () => {
  const { currentBrand } = useBrandStore();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetric[]>([]);
  const [topContent, setTopContent] = useState<TopContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    if (currentBrand) {
      fetchDashboardData();
    }
  }, [currentBrand, timeframe]);

  const fetchDashboardData = async () => {
    if (!currentBrand) return;

    setIsLoading(true);
    try {
      const response = await api.get('/analytics/dashboard', {
        params: {
          brandId: currentBrand.id,
          timeframe
        }
      });

      const { overview, platformMetrics: platforms, topContent: top } = response.data;
      setMetrics(overview);
      setPlatformMetrics(platforms);
      setTopContent(top);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
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

  const PlatformCard = ({ platform }: { platform: PlatformMetric }) => {
    const platformIcons = {
      instagram: '📸',
      linkedin: '💼',
      twitter: '🐦',
      facebook: '👥',
      youtube: '📺',
      tiktok: '🎵'
    };

    return (
      <Card hover className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{platformIcons[platform._id as keyof typeof platformIcons] || '📱'}</span>
            <h3 className="font-semibold text-gray-900 capitalize">{platform._id}</h3>
          </div>
          <span className="text-sm text-gray-500">{platform.contentCount} posts</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Impressions</span>
            <span className="font-medium">{formatNumber(platform.impressions)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Engagement</span>
            <span className="font-medium">{formatNumber(platform.engagement)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Avg. Rate</span>
            <span className="font-medium">{platform.avgEngagementRate.toFixed(1)}%</span>
          </div>
        </div>
      </Card>
    );
  };

  const ContentCard = ({ content }: { content: TopContent }) => {
    return (
      <Card hover className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900 line-clamp-2">{content.title}</h4>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2">
            {content.platform}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="capitalize">{content.type}</span>
          <span>{content.performance.engagementRate.toFixed(1)}% engagement</span>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {formatNumber(content.performance.impressions)}
            </span>
            <span className="flex items-center">
              <Heart className="h-3 w-3 mr-1" />
              {formatNumber(content.performance.engagement.likes)}
            </span>
          </div>
          <span>{new Date(content.createdAt).toLocaleDateString()}</span>
        </div>
      </Card>
    );
  };

  if (!currentBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Target className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Brand Selected</h3>
        <p className="text-gray-500 text-center mb-4">
          Please select or create a brand to view your dashboard analytics.
        </p>
        <Button icon={<Plus className="h-4 w-4" />}>
          Create Brand
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with {currentBrand.name} today.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <Button variant="outline" icon={<Calendar className="h-4 w-4" />}>
            Schedule Content
          </Button>
          
          <Button icon={<Sparkles className="h-4 w-4" />}>
            Generate Content
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Impressions"
          value={metrics?.totalImpressions || 0}
          change={12.5}
          icon={Eye}
          color="blue"
        />
        <MetricCard
          title="Total Reach"
          value={metrics?.totalReach || 0}
          change={8.3}
          icon={Users}
          color="green"
        />
        <MetricCard
          title="Total Engagement"
          value={metrics?.totalEngagement || 0}
          change={15.7}
          icon={Heart}
          color="pink"
        />
        <MetricCard
          title="Engagement Rate"
          value={metrics?.avgEngagementRate || 0}
          change={-2.1}
          icon={TrendingUp}
          color="purple"
          format="percentage"
        />
        <MetricCard
          title="Content Created"
          value={metrics?.totalContent || 0}
          change={25.0}
          icon={BarChart3}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <Zap className="h-5 w-5 text-yellow-500" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group"
          >
            <Sparkles className="h-6 w-6 mx-auto mb-2 text-yellow-600 group-hover:text-yellow-700" />
            <p className="text-sm font-medium text-gray-900">Generate Content</p>
            <p className="text-xs text-gray-500">AI-powered creation</p>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group"
          >
            <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600 group-hover:text-blue-700" />
            <p className="text-sm font-medium text-gray-900">Schedule Posts</p>
            <p className="text-xs text-gray-500">Plan your content</p>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group"
          >
            <BarChart3 className="h-6 w-6 mx-auto mb-2 text-green-600 group-hover:text-green-700" />
            <p className="text-sm font-medium text-gray-900">View Analytics</p>
            <p className="text-xs text-gray-500">Track performance</p>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group"
          >
            <Target className="h-6 w-6 mx-auto mb-2 text-purple-600 group-hover:text-purple-700" />
            <p className="text-sm font-medium text-gray-900">Brand Settings</p>
            <p className="text-xs text-gray-500">Manage your brand</p>
          </motion.button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Performance */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Platform Performance</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platformMetrics.map((platform) => (
                <PlatformCard key={platform._id} platform={platform} />
              ))}
            </div>
          </Card>
        </div>

        {/* Top Performing Content */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Content</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {topContent.slice(0, 5).map((content) => (
              <ContentCard key={content._id} content={content} />
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {[
            { action: 'Generated Instagram post', time: '2 minutes ago', status: 'success' },
            { action: 'Scheduled LinkedIn article', time: '15 minutes ago', status: 'scheduled' },
            { action: 'Published Twitter thread', time: '1 hour ago', status: 'published' },
            { action: 'Created video script', time: '2 hours ago', status: 'draft' },
            { action: 'Updated brand guidelines', time: '3 hours ago', status: 'updated' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'scheduled' ? 'bg-blue-500' :
                  activity.status === 'published' ? 'bg-purple-500' :
                  activity.status === 'draft' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`} />
                <span className="text-sm text-gray-900">{activity.action}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;