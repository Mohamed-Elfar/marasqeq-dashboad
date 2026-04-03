'use client';

import { SessionProvider } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { ToastContainer } from 'react-toastify';
import { SyncProvider } from '@/context/useSyncContext';
const LayoutProvider = dynamic(() => import('@/context/useLayoutContext').then(mod => mod.LayoutProvider), {
  ssr: false
});
const AppProvidersWrapper = ({
  children
}) => {
  return <SessionProvider>
      <LayoutProvider>
        <SyncProvider>
          {children}
          <ToastContainer theme="colored" />
        </SyncProvider>
      </LayoutProvider>
    </SessionProvider>;
};
export default AppProvidersWrapper;