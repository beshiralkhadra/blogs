'use client';

import { notFound } from 'next/navigation';
import { BackButton } from './components/BackButton';
import { useBlogs } from '@/contexts/BlogsContext';
import { useEffect } from 'react';

interface BlogDetailsPageProps {
  params: {
    id: string;
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { blogs, isLoading } = useBlogs();
  const id = parseInt(params.id);

  useEffect(() => {
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-24 bg-gray-200 rounded mb-6"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const blog = blogs.find(b => b.id === id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <article className="bg-white rounded-lg shadow-sm p-8">
          <header className="mb-8 border-b border-gray-200 pb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center text-gray-600 text-sm space-x-4">
              <span>By {blog.author}</span>
              <span>•</span>
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {blog.content}
            </div>
          </div>

          <footer className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <BackButton />
              <div className="text-sm text-gray-500">
                Created: {formatDate(blog.createdAt)}
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
