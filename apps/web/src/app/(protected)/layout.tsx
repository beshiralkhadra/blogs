'use client';

import { useAuth } from '@/contexts/appContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('layout of protected from blogs create/edit/delete.........', authenticated);
    
    if (!authenticated) {
      router.push('/login');
    }
  }, [authenticated, router]);

  if (!authenticated) return null;

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
