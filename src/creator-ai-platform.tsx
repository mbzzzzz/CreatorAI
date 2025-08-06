import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  BarChart3, 
  Settings, 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  Image, 
  Video, 
  MessageSquare,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Plus,
  Edit3,
  Send,
  Eye,
  Heart,
  Share2,
  Play,
  Clock,
  CheckCircle,
  Sparkles,
  Camera,
  Mic,
  FileText,
  BarChart,
  Globe
} from 'lucide-react';

const CreatorAI = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [brandData, setBrandData] = useState({
    name: 'TechFlow Solutions',
    industry: 'SaaS Technology',
    tone: 'Professional yet approachable',
    targetAudience: 'Tech professionals, startups, SMBs',
    colors: ['#2563eb', '#1e40af', '#3b82f6'],
    keywords: ['innovation', 'efficiency', 'growth', 'technology']
  });

  const [contentIdeas, setContentIdeas] = useState([
    {
      id: 1,
      platform: 'LinkedIn',
      type: 'Post',
      title: '5 Ways AI is Transforming Business Operations',
      caption: 'The future of business is here! 🚀 AI isn\'t just a buzzword anymore - it\'s revolutionizing how we work. Here are 5 game-changing ways AI is transforming operations...',
      engagement: 85,
      status: 'draft',
      scheduledFor: '2024-08-05 09:00',
      imagePrompt: 'Modern office with AI holographic displays'
    },
    {
      id: 2,
      platform: 'Instagram',
      type: 'Reel',
      title: 'Day in the Life: Tech Startup',
      caption: 'Behind the scenes at a growing tech startup 💼✨ From morning standup to product launches #TechLife #Startup',
      engagement: 92,
      status: 'scheduled',
      scheduledFor: '2024-08-05 14:30',
      imagePrompt: 'Dynamic startup office environment'
    },
    {
      id: 3,
      platform: 'Twitter',
      type: 'Thread',
      title: 'The SaaS Metrics That Actually Matter',
      caption: '🧵 Thread: Everyone talks about vanity metrics, but here are the SaaS metrics that actually predict success...',
      engagement: 78,
      status: 'published',
      scheduledFor: '2024-08-04 16:00',
      imagePrompt: 'Clean infographic with SaaS metrics'
    }
  ]);

  const [analytics, setAnalytics] = useState({
    totalReach: 145600,
    engagement: 12.3,
    followers: 8945,
    weeklyGrowth: 8.7,
    topPerforming: 'LinkedIn Posts',
    contentTypes: {
      'Video': 35,
      'Image': 28,
      'Carousel': 22,
      'Text': 15
    }
  });

  const platforms = [
    { name: 'Instagram', icon: Instagram, color: 'text-pink-500', connected: true },
    { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600', connected: true },
    { name: 'Twitter', icon: Twitter, color: 'text-blue-400', connected: true },
    { name: 'Facebook', icon: Facebook, color: 'text-blue-700', connected: false },
    { name: 'YouTube', icon: Youtube, color: 'text-red-600', connected: true },
    { name: 'TikTok', icon: Video, color: 'text-black', connected: false }
  ];

  const generateContent = (platform, contentType) => {
    const templates = {
      'LinkedIn': {
        'Post': [
          'Industry insights that drive engagement',
          'Leadership lessons from successful startups',
          'Technology trends shaping the future',
          'Behind-the-scenes company culture'
        ],
        'Article': [
          'Deep dive into industry analysis',
          'Thought leadership piece',
          'Case study breakdown',
          'Expert interview summary'
        ]
      },
      'Instagram': {
        'Post': [
          'Visual storytelling with brand message',
          'Product showcase with lifestyle context',
          'Team spotlight and company culture',
          'Customer success story highlight'
        ],
        'Reel': [
          'Quick tips and tutorials',
          'Day-in-the-life content',
          'Before/after transformations',
          'Trending audio with brand twist'
        ]
      },
      'Twitter': {
        'Tweet': [
          'Industry hot takes and opinions',
          'Real-time news commentary',
          'Quick tips and insights',
          'Community engagement questions'
        ],
        'Thread': [
          'Step-by-step tutorials',
          'Industry analysis breakdown',
          'Personal experience stories',
          'Curated resource lists'
        ]
      }
    };

    const platformTemplates = templates[platform] || {};
    const typeTemplates = platformTemplates[contentType] || ['Generic content idea'];
    return typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
  };

  const ContentCard = ({ content }) => {
    const platformIcons = {
      'LinkedIn': Linkedin,
      'Instagram': Instagram,
      'Twitter': Twitter,
      'Facebook': Facebook,
      'YouTube': Youtube
    };
    
    const PlatformIcon = platformIcons[content.platform] || MessageSquare;
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <PlatformIcon className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">{content.title}</h3>
              <p className="text-sm text-gray-500">{content.platform} • {content.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              content.status === 'published' ? 'bg-green-100 text-green-800' :
              content.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {content.status}
            </span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-3">{content.caption}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {content.engagement}% engagement
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {content.scheduledFor}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Eye className="h-4 w-4" />
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reach</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalReach.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">+{analytics.weeklyGrowth}% from last week</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.engagement}%</p>
            </div>
            <Heart className="h-8 w-8 text-pink-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">Above industry average</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Followers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.followers.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">Growing steadily</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Platform</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.topPerforming}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-sm text-blue-600 mt-2">Best performing content</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setActiveTab('content')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <Sparkles className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
            <p className="text-sm font-medium">Generate Content</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium">Schedule Posts</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <BarChart className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium">View Analytics</p>
          </button>
          <button 
            onClick={() => setActiveTab('brand')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <Target className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium">Brand Settings</p>
          </button>
        </div>
      </div>

      {/* Recent Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Content</h2>
          <button 
            onClick={() => setActiveTab('content')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all →
          </button>
        </div>
        <div className="grid gap-4">
          {contentIdeas.slice(0, 2).map(content => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Content Hub</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Generate New Content
        </button>
      </div>

      {/* Content Generation Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Content Generator</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
            <select className="w-full p-3 border border-gray-300 rounded-md">
              <option>LinkedIn</option>
              <option>Instagram</option>
              <option>Twitter</option>
              <option>Facebook</option>
              <option>YouTube</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
            <select className="w-full p-3 border border-gray-300 rounded-md">
              <option>Post</option>
              <option>Story</option>
              <option>Reel/Video</option>
              <option>Article</option>
              <option>Thread</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic/Theme</label>
            <input 
              type="text" 
              placeholder="e.g., Product launch, Industry insights"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
            <FileText className="h-6 w-6 mr-2 text-gray-400" />
            <span className="text-gray-600">Generate Caption</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
            <Camera className="h-6 w-6 mr-2 text-gray-400" />
            <span className="text-gray-600">Create Image Concept</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
            <Video className="h-6 w-6 mr-2 text-gray-400" />
            <span className="text-gray-600">Video Script</span>
          </button>
        </div>
      </div>

      {/* Content Library */}
      <div className="grid gap-6">
        {contentIdeas.map(content => (
          <ContentCard key={content.id} content={content} />
        ))}
      </div>
    </div>
  );

  const renderBrand = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Brand Intelligence</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Brand Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
              <input 
                type="text" 
                value={brandData.name}
                onChange={(e) => setBrandData({...brandData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <input 
                type="text" 
                value={brandData.industry}
                onChange={(e) => setBrandData({...brandData, industry: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand Tone</label>
              <textarea 
                value={brandData.tone}
                onChange={(e) => setBrandData({...brandData, tone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <textarea 
                value={brandData.targetAudience}
                onChange={(e) => setBrandData({...brandData, targetAudience: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md h-24"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Brand Colors</h2>
            <div className="flex space-x-3">
              {brandData.colors.map((color, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="w-16 h-16 rounded-lg border border-gray-200 mb-2"
                    style={{ backgroundColor: color }}
                  ></div>
                  <p className="text-xs text-gray-600">{color}</p>
                </div>
              ))}
              <button className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-400 transition-colors">
                <Plus className="h-6 w-6 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Brand Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {brandData.keywords.map((keyword, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
              <button className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                + Add keyword
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Connected Platforms</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div key={platform.name} className="text-center p-4 border border-gray-200 rounded-lg">
                <Icon className={`h-8 w-8 mx-auto mb-2 ${platform.color}`} />
                <p className="text-sm font-medium text-gray-900">{platform.name}</p>
                <div className="mt-2">
                  {platform.connected ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </span>
                  ) : (
                    <button className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors">
                      <Plus className="h-3 w-3 mr-1" />
                      Connect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Post
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-700 p-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-4">
          {Array.from({length: 35}, (_, i) => {
            const dayNumber = (i % 31) + 1;
            const hasContent = Math.random() > 0.7;
            return (
              <div key={i} className="aspect-square border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors">
                <div className="text-sm text-gray-600 mb-1">{dayNumber}</div>
                {hasContent && (
                  <div className="space-y-1">
                    <div className="w-full h-2 bg-blue-200 rounded-full"></div>
                    <div className="w-2/3 h-2 bg-green-200 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Posts</h2>
        <div className="space-y-4">
          {contentIdeas.filter(c => c.status === 'scheduled').map(content => (
            <div key={content.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900">{content.title}</h3>
                  <p className="text-sm text-gray-500">{content.platform} • {content.scheduledFor}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  Edit
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Post Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Impressions</h3>
            <Eye className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">2.4M</p>
          <p className="text-sm text-green-600">+15.3% vs last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Engagement</h3>
            <Heart className="h-6 w-6 text-pink-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">156K</p>
          <p className="text-sm text-green-600">+22.1% vs last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Shares</h3>
            <Share2 className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">12.8K</p>
          <p className="text-sm text-green-600">+8.7% vs last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Conversion</h3>
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">3.2%</p>
          <p className="text-sm text-green-600">+0.8% vs last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h2>
          <div className="space-y-4">
            {platforms.filter(p => p.connected).map(platform => {
              const Icon = platform.icon;
              return (
                <div key={platform.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${platform.color}`} />
                    <span className="font-medium text-gray-900">{platform.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{Math.floor(Math.random() * 50 + 20)}%</p>
                    <p className="text-sm text-gray-500">engagement</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Performance</h2>
          <div className="space-y-4">
            {Object.entries(analytics.contentTypes).map(([type, percentage]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-gray-700">{type}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h2>
        <div className="space-y-4">
          {contentIdeas.map(content => (
            <div key={content.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{content.title}</h3>
                <p className="text-sm text-gray-500">{content.platform} • {content.scheduledFor}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">{content.engagement}%</p>
                <p className="text-sm text-gray-500">engagement</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Zap className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">CreatorAI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">AI</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <div className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'content', label: 'Content Hub', icon: Sparkles },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'brand', label: 'Brand Intelligence', icon: Target },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'content' && renderContent()}
          {activeTab === 'calendar' && renderCalendar()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'brand' && renderBrand()}
        </main>
      </div>
    </div>
  );