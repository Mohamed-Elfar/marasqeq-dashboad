'use client';

import { SessionProvider } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { ToastContainer } from 'react-toastify';

const LayoutProvider = dynamic(() => import('@/context/useLayoutContext').then(mod => mod.LayoutProvider), {
  ssr: false
});

const AppProvidersWrapper = ({
  children
}) => {
  return <SessionProvider>
      <LayoutProvider>
        {children}
        <ToastContainer theme="colored" />
      </LayoutProvider>
    </SessionProvider>;
};
export default AppProvidersWrapper;