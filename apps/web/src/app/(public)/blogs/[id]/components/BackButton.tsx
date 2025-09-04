'use client';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/blogs')}
      className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
    >
      ← Back to Blogs
    </button>
  );
}
