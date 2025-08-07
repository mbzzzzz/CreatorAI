import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut,
  Moon,
  Sun,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBrandStore } from '../../store/brandStore';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { currentBrand, brands, setCurrentBrand } = useBrandStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBrandMenu, setShowBrandMenu] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize brands on component mount
  const { fetchBrands } = useBrandStore();
  React.useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // In a real app, you'd persist this to localStorage and apply to document
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search content, analytics, or ask AI..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Brand Selector */}
          {currentBrand && (
            <div className="relative">
              <button
                onClick={() => setShowBrandMenu(!showBrandMenu)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {currentBrand.name.charAt(0)}
                  </span>
                </div>
                <span>{currentBrand.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showBrandMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  {brands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => {
                        setCurrentBrand(brand);
                        setShowBrandMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 ${
                        currentBrand.id === brand.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {brand.name.charAt(0)}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{brand.name}</p>
                        <p className="text-xs text-gray-500">{brand.industry}</p>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 text-left">
                      + Create New Brand
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {user?.subscription.plan} Plan
                    </span>
                  </div>
                </div>

                <div className="py-2">
                  <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;