import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Palette, 
  Type, 
  Users, 
  Globe,
  Plus,
  Edit3,
  Save,
  Upload,
  CheckCircle,
  X,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube
} from 'lucide-react';
import { useBrandStore } from '../store/brandStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const BrandStudio: React.FC = () => {
  const { currentBrand, brands, createBrand, updateBrand, setCurrentBrand } = useBrandStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    website: '',
    targetAudience: {
      demographics: {
        ageRange: { min: 18, max: 65 },
        gender: 'all' as 'male' | 'female' | 'all',
        location: [] as string[],
        interests: [] as string[]
      },
      psychographics: {
        values: [] as string[],
        lifestyle: [] as string[],
        painPoints: [] as string[]
      }
    },
    brandVoice: {
      tone: 'professional' as 'professional' | 'casual' | 'friendly' | 'authoritative' | 'playful' | 'inspirational',
      personality: [] as string[],
      doNotUse: [] as string[],
      keyMessages: [] as string[]
    },
    visualIdentity: {
      colors: {
        primary: '#2563eb',
        secondary: '#3b82f6',
        accent: [] as string[]
      },
      fonts: {
        primary: 'Inter',
        secondary: ''
      }
    },
    contentGuidelines: {
      preferredContentTypes: [] as string[],
      postingFrequency: {
        instagram: 1,
        linkedin: 3,
        twitter: 5,
        facebook: 2,
        youtube: 1,
        tiktok: 2
      },
      hashtagStrategy: {
        branded: [] as string[],
        industry: [] as string[],
        trending: [] as string[]
      },
      contentPillars: [] as string[]
    }
  });

  useEffect(() => {
    if (currentBrand && !isEditing) {
      setFormData({
        name: currentBrand.name || '',
        industry: currentBrand.industry || '',
        description: currentBrand.description || '',
        website: currentBrand.website || '',
        targetAudience: currentBrand.targetAudience || formData.targetAudience,
        brandVoice: currentBrand.brandVoice || formData.brandVoice,
        visualIdentity: currentBrand.visualIdentity || formData.visualIdentity,
        contentGuidelines: currentBrand.contentGuidelines || formData.contentGuidelines
      });
    }
  }, [currentBrand, isEditing]);

  const handleSave = async () => {
    if (!currentBrand) return;

    try {
      await updateBrand(currentBrand.id, formData);
      setIsEditing(false);
      toast.success('Brand updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update brand');
    }
  };

  const handleCreateBrand = async (newBrandData: any) => {
    try {
      const brand = await createBrand(newBrandData);
      setCurrentBrand(brand);
      setShowCreateModal(false);
      toast.success('Brand created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create brand');
    }
  };

  const addArrayItem = (path: string, value: string) => {
    if (!value.trim()) return;
    
    const keys = path.split('.');
    const newFormData = { ...formData };
    let current: any = newFormData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    const finalKey = keys[keys.length - 1];
    if (!current[finalKey].includes(value.trim())) {
      current[finalKey] = [...current[finalKey], value.trim()];
      setFormData(newFormData);
    }
  };

  const removeArrayItem = (path: string, index: number) => {
    const keys = path.split('.');
    const newFormData = { ...formData };
    let current: any = newFormData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    const finalKey = keys[keys.length - 1];
    current[finalKey] = current[finalKey].filter((_: any, i: number) => i !== index);
    setFormData(newFormData);
  };

  const ArrayInput = ({ 
    label, 
    path, 
    placeholder, 
    items 
  }: { 
    label: string; 
    path: string; 
    placeholder: string; 
    items: string[] 
  }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
      addArrayItem(path, inputValue);
      setInputValue('');
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button size="sm" onClick={handleAdd}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {item}
              <button
                onClick={() => removeArrayItem(path, index)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };

  const SocialAccountCard = ({ 
    platform, 
    icon: Icon, 
    color, 
    connected = false 
  }: { 
    platform: string; 
    icon: any; 
    color: string; 
    connected?: boolean 
  }) => (
    <Card hover className="text-center">
      <div className="flex flex-col items-center space-y-3">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 capitalize">{platform}</h3>
          <p className="text-sm text-gray-500">
            {connected ? 'Connected' : 'Not connected'}
          </p>
        </div>
        <Button
          size="sm"
          variant={connected ? 'outline' : 'primary'}
          icon={connected ? <CheckCircle className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        >
          {connected ? 'Connected' : 'Connect'}
        </Button>
      </div>
    </Card>
  );

  if (!currentBrand) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Brand Selected</h3>
          <p className="text-gray-500 mb-4">
            Create your first brand to start building your AI-powered marketing strategy.
          </p>
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            Create Your First Brand
          </Button>
        </div>

        {/* Create Brand Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Brand"
          size="lg"
        >
          <CreateBrandForm onSubmit={handleCreateBrand} onCancel={() => setShowCreateModal(false)} />
        </Modal>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brand Studio</h1>
          <p className="text-gray-600">Manage your brand identity and guidelines</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {brands.length > 1 && (
            <select
              value={currentBrand.id}
              onChange={(e) => {
                const brand = brands.find(b => b.id === e.target.value);
                if (brand) setCurrentBrand(brand);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          )}
          
          <Button
            variant="outline"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            New Brand
          </Button>
          
          {isEditing ? (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                icon={<Save className="h-4 w-4" />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <Button
              icon={<Edit3 className="h-4 w-4" />}
              onClick={() => setIsEditing(true)}
            >
              Edit Brand
            </Button>
          )}
        </div>
      </div>

      {/* Brand Overview */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {currentBrand.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentBrand.name}</h2>
              <p className="text-gray-600">{currentBrand.industry}</p>
              {currentBrand.website && (
                <a
                  href={currentBrand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center mt-1"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  {currentBrand.website}
                </a>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Created</p>
            <p className="font-medium text-gray-900">
              {new Date(currentBrand.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {currentBrand.description && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-700">{currentBrand.description}</p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card>
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Brand Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <Input
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Industry</p>
                <p className="font-medium text-gray-900">{currentBrand.industry}</p>
              </div>
              {currentBrand.description && (
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-gray-900">{currentBrand.description}</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Brand Voice */}
        <Card>
          <div className="flex items-center space-x-2 mb-4">
            <Type className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Brand Voice</h3>
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <select
                  value={formData.brandVoice.tone}
                  onChange={(e) => setFormData({
                    ...formData,
                    brandVoice: { ...formData.brandVoice, tone: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="authoritative">Authoritative</option>
                  <option value="playful">Playful</option>
                  <option value="inspirational">Inspirational</option>
                </select>
              </div>
              
              <ArrayInput
                label="Personality Traits"
                path="brandVoice.personality"
                placeholder="e.g., Innovative, Trustworthy"
                items={formData.brandVoice.personality}
              />
              
              <ArrayInput
                label="Key Messages"
                path="brandVoice.keyMessages"
                placeholder="e.g., Quality first, Customer-focused"
                items={formData.brandVoice.keyMessages}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Tone</p>
                <p className="font-medium text-gray-900 capitalize">{currentBrand.brandVoice.tone}</p>
              </div>
              
              {currentBrand.brandVoice.personality.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Personality</p>
                  <div className="flex flex-wrap gap-1">
                    {currentBrand.brandVoice.personality.map((trait, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {currentBrand.brandVoice.keyMessages.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Key Messages</p>
                  <div className="space-y-1">
                    {currentBrand.brandVoice.keyMessages.map((message, index) => (
                      <p key={index} className="text-sm text-gray-900">• {message}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Visual Identity */}
        <Card>
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="h-5 w-5 text-pink-600" />
            <h3 className="text-lg font-semibold text-gray-900">Visual Identity</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Brand Colors</p>
              <div className="flex space-x-2">
                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-lg border border-gray-200 mb-1"
                    style={{ backgroundColor: currentBrand.visualIdentity.colors.primary }}
                  />
                  <p className="text-xs text-gray-600">Primary</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-lg border border-gray-200 mb-1"
                    style={{ backgroundColor: currentBrand.visualIdentity.colors.secondary }}
                  />
                  <p className="text-xs text-gray-600">Secondary</p>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Primary Font</p>
              <p className="font-medium text-gray-900">{currentBrand.visualIdentity.fonts.primary}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Social Media Accounts */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Connected Platforms</h3>
          </div>
          <Button variant="outline" size="sm">
            Manage Connections
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <SocialAccountCard
            platform="instagram"
            icon={Instagram}
            color="bg-gradient-to-r from-purple-500 to-pink-500"
            connected={currentBrand.socialAccounts?.instagram?.connected}
          />
          <SocialAccountCard
            platform="linkedin"
            icon={Linkedin}
            color="bg-blue-600"
            connected={currentBrand.socialAccounts?.linkedin?.connected}
          />
          <SocialAccountCard
            platform="twitter"
            icon={Twitter}
            color="bg-sky-500"
            connected={currentBrand.socialAccounts?.twitter?.connected}
          />
          <SocialAccountCard
            platform="facebook"
            icon={Facebook}
            color="bg-blue-700"
            connected={currentBrand.socialAccounts?.facebook?.connected}
          />
          <SocialAccountCard
            platform="youtube"
            icon={Youtube}
            color="bg-red-600"
            connected={currentBrand.socialAccounts?.youtube?.connected}
          />
          <SocialAccountCard
            platform="tiktok"
            icon={Target}
            color="bg-gray-900"
            connected={currentBrand.socialAccounts?.tiktok?.connected}
          />
        </div>
      </Card>

      {/* Create Brand Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Brand"
        size="lg"
      >
        <CreateBrandForm onSubmit={handleCreateBrand} onCancel={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
};

const CreateBrandForm: React.FC<{
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    website: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.industry) {
      toast.error('Please fill in required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Brand Name *"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Enter your brand name"
        required
      />
      
      <Input
        label="Industry *"
        value={formData.industry}
        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
        placeholder="e.g., Technology, Fashion, Food"
        required
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of your brand"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>
      
      <Input
        label="Website"
        value={formData.website}
        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        placeholder="https://example.com"
      />
      
      <div className="flex space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Brand
        </Button>
      </div>
    </form>
  );
};

export default BrandStudio;