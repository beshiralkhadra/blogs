'use client';

import { useAuth } from '@/contexts/appContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const { authenticated, logout } = useAuth();

  console.log({ authenticated });

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-800 hover:text-indigo-600"
            >
              BlogApp
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/' ? 'text-indigo-600 bg-indigo-50' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/blogs"
              className={`text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/blogs' ? 'text-indigo-600 bg-indigo-50' : ''
              }`}
            >
              All Blogs
            </Link>
            {authenticated ? (
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
