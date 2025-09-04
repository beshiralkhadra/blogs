'use client';

import Loading from "@/app/loading";
import { useAuth } from "@/contexts/appContext";


export default function AppShell({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
console.log({loading});

  if (loading) {
    return <Loading />
  }

  return <>{children}</>;
}
