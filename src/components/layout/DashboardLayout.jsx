'use client';

import Footer from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Container } from 'react-bootstrap';

const TopNavigationBar = dynamic(() => import('@/components/layout/TopNavigationBar/page'));
const VerticalNavigationBar = dynamic(() => import('@/components/layout/VerticalNavigationBar/page'));

export default function DashboardLayout({ children }) {
  return (
    <div className="wrapper">
      <Suspense>
        <TopNavigationBar />
      </Suspense>
      <VerticalNavigationBar />
      <div className="page-content">
        <Container fluid>{children}</Container>
        <Footer />
      </div>
    </div>
  );
}
