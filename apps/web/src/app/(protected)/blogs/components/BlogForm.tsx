'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBlogs } from '@/contexts/BlogsContext';

interface BlogFormProps {
  blogId?: string;
}

export default function BlogForm({ blogId }: BlogFormProps) {
  const router = useRouter();
  const { createBlog, updateBlog, blogs } = useBlogs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [error, setError] = useState('');

  const isEditing = !!blogId;

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      const existingBlog = blogs.find(blog => blog.id === parseInt(blogId));
      if (existingBlog) {
        setFormData({
          title: existingBlog.title,
          content: existingBlog.content,
        });
        setLoading(false);
      } else {
        setTimeout(() => {
          const mockBlog = {
            id: parseInt(blogId),
            title: 'Sample Blog Title',
            content: 'This is the content of the blog post that we are editing...',
            author: 'Current User',
            createdAt: '2024-08-15T10:30:00Z',
          };
          
          setFormData({
            title: mockBlog.title,
            content: mockBlog.content,
          });
          setLoading(false);
        }, 500);
      }
    }
  }, [blogId, isEditing, blogs]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!formData.title.trim() || !formData.content.trim()) {
        throw new Error('Title and content are required');
      }

      let blog;
      if (isEditing) {
        blog = await updateBlog(parseInt(blogId), {
          title: formData.title.trim(),
          content: formData.content.trim(),
        });
      } else {
        blog = await createBlog({
          title: formData.title.trim(),
          content: formData.content.trim(),
        });
      }

      if (blog) {
        router.push(`/blogs/${blog.id}`);
      } else {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} blog`);
      }
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'create'} blog:`, error);
      setError(error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} blog post`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/blogs');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading blog...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Update your blog post' : 'Share your thoughts with the world'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            placeholder="Enter your blog title"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            placeholder="Write your blog content here..."
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting 
              ? (isEditing ? 'Updating...' : 'Creating...') 
              : (isEditing ? 'Update Post' : 'Create Post')
            }
          </button>
        </div>
      </form>
    </div>
  );
}
