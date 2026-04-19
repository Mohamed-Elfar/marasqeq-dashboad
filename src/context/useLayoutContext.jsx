'use client';

import { createContext, use, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { toggleDocumentAttribute } from '@/utils/layout';
import useQueryParams from '@/hooks/useQueryParams';
import useLocalStorage from '@/hooks/useLocalStorage';
const ThemeContext = createContext(undefined);
const useLayoutContext = () => {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useLayoutContext can only be used within LayoutProvider');
  }
  return context;
};

// const getPreferredTheme = (): ThemeType => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

const LayoutProvider = ({
  children
}) => {
  const queryParams = useQueryParams();
  const override = !!(queryParams.layout_theme || queryParams.topbar_theme || queryParams.menu_theme || queryParams.menu_size);
  const INIT_STATE = {
    theme: queryParams['layout_theme'] ? queryParams['layout_theme'] : 'light',
    topbarTheme: queryParams['topbar_theme'] ? queryParams['topbar_theme'] : 'light',
    menu: {
      theme: queryParams['menu_theme'] ? queryParams['menu_theme'] : 'light',
      size: queryParams['menu_size'] ? queryParams['menu_size'] : 'default'
    }
  };
  const [settings, setSettings] = useLocalStorage('__REBACK_NEXT_CONFIG__', INIT_STATE, override);
  const [offcanvasStates, setOffcanvasStates] = useState({
    showThemeCustomizer: false,
    showActivityStream: false,
    showBackdrop: false
  });

  // update settings
  const updateSettings = _newSettings => setSettings({
    ...settings,
    ..._newSettings
  });

  // update theme mode
  const changeTheme = newTheme => {
    updateSettings({
      theme: newTheme
    });
  };

  // change topbar theme
  const changeTopbarTheme = newTheme => {
    updateSettings({
      topbarTheme: newTheme
    });
  };

  // change menu theme
  const changeMenuTheme = newTheme => {
    updateSettings({
      menu: {
        ...settings.menu,
        theme: newTheme
      }
    });
  };

  // change menu theme
  const changeMenuSize = newSize => {
    updateSettings({
      menu: {
        ...settings.menu,
        size: newSize
      }
    });
  };

  // toggle theme customizer offcanvas
  const toggleThemeCustomizer = () => {
    setOffcanvasStates({
      ...offcanvasStates,
      showThemeCustomizer: !offcanvasStates.showThemeCustomizer
    });
  };

  // toggle activity stream offcanvas
  const toggleActivityStream = () => {
    setOffcanvasStates({
      ...offcanvasStates,
      showActivityStream: !offcanvasStates.showActivityStream
    });
  };
  const themeCustomizer = {
    open: offcanvasStates.showThemeCustomizer,
    toggle: toggleThemeCustomizer
  };
  const activityStream = {
    open: offcanvasStates.showActivityStream,
    toggle: toggleActivityStream
  };

  const lastOpenedTime = useRef(0);

  // toggle backdrop
  const toggleBackdrop = useCallback(() => {
    const htmlTag = document.getElementsByTagName('html')[0];
    
    setOffcanvasStates(prev => {
      const isCurrentlyOpen = prev.showBackdrop;
      
      // Ghost click protection: ignore close requests within 400ms of opening
      if (isCurrentlyOpen) {
        if (Date.now() - lastOpenedTime.current < 400) {
          return prev; 
        }
        htmlTag.classList.remove('sidebar-enable');
      } else {
        lastOpenedTime.current = Date.now();
        htmlTag.classList.add('sidebar-enable');
      }
      
      return {
        ...prev,
        showBackdrop: !isCurrentlyOpen
      };
    });
  }, []);
  useEffect(() => {
    toggleDocumentAttribute('data-bs-theme', settings.theme);
    toggleDocumentAttribute('data-topbar-color', settings.topbarTheme);
    toggleDocumentAttribute('data-sidebar-color', settings.menu.theme);
    toggleDocumentAttribute('data-sidebar-size', settings.menu.size);
    return () => {
      toggleDocumentAttribute('data-bs-theme', settings.theme, true);
      toggleDocumentAttribute('data-topbar-color', settings.topbarTheme, true);
      toggleDocumentAttribute('data-sidebar-color', settings.menu.theme, true);
      toggleDocumentAttribute('data-sidebar-size', settings.menu.size, true);
    };
  }, [settings]);
  const resetSettings = () => updateSettings(INIT_STATE);
  return <ThemeContext.Provider value={useMemo(() => ({
    ...settings,
    themeMode: settings.theme,
    changeTheme,
    changeTopbarTheme,
    changeMenu: {
      theme: changeMenuTheme,
      size: changeMenuSize
    },
    themeCustomizer,
    activityStream,
    toggleBackdrop,
    showBackdrop: offcanvasStates.showBackdrop,
    resetSettings
  }), [settings, offcanvasStates])}>
      {children}
      {offcanvasStates.showBackdrop && <div className="offcanvas-backdrop fade show" onClick={toggleBackdrop} />}
    </ThemeContext.Provider>;
};
export { LayoutProvider, useLayoutContext };