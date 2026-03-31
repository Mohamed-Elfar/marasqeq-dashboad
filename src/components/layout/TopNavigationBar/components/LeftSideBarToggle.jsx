'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLayoutContext } from '@/context/useLayoutContext';
import IconifyIcon from '@/components/wrapper/IconifyIcon';
import useViewPort from '@/hooks/useViewPort';
const LeftSideBarToggle = () => {
  const {
    menu: {
      size
    },
    changeMenu: {
      size: changeMenuSize
    },
    toggleBackdrop
  } = useLayoutContext();
  const pathname = usePathname();
  const {
    width
  } = useViewPort();
  const isFirstRender = useRef(true);
  const handleMenuSize = () => {
    // Mobile: keep sidebar hidden and only open/close with backdrop overlay.
    if (width <= 1140) {
      toggleBackdrop();
      return;
    }

    // Desktop: if the menu is hidden from a previous mobile state, restore default first.
    if (size === 'hidden') {
      changeMenuSize('default');
      return;
    }

    if (size === 'condensed') changeMenuSize('default');else if (size === 'default') changeMenuSize('condensed');
  };
  useEffect(() => {
    const htmlTag = document.getElementsByTagName('html')[0];

    if (width <= 1140) {
      if (size !== 'hidden') {
        changeMenuSize('hidden');
      }

      // Close mobile overlay on route changes.
      if (!isFirstRender.current && htmlTag.classList.contains('sidebar-enable')) {
        toggleBackdrop();
      }

      isFirstRender.current = false;
      return;
    }

    // Returning to desktop should restore normal default/condensed behavior.
    if (size === 'hidden') {
      if (htmlTag.classList.contains('sidebar-enable')) {
        toggleBackdrop();
      }
      changeMenuSize('default');
    }
  }, [pathname, width, size, changeMenuSize, toggleBackdrop]);
  return <div className="topbar-item">
      <button type="button" onClick={handleMenuSize} className="button-toggle-menu topbar-button">
        <IconifyIcon icon="solar:hamburger-menu-outline" width={24} height={24} className="fs-24  align-middle" />
      </button>
    </div>;
};
export default LeftSideBarToggle;