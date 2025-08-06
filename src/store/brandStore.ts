import { create } from 'zustand';
import { Brand } from '../types';
import api from '../services/api';

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

export const useBrandStore = create<BrandState>((set, get) => ({
  brands: [],
  currentBrand: null,
  isLoading: false,

  fetchBrands: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/brands');
      const brands = response.data;
      set({ brands, isLoading: false });
      
      // Set first brand as current if none selected
      if (!get().currentBrand && brands.length > 0) {
        set({ currentBrand: brands[0] });
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      set({ isLoading: false });
    }
  },

  createBrand: async (brandData) => {
    try {
      const response = await api.post('/brands', brandData);
      const newBrand = response.data;
      
      set((state) => ({
        brands: [...state.brands, newBrand],
        currentBrand: newBrand
      }));
      
      return newBrand;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create brand');
    }
  },

  updateBrand: async (brandId, brandData) => {
    try {
      const response = await api.put(`/brands/${brandId}`, brandData);
      const updatedBrand = response.data;
      
      set((state) => ({
        brands: state.brands.map(brand => 
          brand.id === brandId ? updatedBrand : brand
        ),
        currentBrand: state.currentBrand?.id === brandId ? updatedBrand : state.currentBrand
      }));
      
      return updatedBrand;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update brand');
    }
  },

  deleteBrand: async (brandId) => {
    try {
      await api.delete(`/brands/${brandId}`);
      
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
      throw new Error(error.response?.data?.message || 'Failed to delete brand');
    }
  },

  setCurrentBrand: (brand) => {
    set({ currentBrand: brand });
  },

  connectSocialAccount: async (brandId, platform, credentials) => {
    try {
      const response = await api.post(`/brands/${brandId}/connect/${platform}`, credentials);
      const updatedBrand = response.data;
      
      set((state) => ({
        brands: state.brands.map(brand => 
          brand.id === brandId ? updatedBrand : brand
        ),
        currentBrand: state.currentBrand?.id === brandId ? updatedBrand : state.currentBrand
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to connect social account');
    }
  },

  disconnectSocialAccount: async (brandId, platform) => {
    try {
      const response = await api.delete(`/brands/${brandId}/disconnect/${platform}`);
      const updatedBrand = response.data;
      
      set((state) => ({
        brands: state.brands.map(brand => 
          brand.id === brandId ? updatedBrand : brand
        ),
        currentBrand: state.currentBrand?.id === brandId ? updatedBrand : state.currentBrand
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to disconnect social account');
    }
  }
}));