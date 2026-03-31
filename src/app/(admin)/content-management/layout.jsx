import PageTitle from '@/components/PageTitle';
import React from 'react';

export const metadata = {
  title: 'Content Management | Maraseq - Content Management Dashboard'
};

const ContentManagementLayout = ({ children }) => {
  return (
    <>
      <PageTitle pageTitle="Website Content Management" />
      {children}
    </>
  );
};

export default ContentManagementLayout;
