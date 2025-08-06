import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  Filter,
  Eye,
  Edit3,
  Trash2
} from 'lucide-react';
import { useBrandStore } from '../store/brandStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import api from '../services/api';
import toast from 'react-hot-toast';

interface ScheduledContent {
  _id: string;
  title: string;
  platform: string;
  type: string;
  content: {
    caption: string;
  };
  scheduling: {
    status: string;
    scheduledFor: string;
    timezone: string;
  };
  brandId: {
    name: string;
  };
}

const Calendar: React.FC = () => {
  const { currentBrand } = useBrandStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filterPlatform, setFilterPlatform] = useState('all');

  useEffect(() => {
    if (currentBrand) {
      fetchScheduledContent();
    }
  }, [currentBrand, currentDate]);

  const fetchScheduledContent = async () => {
    if (!currentBrand) return;

    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const response = await api.get('/content', {
        params: {
          brandId: currentBrand.id,
          status: 'scheduled',
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString()
        }
      });

      setScheduledContent(response.data.content || []);
    } catch (error: any) {
      console.error('Error fetching scheduled content:', error);
      toast.error('Failed to load scheduled content');
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getContentForDate = (date: Date) => {
    if (!date) return [];
    
    return scheduledContent.filter(content => {
      const contentDate = new Date(content.scheduling.scheduledFor);
      return (
        contentDate.getDate() === date.getDate() &&
        contentDate.getMonth() === date.getMonth() &&
        contentDate.getFullYear() === date.getFullYear() &&
        (filterPlatform === 'all' || content.platform === filterPlatform)
      );
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
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

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      instagram: 'bg-pink-100 text-pink-800 border-pink-200',
      linkedin: 'bg-blue-100 text-blue-800 border-blue-200',
      twitter: 'bg-sky-100 text-sky-800 border-sky-200',
      facebook: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      youtube: 'bg-red-100 text-red-800 border-red-200',
      tiktok: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[platform] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const ContentItem = ({ content }: { content: ScheduledContent }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-2 rounded-lg border text-xs mb-1 cursor-pointer hover:shadow-sm transition-shadow ${getPlatformColor(content.platform)}`}
      onClick={() => {
        // Handle content click
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium truncate">{content.title}</span>
        <span>{getPlatformIcon(content.platform)}</span>
      </div>
      <div className="flex items-center text-xs opacity-75">
        <Clock className="h-3 w-3 mr-1" />
        {formatTime(content.scheduling.scheduledFor)}
      </div>
    </motion.div>
  );

  const CalendarDay = ({ date, isCurrentMonth = true }: { date: Date | null; isCurrentMonth?: boolean }) => {
    if (!date) {
      return <div className="aspect-square p-2"></div>;
    }

    const dayContent = getContentForDate(date);
    const isToday = new Date().toDateString() === date.toDateString();
    const isSelected = selectedDate?.toDateString() === date.toDateString();

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`aspect-square p-2 border border-gray-200 cursor-pointer transition-colors ${
          isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'
        } ${isToday ? 'bg-blue-50 border-blue-200' : ''} ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => setSelectedDate(date)}
      >
        <div className="h-full flex flex-col">
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
            {date.getDate()}
          </div>
          <div className="flex-1 overflow-y-auto space-y-1">
            {dayContent.slice(0, 3).map((content) => (
              <ContentItem key={content._id} content={content} />
            ))}
            {dayContent.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{dayContent.length - 3} more
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-gray-600">Schedule and manage your content publishing</p>
        </div>
        
        <div className="flex items-center space-x-3">
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
          
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-2 text-sm font-medium ${
                viewMode === 'month' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-2 text-sm font-medium border-l border-gray-300 ${
                viewMode === 'week' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-2 text-sm font-medium border-l border-gray-300 ${
                viewMode === 'day' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Day
            </button>
          </div>
          
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowScheduleModal(true)}
          >
            Schedule Post
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
          {/* Day headers */}
          {dayNames.map((day) => (
            <div
              key={day}
              className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((date, index) => (
            <CalendarDay
              key={index}
              date={date}
              isCurrentMonth={date ? date.getMonth() === currentDate.getMonth() : false}
            />
          ))}
        </div>
      </Card>

      {/* Upcoming Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Posts</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
              {scheduledContent
                .filter(content => filterPlatform === 'all' || content.platform === filterPlatform)
                .sort((a, b) => new Date(a.scheduling.scheduledFor).getTime() - new Date(b.scheduling.scheduledFor).getTime())
                .slice(0, 10)
                .map((content) => (
                  <div
                    key={content._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{getPlatformIcon(content.platform)}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{content.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{content.content.caption}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {new Date(content.scheduling.scheduledFor).toLocaleDateString()}
                          <Clock className="h-3 w-3 ml-2 mr-1" />
                          {formatTime(content.scheduling.scheduledFor)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPlatformColor(content.platform)}`}>
                        {content.platform}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Button size="sm" variant="ghost" icon={<Eye className="h-3 w-3" />} />
                        <Button size="sm" variant="ghost" icon={<Edit3 className="h-3 w-3" />} />
                        <Button size="sm" variant="ghost" icon={<Trash2 className="h-3 w-3" />} />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Calendar Stats */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">This Month</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Scheduled</span>
              <span className="font-semibold text-gray-900">{scheduledContent.length}</span>
            </div>
            
            <div className="space-y-2">
              {['instagram', 'linkedin', 'twitter', 'facebook'].map(platform => {
                const count = scheduledContent.filter(c => c.platform === platform).length;
                if (count === 0) return null;
                
                return (
                  <div key={platform} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span>{getPlatformIcon(platform)}</span>
                      <span className="text-sm text-gray-600 capitalize">{platform}</span>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Best Posting Time</span>
              </div>
              <p className="text-sm text-gray-500">9:00 AM - 11:00 AM</p>
              <p className="text-xs text-gray-400">Based on your audience activity</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule New Post"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Schedule content modal would go here...</p>
          <Button onClick={() => setShowScheduleModal(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;