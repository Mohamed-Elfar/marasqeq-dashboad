'use client';

import IconifyIcon from '@/components/wrapper/IconifyIcon';

const WEBSITE_EDIT_URL = 'http://localhost:3000?edit=true&admin=true';

const GoToWebsiteEditButton = () => {
  const handleOpenWebsite = () => {
    window.open(WEBSITE_EDIT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="topbar-item">
      <button
        type="button"
        onClick={handleOpenWebsite}
        className="topbar-button"
        title="Go to website edit mode"
        aria-label="Go to website edit mode"
      >
        <IconifyIcon icon="ri:external-link-line" className="fs-22" />
      </button>
    </div>
  );
};

export default GoToWebsiteEditButton;
