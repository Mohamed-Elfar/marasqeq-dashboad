'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminLoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true') {
      router.replace('/content-management/pages/home');
    }
  }, [router]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    localStorage.setItem('isAdmin', 'true');
    router.push('/content-management/pages/home');
  };

  return (
    <main className="container py-5" style={{ maxWidth: 520 }}>
      <h1 className="mb-2">Admin Login</h1>
      <p className="text-muted mb-4">Simulated authentication for local CMS edit mode.</p>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
        <label htmlFor="admin-email" className="form-label">Email</label>
        <input
          id="admin-email"
          type="email"
          className="form-control mb-3"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="admin-password" className="form-label">Password</label>
        <input
          id="admin-password"
          type="password"
          className="form-control mb-4"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </main>
  );
};

export default AdminLoginPage;
