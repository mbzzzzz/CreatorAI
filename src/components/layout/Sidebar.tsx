import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Calendar,
  Sparkles,
  Target,
  TrendingUp,
  Settings,
  Zap,
  Users,
  CreditCard,
  HelpCircle
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Content Hub', href: '/content', icon: Sparkles },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Brand Studio', href: '/brand', icon: Target },
  { name: 'Team', href: '/team', icon: Users },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  const NavItem = ({ item, isActive }: { item: any; isActive: boolean }) => (
    <NavLink
      to={item.href}
      className={({ isActive: linkActive }) => {
        const active = linkActive || isActive;
        return `
          group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
          ${active
            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }
        `;
      }}
    >
      {({ isActive: linkActive }) => {
        const active = linkActive || isActive;
        return (
          <>
            <item.icon
              className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
              }`}
            />
            {item.name}
            {active && (
              <motion.div
                layoutId="activeTab"
                className="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </>
        );
      }}
    </NavLink>
  );

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CreatorAI
            </h1>
            <p className="text-xs text-gray-500">AI Marketing Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isActive={location.pathname === item.href}
            />
          ))}
        </div>

        <div className="pt-6 mt-6 border-t border-gray-200">
          <div className="space-y-1">
            {secondaryNavigation.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                isActive={location.pathname === item.href}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Usage Stats */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">AI Usage</span>
            <span className="text-xs text-gray-500">Free Plan</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full w-3/4"></div>
          </div>
          <p className="text-xs text-gray-600">37 of 50 AI calls used</p>
          <button className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
            Upgrade Plan →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;