import React from 'react';
import AppMenu from './components/AppMenu';
import { getMenuItems } from '@/helpers/Manu';
import SimplebarReactClient from '@/components/wrapper/SimplebarReactClient';
import LogoBox from '@/components/wrapper/LogoBox';
const page = () => {
  const menuItems = getMenuItems();
  
  // Separate logout item from other menu items
  const logoutItem = menuItems.find(item => item.key === 'logout');
  const mainMenuItems = menuItems.filter(item => item.key !== 'logout');
  
  return <div className="app-sidebar">
      <LogoBox />
      <SimplebarReactClient className="scrollbar" data-simplebar>
        <AppMenu menuItems={mainMenuItems} />
      </SimplebarReactClient>
      {logoutItem && (
        <div className="sidebar-logout-section">
          <hr className="sidebar-divider" />
          <AppMenu menuItems={[logoutItem]} />
        </div>
      )}
    </div>;
};
export default page;