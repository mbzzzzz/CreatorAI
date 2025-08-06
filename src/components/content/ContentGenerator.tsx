import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Image, 
  Video, 
  FileText, 
  Wand2,
  Copy,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';
import { useBrandStore } from '../../store/brandStore';
import aiService from '../../services/aiService';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

const ContentGenerator: React.FC = () => {
  const { currentBrand } = useBrandStore();
  const [activeTab, setActiveTab] = useState<'caption' | 'image' | 'video'>('caption');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  // Form states
  const [captionForm, setCaptionForm] = useState({
    platform: 'instagram',
    contentType: 'post',
    topic: '',
    tone: 'professional',
    targetAudience: ''
  });

  const [imageForm, setImageForm] = useState({
    topic: '',
    style: 'modern',
    mood: 'professional',
    platform: 'instagram'
  });

  const [videoForm, setVideoForm] = useState({
    topic: '',
    duration: 30,
    platform: 'instagram',
    scriptType: 'educational'
  });

  const platforms = [
    { id: 'instagram', name: 'Instagram' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'youtube', name: 'YouTube' },
    { id: 'tiktok', name: 'TikTok' }
  ];

  const contentTypes = [
    { id: 'post', name: 'Post' },
    { id: 'story', name: 'Story' },
    { id: 'reel', name: 'Reel' },
    { id: 'article', name: 'Article' },
    { id: 'thread', name: 'Thread' }
  ];

  const tones = [
    { id: 'professional', name: 'Professional' },
    { id: 'casual', name: 'Casual' },
    { id: 'friendly', name: 'Friendly' },
    { id: 'authoritative', name: 'Authoritative' },
    { id: 'playful', name: 'Playful' },
    { id: 'inspirational', name: 'Inspirational' }
  ];

  const handleGenerateCaption = async () => {
    if (!currentBrand) {
      toast.error('Please select a brand first');
      return;
    }

    if (!captionForm.topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await aiService.generateCaption({
        brandId: currentBrand.id,
        platform: captionForm.platform,
        contentType: captionForm.contentType,
        topic: captionForm.topic,
        tone: captionForm.tone,
        targetAudience: captionForm.targetAudience
      });

      setGeneratedContent(result);
      toast.success('Caption generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate caption');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImageConcept = async () => {
    if (!currentBrand) {
      toast.error('Please select a brand first');
      return;
    }

    if (!imageForm.topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await aiService.generateImageConcept({
        brandId: currentBrand.id,
        topic: imageForm.topic,
        style: imageForm.style,
        mood: imageForm.mood,
        platform: imageForm.platform
      });

      setGeneratedContent(result);
      toast.success('Image concept generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate image concept');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVideoScript = async () => {
    if (!currentBrand) {
      toast.error('Please select a brand first');
      return;
    }

    if (!videoForm.topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await aiService.generateVideoScript({
        brandId: currentBrand.id,
        topic: videoForm.topic,
        duration: videoForm.duration,
        platform: videoForm.platform,
        scriptType: videoForm.scriptType
      });

      setGeneratedContent(result);
      toast.success('Video script generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate video script');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const tabs = [
    { id: 'caption', name: 'Caption', icon: FileText },
    { id: 'image', name: 'Image Concept', icon: Image },
    { id: 'video', name: 'Video Script', icon: Video }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Content Generator</h2>
          <p className="text-gray-600">Create engaging content with AI assistance</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Sparkles className="h-4 w-4" />
          <span>Powered by advanced AI models</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Generate {tabs.find(t => t.id === activeTab)?.name}
            </h3>

            {activeTab === 'caption' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <select
                      value={captionForm.platform}
                      onChange={(e) => setCaptionForm({ ...captionForm, platform: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {platforms.map(platform => (
                        <option key={platform.id} value={platform.id}>
                          {platform.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type
                    </label>
                    <select
                      value={captionForm.contentType}
                      onChange={(e) => setCaptionForm({ ...captionForm, contentType: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {contentTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Input
                  label="Topic/Theme"
                  placeholder="e.g., Product launch, Industry insights, Behind the scenes"
                  value={captionForm.topic}
                  onChange={(e) => setCaptionForm({ ...captionForm, topic: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tone
                    </label>
                    <select
                      value={captionForm.tone}
                      onChange={(e) => setCaptionForm({ ...captionForm, tone: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {tones.map(tone => (
                        <option key={tone.id} value={tone.id}>
                          {tone.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Target Audience (Optional)"
                    placeholder="e.g., Tech professionals, Young adults"
                    value={captionForm.targetAudience}
                    onChange={(e) => setCaptionForm({ ...captionForm, targetAudience: e.target.value })}
                  />
                </div>

                <Button
                  onClick={handleGenerateCaption}
                  isLoading={isGenerating}
                  icon={<Wand2 className="h-4 w-4" />}
                  className="w-full"
                >
                  Generate Caption
                </Button>
              </div>
            )}

            {activeTab === 'image' && (
              <div className="space-y-4">
                <Input
                  label="Topic/Theme"
                  placeholder="e.g., Product showcase, Team meeting, Office environment"
                  value={imageForm.topic}
                  onChange={(e) => setImageForm({ ...imageForm, topic: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Style
                    </label>
                    <select
                      value={imageForm.style}
                      onChange={(e) => setImageForm({ ...imageForm, style: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="modern">Modern</option>
                      <option value="minimalist">Minimalist</option>
                      <option value="corporate">Corporate</option>
                      <option value="creative">Creative</option>
                      <option value="lifestyle">Lifestyle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mood
                    </label>
                    <select
                      value={imageForm.mood}
                      onChange={(e) => setImageForm({ ...imageForm, mood: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="professional">Professional</option>
                      <option value="energetic">Energetic</option>
                      <option value="calm">Calm</option>
                      <option value="inspiring">Inspiring</option>
                      <option value="playful">Playful</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    value={imageForm.platform}
                    onChange={(e) => setImageForm({ ...imageForm, platform: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {platforms.map(platform => (
                      <option key={platform.id} value={platform.id}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleGenerateImageConcept}
                  isLoading={isGenerating}
                  icon={<Wand2 className="h-4 w-4" />}
                  className="w-full"
                >
                  Generate Image Concept
                </Button>
              </div>
            )}

            {activeTab === 'video' && (
              <div className="space-y-4">
                <Input
                  label="Topic/Theme"
                  placeholder="e.g., Product demo, Tutorial, Behind the scenes"
                  value={videoForm.topic}
                  onChange={(e) => setVideoForm({ ...videoForm, topic: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (seconds)
                    </label>
                    <input
                      type="number"
                      min="15"
                      max="300"
                      value={videoForm.duration}
                      onChange={(e) => setVideoForm({ ...videoForm, duration: parseInt(e.target.value) })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Script Type
                    </label>
                    <select
                      value={videoForm.scriptType}
                      onChange={(e) => setVideoForm({ ...videoForm, scriptType: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="educational">Educational</option>
                      <option value="promotional">Promotional</option>
                      <option value="storytelling">Storytelling</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="entertainment">Entertainment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    value={videoForm.platform}
                    onChange={(e) => setVideoForm({ ...videoForm, platform: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {platforms.map(platform => (
                      <option key={platform.id} value={platform.id}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleGenerateVideoScript}
                  isLoading={isGenerating}
                  icon={<Wand2 className="h-4 w-4" />}
                  className="w-full"
                >
                  Generate Video Script
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Generated Content */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Generated Content</h3>
              {generatedContent && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Copy className="h-4 w-4" />}
                    onClick={() => copyToClipboard(
                      activeTab === 'caption' 
                        ? generatedContent.content?.caption || generatedContent.content?.fullResponse
                        : activeTab === 'image'
                        ? generatedContent.concept
                        : generatedContent.script
                    )}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<RefreshCw className="h-4 w-4" />}
                    onClick={() => {
                      if (activeTab === 'caption') handleGenerateCaption();
                      else if (activeTab === 'image') handleGenerateImageConcept();
                      else handleGenerateVideoScript();
                    }}
                  >
                    Regenerate
                  </Button>
                </div>
              )}
            </div>

            {!generatedContent ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Sparkles className="h-12 w-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No content generated yet</p>
                <p className="text-sm">Fill out the form and click generate to create AI content</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {activeTab === 'caption' && generatedContent.content && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Caption</h4>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="whitespace-pre-wrap">{generatedContent.content.caption}</p>
                      </div>
                    </div>
                    
                    {generatedContent.content.hashtags?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Hashtags</h4>
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.content.hashtags.map((hashtag: string, index: number) => (
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

                    {generatedContent.content.cta && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Call to Action</h4>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800">{generatedContent.content.cta}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'image' && generatedContent.concept && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Image Concept</h4>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="whitespace-pre-wrap">{generatedContent.concept}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'video' && generatedContent.script && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Video Script</h4>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="whitespace-pre-wrap">{generatedContent.script}</p>
                    </div>
                  </div>
                )}

                {/* Usage Info */}
                {generatedContent.usage && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-700">AI Usage</span>
                      <span className="text-blue-600">
                        {generatedContent.usage.current} / {generatedContent.usage.limit === -1 ? '∞' : generatedContent.usage.limit}
                      </span>
                    </div>
                    {generatedContent.usage.limit !== -1 && (
                      <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(generatedContent.usage.current / generatedContent.usage.limit) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContentGenerator;