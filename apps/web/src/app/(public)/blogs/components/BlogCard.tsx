import Link from 'next/link';
import { type Blog } from '@/contexts/BlogsContext';

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blogs/${blog.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {blog.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.content.substring(0, 150)}
          {blog.content.length > 150 && '...'}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">By {blog.author}</span>
          <Link 
            href={`/blogs/${blog.id}`}
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors cursor-pointer"
          >
            Read More →
          </Link>
        </div>
      </div>
    </Link>
  );
}
