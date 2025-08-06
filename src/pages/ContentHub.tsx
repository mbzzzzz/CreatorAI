import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  Share2,
  Copy,
  MoreHorizontal,
  Sparkles,
  Image,
  Video,
  FileText
} from 'lucide-react';
import { useBrandStore } from '../store/brandStore';
import ContentGenerator from '../components/content/ContentGenerator';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import api from '../services/api';
import toast from 'react-hot-toast';

interface ContentItem {
  _id: string;
  title: string;
  platform: string;
  type: string;
  content: {
    caption: string;
    hashtags: string[];
  };
  scheduling: {
    status: 'draft' | 'scheduled' | 'published' | 'failed';
    scheduledFor?: string;
    publishedAt?: string;
  };
  performance: {
    impressions: number;
    engagementRate: number;
    engagement: {
      likes: number;
      comments: number;
      shares: number;
    };
  };
  createdAt: string;
  brandId: {
    name: string;
  };
}

const ContentHub: React.FC = () => {
  const { currentBrand } = useBrandStore();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);

  useEffect(() => {
    if (currentBrand) {
      fetchContent();
    }
  }, [currentBrand, filterStatus, filterPlatform]);

  const fetchContent = async () => {
    if (!currentBrand) return;

    setIsLoading(true);
    try {
      const params: any = { brandId: currentBrand.id };
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterPlatform !== 'all') params.platform = filterPlatform;

      const response = await api.get('/content', { params });
      setContent(response.data.content || []);
    } catch (error: any) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.caption.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteContent = async (contentId: string) => {
    try {
      await api.delete(`/content/${contentId}`);
      setContent(content.filter(item => item._id !== contentId));
      toast.success('Content deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete content');
    }
  };

  const handleDuplicateContent = async (contentItem: ContentItem) => {
    try {
      const duplicateData = {
        title: `${contentItem.title} (Copy)`,
        platform: contentItem.platform,
        type: contentItem.type,
        content: contentItem.content,
        brandId: currentBrand?.id
      };

      const response = await api.post('/content', duplicateData);
      setContent([response.data, ...content]);
      toast.success('Content duplicated successfully');
    } catch (error: any) {
      toast.error('Failed to duplicate content');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      instagram: '📸',
      linkedin: '💼',
      twitter: '🐦',
      facebook: '👥',
      youtube: '📺',
      tiktok: '🎵'
    };
    return icons[platform] || '📱';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
      case 'reel': return <Video className="h-4 w-4" />;
      case 'image':
      case 'post': return <Image className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const ContentCard = ({ item }: { item: ContentItem }) => (
    <Card hover className="group">
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
        <div className="text-4xl opacity-50">
          {getPlatformIcon(item.platform)}
        </div>
        <div className="absolute top-2 right-2 flex space-x-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.scheduling.status)}`}>
            {item.scheduling.status}
          </span>
        </div>
        <div className="absolute bottom-2 left-2 flex items-center space-x-1 text-xs text-gray-600 bg-white bg-opacity-90 px-2 py-1 rounded-full">
          {getTypeIcon(item.type)}
          <span className="capitalize">{item.type}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.content.caption}</p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="capitalize">{item.platform}</span>
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>

        {item.scheduling.status === 'published' && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {item.performance.impressions.toLocaleString()}
            </span>
            <span>{item.performance.engagementRate.toFixed(1)}% engagement</span>
          </div>
        )}

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="outline"
            icon={<Eye className="h-3 w-3" />}
            onClick={() => {
              setSelectedContent(item);
              setShowContentModal(true);
            }}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={<Edit3 className="h-3 w-3" />}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={<Copy className="h-3 w-3" />}
            onClick={() => handleDuplicateContent(item)}
          >
            Duplicate
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={<MoreHorizontal className="h-3 w-3" />}
          >
          </Button>
        </div>
      </div>
    </Card>
  );

  const ContentListItem = ({ item }: { item: ContentItem }) => (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{getPlatformIcon(item.platform)}</span>
            {getTypeIcon(item.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
            <p className="text-sm text-gray-600 truncate">{item.content.caption}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.scheduling.status)}`}>
            {item.scheduling.status}
          </span>
          
          {item.scheduling.status === 'published' && (
            <div className="text-sm text-gray-500">
              {item.performance.engagementRate.toFixed(1)}% engagement
            </div>
          )}
          
          <span className="text-sm text-gray-500">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
          
          <div className="flex items-center space-x-1">
            <Button size="sm" variant="ghost" icon={<Eye className="h-3 w-3" />} />
            <Button size="sm" variant="ghost" icon={<Edit3 className="h-3 w-3" />} />
            <Button size="sm" variant="ghost" icon={<Trash2 className="h-3 w-3" />} />
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Hub</h1>
          <p className="text-gray-600">Create, manage, and optimize your content</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon={<Calendar className="h-4 w-4" />}
          >
            Schedule
          </Button>
          <Button
            icon={<Sparkles className="h-4 w-4" />}
            onClick={() => setShowGenerator(true)}
          >
            Generate Content
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
              className="w-64"
            />
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="failed">Failed</option>
            </select>
            
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
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
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              icon={<Grid3X3 className="h-4 w-4" />}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              icon={<List className="h-4 w-4" />}
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>
      </Card>

      {/* Content Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredContent.length === 0 ? (
        <Card className="text-center py-12">
          <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterStatus !== 'all' || filterPlatform !== 'all'
              ? 'Try adjusting your filters or search query.'
              : 'Start creating amazing content with AI assistance.'}
          </p>
          <Button
            icon={<Sparkles className="h-4 w-4" />}
            onClick={() => setShowGenerator(true)}
          >
            Generate Your First Content
          </Button>
        </Card>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredContent.map((item) => (
                <ContentCard key={item._id} item={item} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredContent.map((item) => (
                <ContentListItem key={item._id} item={item} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Content Generator Modal */}
      <Modal
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
        title="AI Content Generator"
        size="xl"
      >
        <ContentGenerator />
      </Modal>

      {/* Content Detail Modal */}
      <Modal
        isOpen={showContentModal}
        onClose={() => {
          setShowContentModal(false);
          setSelectedContent(null);
        }}
        title={selectedContent?.title}
        size="lg"
      >
        {selectedContent && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getPlatformIcon(selectedContent.platform)}</span>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{selectedContent.platform}</p>
                  <p className="text-sm text-gray-500 capitalize">{selectedContent.type}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedContent.scheduling.status)}`}>
                {selectedContent.scheduling.status}
              </span>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Caption</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="whitespace-pre-wrap">{selectedContent.content.caption}</p>
              </div>
            </div>

            {selectedContent.content.hashtags.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Hashtags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedContent.content.hashtags.map((hashtag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedContent.scheduling.status === 'published' && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Impressions</p>
                    <p className="text-lg font-semibold">{selectedContent.performance.impressions.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Engagement Rate</p>
                    <p className="text-lg font-semibold">{selectedContent.performance.engagementRate.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Likes</p>
                    <p className="text-lg font-semibold">{selectedContent.performance.engagement.likes.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Comments</p>
                    <p className="text-lg font-semibold">{selectedContent.performance.engagement.comments.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <Button icon={<Edit3 className="h-4 w-4" />}>
                Edit Content
              </Button>
              <Button variant="outline" icon={<Copy className="h-4 w-4" />}>
                Duplicate
              </Button>
              <Button variant="outline" icon={<Share2 className="h-4 w-4" />}>
                Share
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContentHub;