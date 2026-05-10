'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';
import IconifyIcon from '@/components/wrapper/IconifyIcon';

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const currentLanguage = i18n.language || 'en';

  return (
    <Dropdown className="d-inline-block">
      <Dropdown.Toggle
        variant="none"
        className="topbar-button d-flex align-items-center gap-2 content-none"
        id="language-dropdown"
      >
        <IconifyIcon icon="material-symbols:language" className="fs-22" />
        <span className="fw-medium">
          {currentLanguage === 'en' ? 'English' : 'العربية'}
        </span>
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        <Dropdown.Item
          active={currentLanguage === 'en'}
          onClick={() => changeLanguage('en')}
          className="d-flex align-items-center gap-2"
        >
          <IconifyIcon icon="circle-flags:uk" />
          <span>English</span>
        </Dropdown.Item>
        <Dropdown.Item
          active={currentLanguage === 'ar'}
          onClick={() => changeLanguage('ar')}
          className="d-flex align-items-center gap-2"
        >
          <IconifyIcon icon="circle-flags:eg" />
          <span>العربية</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageToggle;
