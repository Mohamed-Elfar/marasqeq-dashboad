'use client';

import React from 'react';
import { Badge } from 'react-bootstrap';

const renderValue = value => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'object') {
    return (
      <pre className="mb-0 small bg-light p-2 rounded" style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  return <p className="mb-1">{String(value)}</p>;
};

const mediaSrcFromContent = content => content?.video || content?.videoUrl || content?.image || null;

const PagePreviewFrame = ({ page, selectedSectionId, onSectionSelect }) => {
  return (
    <div
      style={{
        border: '1px solid #dee2e6',
        borderRadius: 8,
        height: '65vh',
        overflowY: 'auto',
        backgroundColor: '#f8f9fa',
        padding: 12
      }}
    >
      {(page?.sections || []).map(section => {
        const isSelected = selectedSectionId === section.id;
        const mediaSrc = mediaSrcFromContent(section.content);
        const contentEntries = Object.entries(section.content || {});

        return (
          <div
            key={section.id}
            role="button"
            tabIndex={0}
            onClick={() => onSectionSelect(section.id)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSectionSelect(section.id);
              }
            }}
            className="mb-3"
            style={{
              border: isSelected ? '2px solid #0d6efd' : '1px solid #dee2e6',
              borderRadius: 8,
              backgroundColor: '#fff',
              padding: 12,
              cursor: 'pointer'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h6 className="mb-0">{section.name}</h6>
                <small className="text-muted">{section.type}</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Badge bg={section.visible ? 'success' : 'secondary'}>
                  {section.visible ? 'Visible' : 'Hidden'}
                </Badge>
                {isSelected && <Badge bg="primary">Editing</Badge>}
              </div>
            </div>

            {mediaSrc &&
              (String(mediaSrc).includes('.mp4') || String(mediaSrc).includes('youtube.com') ? (
                <video controls style={{ width: '100%', borderRadius: 8 }}>
                  <source src={mediaSrc} />
                </video>
              ) : (
                <img src={mediaSrc} alt={section.name} style={{ width: '100%', borderRadius: 8 }} />
              ))}

            <div className="mt-2">
              {contentEntries.slice(0, 4).map(([key, value]) => (
                <div key={key} className="mb-1">
                  <small className="text-muted d-block" style={{ textTransform: 'capitalize' }}>
                    {key}
                  </small>
                  {renderValue(value)}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PagePreviewFrame;
