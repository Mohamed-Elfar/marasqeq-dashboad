'use client';

import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { toast } from 'react-toastify';

export default function LogoutButton({ children, className, onClick }) {
  const router = useRouter();

  const handleLogout = async (e) => {
    e.preventDefault();
    
    if (onClick) {
      onClick(e);
    }

    try {
      const { error } = await authService.signOut();
      
      if (error) throw error;

      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  return (
    <a href="#" onClick={handleLogout} className={className}>
      {children}
    </a>
  );
}
