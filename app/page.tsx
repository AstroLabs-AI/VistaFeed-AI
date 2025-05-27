'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const checkAndRedirect = async () => {
        const isAuth = await checkAuth();
        
        const timer = setTimeout(() => {
          if (isAuth) {
            router.push('/dashboard');
          } else {
            router.push('/auth');
          }
        }, 1000);
        
        return () => clearTimeout(timer);
      };
      
      checkAndRedirect();
    }
  }, [mounted, router, checkAuth]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Loading VistaFeed AI...</h1>
        <div style={{ fontSize: '3rem' }}>🚀</div>
      </div>
    </div>
  );
}