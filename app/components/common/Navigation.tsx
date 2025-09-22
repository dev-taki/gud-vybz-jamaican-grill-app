'use client';

import React from 'react';
import Link from 'next/link';
import { useNavigation, useAppDispatch } from '../../store/hooks';
import { setCurrentPage, toggleSidebar } from '../../store/slices/navigationSlice';
import { Menu, X } from 'lucide-react';
import { COLORS } from '../../config/colors';

export const Navigation: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentPage, sidebarOpen } = useNavigation();

  const handlePageChange = (page: string) => {
    dispatch(setCurrentPage(page));
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/login', label: 'Login' },
    { href: '/signup', label: 'Sign Up' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Redux Template</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handlePageChange(item.href)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.href
                    ? 'text-gray-700 bg-gray-100 bg-opacity-10'
                    : 'text-gray-700 hover:text-gray-700 hover:bg-gray-100 hover:bg-opacity-10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={handleToggleSidebar}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-700 hover:bg-gray-100 hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#8c52ff]"
            >
              {sidebarOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {sidebarOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  handlePageChange(item.href);
                  dispatch(toggleSidebar());
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentPage === item.href
                    ? 'text-gray-700 bg-gray-100 bg-opacity-10'
                    : 'text-gray-700 hover:text-gray-700 hover:bg-gray-100 hover:bg-opacity-10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
