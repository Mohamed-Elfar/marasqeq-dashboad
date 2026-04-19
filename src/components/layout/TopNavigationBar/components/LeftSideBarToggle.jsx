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
    toggleBackdrop,
    showBackdrop
  } = useLayoutContext();
  const pathname = usePathname();
  const {
    width
  } = useViewPort();
  const lastPathname = useRef(pathname);

  // Use refs for stable access in useEffect without triggering re-runs
  const changeMenuSizeRef = useRef(changeMenuSize);
  changeMenuSizeRef.current = changeMenuSize;
  const toggleBackdropRef = useRef(toggleBackdrop);
  toggleBackdropRef.current = toggleBackdrop;
  const showBackdropRef = useRef(showBackdrop);
  showBackdropRef.current = showBackdrop;
  const sizeRef = useRef(size);
  sizeRef.current = size;

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
    if (width <= 1140) {
      if (sizeRef.current !== 'hidden') {
        changeMenuSizeRef.current('hidden');
      }

      // Close mobile overlay ONLY on route changes.
      if (pathname !== lastPathname.current) {
        if (showBackdropRef.current) {
          toggleBackdropRef.current();
        }
        lastPathname.current = pathname;
      }
      return;
    }

    // Returning to desktop should restore normal default/condensed behavior.
    if (sizeRef.current === 'hidden') {
      if (showBackdropRef.current) {
        toggleBackdropRef.current();
      }
      changeMenuSizeRef.current('default');
    }
    
    // Always sync pathname on desktop to prevent sudden closures when resizing back to mobile
    lastPathname.current = pathname;
  }, [pathname, width]);
  return <div className="topbar-item">
      <button type="button" onClick={handleMenuSize} className="button-toggle-menu topbar-button">
        <IconifyIcon icon="solar:hamburger-menu-outline" width={24} height={24} className="fs-24  align-middle" />
      </button>
    </div>;
};
export default LeftSideBarToggle;