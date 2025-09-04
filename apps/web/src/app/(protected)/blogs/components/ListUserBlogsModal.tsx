'use client';
import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import Link from 'next/link';
import { useBlogs, type Blog } from '@/contexts/BlogsContext';

interface ListUserBlogsModalProps {
  open: boolean;
  onClose: () => void;
  onEdit?: (blog: Blog) => void;
}

export default function ListUserBlogsModal({ open, onClose, onEdit }: ListUserBlogsModalProps) {
  const { userBlogs, deleteBlog, fetchUserBlogs, isLoading } = useBlogs();
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      fetchUserBlogs();
    }
  }, [open, fetchUserBlogs]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEdit = (blogId: number) => {
    const blog = userBlogs.find(b => b.id === blogId);
    if (blog && onEdit) {
      onEdit(blog);
      onClose();
    } else {
      window.location.href = `/blogs/edit/${blogId}`;
      onClose();
    }
  };

  const handleDeleteBlog = async (blogId: number) => {
    setDeleting(blogId);
    const success = await deleteBlog(blogId);
    if (success) {
      alert('Blog deleted successfully');
    } else {
      alert('Failed to delete blog');
    }
    setDeleting(null);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Your Blogs"
      size="lg"
      footer={
        <div className="flex justify-end">
          <button 
            onClick={onClose} 
            className="rounded-lg border px-4 py-2 hover:bg-neutral-50"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading your blogs...</span>
          </div>
        ) : userBlogs.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-16 w-16"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs yet</h3>
            <p className="text-gray-500">You haven&apos;t created any blog posts yet.</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-4">
            {userBlogs.map((blog) => (
              <div
                key={blog.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {blog.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                        {blog.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(blog.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                    <Link
                      href={`/blogs/${blog.id}`}
                      className="flex-1 sm:flex-none px-3 py-2 border border-blue-300 text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-sm font-medium rounded transition-colors text-center"
                      onClick={onClose}
                    >
                      View
                    </Link>
                    <button 
                      onClick={() => handleEdit(blog.id)}
                      className="flex-1 sm:flex-none px-3 py-2 border border-green-300 text-green-600 hover:text-green-800 hover:bg-green-50 text-sm font-medium rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteBlog(blog.id)}
                      disabled={deleting === blog.id}
                      className="flex-1 sm:flex-none px-3 py-2 border border-red-300 text-red-600 hover:text-red-800 hover:bg-red-50 text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting === blog.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
