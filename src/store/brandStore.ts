import { create } from 'zustand';
import { Brand } from '../types';

interface BrandState {
  brands: Brand[];
  currentBrand: Brand | null;
  isLoading: boolean;
  fetchBrands: () => Promise<void>;
  createBrand: (brandData: Partial<Brand>) => Promise<Brand>;
  updateBrand: (brandId: string, brandData: Partial<Brand>) => Promise<Brand>;
  deleteBrand: (brandId: string) => Promise<void>;
  setCurrentBrand: (brand: Brand | null) => void;
  connectSocialAccount: (brandId: string, platform: string, credentials: any) => Promise<void>;
  disconnectSocialAccount: (brandId: string, platform: string) => Promise<void>;
}

// Mock brand data for preview
const mockBrands: Brand[] = [
  {
    id: '1',
    userId: '1',
    name: 'TechFlow Solutions',
    industry: 'SaaS Technology',
    description: 'AI-powered business automation platform',
    website: 'https://techflow.com',
    targetAudience: {
      demographics: {
        ageRange: { min: 25, max: 45 },
        gender: 'all',
        location: ['United States', 'Canada', 'United Kingdom'],
        interests: ['Technology', 'Business', 'Automation', 'AI']
      },
      psychographics: {
        values: ['Innovation', 'Efficiency', 'Growth'],
        lifestyle: ['Tech-savvy', 'Business-focused', 'Early adopters'],
        painPoints: ['Manual processes', 'Time management', 'Scaling challenges']
      }
    },
    brandVoice: {
      tone: 'professional',
      personality: ['Innovative', 'Trustworthy', 'Expert', 'Approachable'],
      doNotUse: ['Jargon', 'Overly technical', 'Pushy sales'],
      keyMessages: ['Automate your success', 'Technology that works for you', 'Scale with confidence']
    },
    visualIdentity: {
      logo: '',
      colors: {
        primary: '#2563eb',
        secondary: '#3b82f6',
        accent: ['#8b5cf6', '#10b981', '#f59e0b']
      },
      fonts: {
        primary: 'Inter',
        secondary: 'Roboto'
      }
    },
    socialAccounts: {
      instagram: { connected: true, username: 'techflow_solutions' },
      linkedin: { connected: true, username: 'techflow-solutions' },
      twitter: { connected: true, username: 'techflow_ai' },
      facebook: { connected: false },
      youtube: { connected: true, username: 'TechFlowSolutions' },
      tiktok: { connected: false }
    },
    competitors: [
      {
        name: 'AutomateNow',
        website: 'https://automatenow.com',
        socialHandles: { linkedin: 'automatenow', twitter: 'automatenow' },
        strengths: ['Large user base', 'Enterprise features'],
        weaknesses: ['Complex setup', 'High pricing']
      }
    ],
    contentGuidelines: {
      preferredContentTypes: ['Educational', 'Behind-the-scenes', 'Product demos'],
      postingFrequency: {
        instagram: 1,
        linkedin: 3,
        twitter: 5,
        facebook: 2,
        youtube: 1,
        tiktok: 2
      },
      hashtagStrategy: {
        branded: ['#TechFlow', '#AutomateSuccess', '#BusinessAI'],
        industry: ['#SaaS', '#BusinessAutomation', '#TechSolutions'],
        trending: ['#AI', '#Productivity', '#DigitalTransformation']
      },
      contentPillars: ['Product Education', 'Industry Insights', 'Customer Success', 'Company Culture']
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useBrandStore = create<BrandState>((set, get) => ({
  brands: [],
  currentBrand: null,
  isLoading: false,

  fetchBrands: async () => {
    set({ isLoading: true });
    try {
      // Mock API call for preview
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ brands: mockBrands, isLoading: false });
      
      // Set first brand as current if none selected
      if (!get().currentBrand && mockBrands.length > 0) {
        set({ currentBrand: mockBrands[0] });
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      set({ isLoading: false });
    }
  },

  createBrand: async (brandData) => {
    try {
      // Mock API call for preview
      const newBrand = {
        ...brandData,
        id: Date.now().toString(),
        userId: '1',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Brand;
      
      set((state) => ({
        brands: [...state.brands, newBrand],
        currentBrand: newBrand
      }));
      
      return newBrand;
    } catch (error: any) {
      throw new Error('Failed to create brand');
    }
  },

  updateBrand: async (brandId, brandData) => {
    try {
      // Mock API call for preview
      const updatedBrand = {
        ...get().brands.find(b => b.id === brandId),
        ...brandData,
        updatedAt: new Date().toISOString()
      } as Brand;
      
      set((state) => ({
        brands: state.brands.map(brand => 
          brand.id === brandId ? updatedBrand : brand
        ),
        currentBrand: state.currentBrand?.id === brandId ? updatedBrand : state.currentBrand
      }));
      
      return updatedBrand;
    } catch (error: any) {
      throw new Error('Failed to update brand');
    }
  },

  deleteBrand: async (brandId) => {
    try {
      // Mock API call for preview
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set((state) => {
        const updatedBrands = state.brands.filter(brand => brand.id !== brandId);
        return {
          brands: updatedBrands,
          currentBrand: state.currentBrand?.id === brandId 
            ? (updatedBrands[0] || null) 
            : state.currentBrand
        };
      });
    } catch (error: any) {
      throw new Error('Failed to delete brand');
    }
  },

  setCurrentBrand: (brand) => {
    set({ currentBrand: brand });
  },

  connectSocialAccount: async (brandId, platform, credentials) => {
    try {
      // Mock API call for preview
      const updatedBrand = {
        ...get().brands.find(b => b.id === brandId),
        socialAccounts: {
          ...get().brands.find(b => b.id === brandId)?.socialAccounts,
          [platform]: { connected: true, ...credentials }
        }
      } as Brand;
      
      set((state) => ({
        brands: state.brands.map(brand => 
          brand.id === brandId ? updatedBrand : brand
        ),
        currentBrand: state.currentBrand?.id === brandId ? updatedBrand : state.currentBrand
      }));
    } catch (error: any) {
      throw new Error('Failed to connect social account');
    }
  },

  disconnectSocialAccount: async (brandId, platform) => {
    try {
      // Mock API call for preview
      const updatedBrand = {
        ...get().brands.find(b => b.id === brandId),
        socialAccounts: {
          ...get().brands.find(b => b.id === brandId)?.socialAccounts,
          [platform]: { connected: false }
        }
      } as Brand;
      
      set((state) => ({
        brands: state.brands.map(brand => 
          brand.id === brandId ? updatedBrand : brand
        ),
        currentBrand: state.currentBrand?.id === brandId ? updatedBrand : state.currentBrand
      }));
    } catch (error: any) {
      throw new Error('Failed to disconnect social account');
    }
  }
}));