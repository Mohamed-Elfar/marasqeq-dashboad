'use client';

import dynamic from 'next/dynamic';
import { ToastContainer } from 'react-toastify';

const LayoutProvider = dynamic(() => import('@/context/useLayoutContext').then(mod => mod.LayoutProvider), {
  ssr: false
});

const AppProvidersWrapper = ({
  children
}) => {
  return <LayoutProvider>
      {children}
      <ToastContainer theme="colored" />
    </LayoutProvider>;
};
export default AppProvidersWrapper;