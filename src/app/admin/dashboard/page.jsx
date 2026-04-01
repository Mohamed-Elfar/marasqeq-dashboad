'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const WEBSITE_EDIT_URL = 'http://localhost:3000?edit=true&admin=true';

const AdminDashboardPage = () => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const isAdmin = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true';

    if (!isAdmin) {
      router.replace('/admin/login');
      return;
    }

    setIsCheckingAuth(false);
  }, [router]);

  const handleEditWebsite = () => {
    window.open(WEBSITE_EDIT_URL, '_blank', 'noopener,noreferrer');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    router.push('/admin/login');
  };

  if (isCheckingAuth) {
    return <main className="container py-5">Checking access...</main>;
  }

  return (
    <main className="container py-5" style={{ maxWidth: 700 }}>
      <h1 className="mb-2">Admin Dashboard</h1>
      <p className="text-muted mb-4">Manage website edit access from here.</p>

      <div className="card p-4 shadow-sm border-0">
        <div className="d-flex flex-wrap gap-2">
          <button type="button" onClick={handleEditWebsite} className="btn btn-primary">
            Edit Website
          </button>
          <button type="button" onClick={handleLogout} className="btn btn-outline-secondary">
            Logout
          </button>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboardPage;
