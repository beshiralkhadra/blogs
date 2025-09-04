'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface BlogsContextType {
  blogs: Blog[];
  userBlogs: Blog[];
  isLoading: boolean;
  error: string | null;

  fetchBlogs: () => Promise<void>;
  fetchUserBlogs: () => Promise<void>;
  createBlog: (blogData: {
    title: string;
    content: string;
  }) => Promise<Blog | null>;
  updateBlog: (
    id: number,
    blogData: { title: string; content: string }
  ) => Promise<Blog | null>;
  deleteBlog: (id: number) => Promise<boolean>;
}

const BlogsContext = createContext<BlogsContextType | undefined>(undefined);

export function BlogsProvider({ children }: { children: ReactNode }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userBlogsFetched, setUserBlogsFetched] = useState(false);
  const [isUserBlogsLoading, setIsUserBlogsLoading] = useState(false);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {

      const res = await fetch('/api/blog', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch blogs');
      const response = await res.json();

      setBlogs(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUserBlogs = useCallback(async (force = false) => {
    // Prevent multiple simultaneous calls
    if (isUserBlogsLoading) {
      return;
    }
    
    // Don't refetch if we already have data unless forced
    if (userBlogsFetched && !force) {
      return;
    }
    
    setIsUserBlogsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/blog/user', {
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch user blogs');
      }
      
      const response = await res.json();
      setUserBlogs(response.data || []);
      setUserBlogsFetched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user blogs');
      console.error('Failed to fetch user blogs:', err);
    } finally {
      setIsUserBlogsLoading(false);
    }
  }, [isUserBlogsLoading, userBlogsFetched]);

  const createBlog = async (blogData: {
    title: string;
    content: string;
  }): Promise<Blog | null> => {
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        const result = await response.json();
        const newBlog = result.data;
        setBlogs((prev) => [newBlog, ...prev]);
        setUserBlogs((prev) => [newBlog, ...prev]);
        return newBlog;
      } else {
        throw new Error('Failed to create blog');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create blog');
      return null;
    }
  };

  const updateBlog = async (
    id: number,
    blogData: { title: string; content: string }
  ): Promise<Blog | null> => {
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        const result = await response.json();
        const updatedBlog = result.data;
        setBlogs((prev) =>
          prev.map((blog) => (blog.id === id ? updatedBlog : blog))
        );
        setUserBlogs((prev) =>
          prev.map((blog) => (blog.id === id ? updatedBlog : blog))
        );
        return updatedBlog;
      } else {
        throw new Error('Failed to update blog');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update blog');
      return null;
    }
  };

  const deleteBlog = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setBlogs((prev) => prev.filter((blog) => blog.id !== id));
        setUserBlogs((prev) => prev.filter((blog) => blog.id !== id));
        await fetchBlogs();
        return true;
      } else {
        throw new Error('Failed to delete blog');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog');
      return false;
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const value: BlogsContextType = {
    blogs,
    userBlogs,
    isLoading,
    error,
    fetchBlogs,
    fetchUserBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  };

  return (
    <BlogsContext.Provider value={value}>{children}</BlogsContext.Provider>
  );
}

export function useBlogs() {
  const context = useContext(BlogsContext);
  if (context === undefined) {
    throw new Error('useBlogs must be used within a BlogsProvider');
  }
  return context;
}
