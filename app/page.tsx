'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mounted, router]);

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