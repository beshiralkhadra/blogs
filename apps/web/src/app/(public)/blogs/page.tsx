'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BlogCard } from './components/BlogCard';
import { FloatingBtn } from '@/components/FloatingBtn';
import { Pagination } from '@/components/Pagination';
import { useBlogs } from '@/contexts/BlogsContext';
import { useAuth } from '@/contexts/appContext';
import ListUserBlogsModal from '@/app/(protected)/blogs/components/ListUserBlogsModal';

const BLOGS_PER_PAGE = 6;

export default function BlogsPage() {
  const { blogs, isLoading, error } = useBlogs();
  const { authenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    const endIndex = startIndex + BLOGS_PER_PAGE;
    const paginatedBlogs = blogs.slice(startIndex, endIndex);
    const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
    
    return {
      blogs: paginatedBlogs,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }, [blogs, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            All Blog Posts
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Explore our collection of stories, insights, and ideas
          </p>
          
          {authenticated && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setOpenModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                My Blogs
              </button>
              <Link
                href="/blogs/new"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New Blog
              </Link>
            </div>
          )}
        </header>

        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-24 w-24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No blogs yet
            </h3>
            <p className="text-gray-500 mb-6">
              Be the first to create a blog post!
            </p>
            <Link
              href="/blogs/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
            >
              Create First Blog
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
              {paginatedData.blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {paginatedData.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={paginatedData.totalPages}
                onPageChange={handlePageChange}
                showInfo={true}
                totalItems={blogs.length}
                itemsPerPage={BLOGS_PER_PAGE}
              />
            )}
          </>
        )}
      </div>

      <ListUserBlogsModal 
        open={authenticated && openModal} 
        onClose={() => setOpenModal(false)} 
      />

      {!authenticated && (
        <FloatingBtn
          href="/blogs/new"
          ariaLabel="Create new blog"
          svg={
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          }
        />
      )}
    </div>
  );
}
