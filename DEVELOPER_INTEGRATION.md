# Maraseq Dashboard CMS - Developer Integration Guide

## Overview

This guide shows how to integrate the CMS content with your website frontend. The CMS stores content in JSON files that your website frontend should fetch and display.

---

## Architecture

```
┌─────────────────────────┐
│  Maraseq Dashboard      │
│  (Content Management)   │
└──────────────┬──────────┘
               │
               ├─► /api/content/pages
               ├─► /api/content/items
               └─► /api/content/upload
               
               ↓ (Stores data to)
               
┌─────────────────────────┐
│  Data Storage           │
│ /public/content-data/   │
│  - pages.json           │
│  - items.json           │
│  - /uploads/*.jpg|png   │
└──────────────┬──────────┘
               │
               ↓ (Provides data to)
               
┌─────────────────────────┐
│  Maraseq Website        │
│  (Display Content)      │
└─────────────────────────┘
```

---

## Data Structure

### Pages Structure (`public/content-data/pages.json`)

```json
{
  "pages": [
    {
      "id": "home",
      "name": "Home",
      "url": "/",
      "sections": [
        {
          "id": "hero",
          "name": "Hero Section",
          "type": "hero",
          "visible": true,
          "content": {
            "title": "Welcome to Maraseq",
            "subtitle": "Find your perfect property",
            "image": "/img/hero-banner.jpg",
            "buttonText": "Get Started",
            "buttonUrl": "#"
          }
        },
        // ... more sections
      ]
    }
    // ... more pages
  ]
}
```

### Items Structure (`public/content-data/items.json`)

```json
{
  "properties": [
    {
      "id": "1234567890",
      "title": "Modern Apartment",
      "description": "Beautiful 3-bedroom apartment",
      "image": "/uploads/1704067200000-1234.jpg",
      "price": "500000",
      "location": "Downtown",
      "category": "Residential",
      "featured": true,
      "date": "2024-01-01"
    }
  ],
  "news": [
    {
      "id": "1234567891",
      "title": "Market Update",
      "description": "Latest market trends...",
      "image": "/uploads/1704067200000-5678.jpg",
      "category": "Updates",
      "featured": true,
      "date": "2024-01-01"
    }
  ]
}
```

---

## Integration Methods

### Method 1: Simple Fetch (Recommended for Basic Setup)

#### Fetch Page Content
```javascript
// pages/home/index.js (or pages/about/index.js, etc)
import { useState, useEffect } from 'react';
import fs from 'fs/promises';
import path from 'path';

export default function HomePage({ pageData }) {
  return (
    <div>
      {pageData.sections.map(section => (
        <Section key={section.id} section={section} />
      ))}
    </div>
  );
}

export async function getStaticProps() {
  try {
    const dataPath = path.join(process.cwd(), '../Maraseq-Dashboard/public/content-data/pages.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const { pages } = JSON.parse(data);
    const pageData = pages.find(p => p.id === 'home');

    return {
      props: {
        pageData: pageData || {}
      },
      revalidate: 60 // Regenerate every 60 seconds
    };
  } catch (error) {
    console.error('Error loading page data:', error);
    return {
      props: { pageData: {} },
      revalidate: 10
    };
  }
}

function Section({ section }) {
  if (!section.visible) return null;

  switch (section.type) {
    case 'hero':
      return <HeroComponent {...section.content} />;
    case 'about':
      return <AboutComponent {...section.content} />;
    case 'content':
      return <ContentComponent {...section.content} />;
    default:
      return null;
  }
}
```

#### Fetch Properties
```javascript
// pages/shop/index.js (or properties page)
export async function getStaticProps() {
  try {
    const dataPath = path.join(process.cwd(), '../Maraseq-Dashboard/public/content-data/items.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const { properties } = JSON.parse(data);

    return {
      props: {
        properties: properties || []
      },
      revalidate: 60
    };
  } catch (error) {
    return {
      props: { properties: [] },
      revalidate: 10
    };
  }
}
```

### Method 2: API Proxy (For Dynamic Updates)

#### Create Website API Routes
```javascript
// website/src/pages/api/cms/pages.js
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  try {
    const dataPath = path.join(
      process.cwd(),
      '../Maraseq-Dashboard/public/content-data/pages.json'
    );
    const data = await fs.readFile(dataPath, 'utf-8');
    const pages = JSON.parse(data);
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load pages' });
  }
}
```

#### Use in Frontend
```javascript
// pages/home/index.js
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cms/pages')
      .then(res => res.json())
      .then(data => {
        const home = data.pages.find(p => p.id === 'home');
        setPageData(home);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!pageData) return <div>No page data found</div>;

  return (
    <div>
      {pageData.sections.map(section => (
        <Section key={section.id} section={section} />
      ))}
    </div>
  );
}
```

### Method 3: Monorepo Shared Package (Best for Maintenance)

```
projects/work/Freelance/Maraseq/
├── shared-cms/           // New shared package
│   ├── package.json
│   └── lib/
│       ├── pages.js      // Export functions to fetch pages
│       ├── items.js      // Export functions to fetch items
│       └── types.ts      // TypeScript types
├── Maraseq-Dashboard/
├── Maraseq-website/
```

#### Shared Library
```javascript
// shared-cms/lib/pages.js
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../Maraseq-Dashboard/public/content-data');

export async function getAllPages() {
  const data = await fs.readFile(path.join(DATA_DIR, 'pages.json'), 'utf-8');
  return JSON.parse(data);
}

export async function getPageById(pageId) {
  const { pages } = await getAllPages();
  return pages.find(p => p.id === pageId);
}

export async function getPageSections(pageId) {
  const page = await getPageById(pageId);
  return page?.sections.filter(s => s.visible) || [];
}

export async function getSectionContent(pageId, sectionId) {
  const sections = await getPageSections(pageId);
  return sections.find(s => s.id === sectionId);
}
```

#### Use in Website
```javascript
// website/pages/home/index.js
import { getPageById } from 'shared-cms/lib/pages';

export default function HomePage({ pageData }) {
  return (
    <div>
      {pageData.sections.map(section => (
        <Section key={section.id} section={section} />
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const pageData = await getPageById('home');
  return {
    props: { pageData },
    revalidate: 60
  };
}
```

---

## Section Components

### Hero Section Component
```javascript
// components/HeroSection.jsx
export function HeroComponent({ title, subtitle, image, buttonText, buttonUrl }) {
  return (
    <div className="hero-section" style={{ backgroundImage: `url(${image})` }}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <a href={buttonUrl} className="btn">{buttonText}</a>
    </div>
  );
}
```

### About Section Component
```javascript
// components/AboutSection.jsx
export function AboutComponent({ title, description, image }) {
  return (
    <div className="about-section">
      <h2>{title}</h2>
      <p>{description}</p>
      {image && <img src={image} alt={title} />}
    </div>
  );
}
```

### Properties Component
```javascript
// components/PropertiesList.jsx
export function PropertiesList({ properties }) {
  const featured = properties.filter(p => p.featured);
  
  return (
    <div className="properties-grid">
      {featured.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

function PropertyCard({ property }) {
  return (
    <div className="property-card">
      <img src={property.image} alt={property.title} />
      <h3>{property.title}</h3>
      <p>{property.description}</p>
      <p className="price">${property.price}</p>
      <p className="location">{property.location}</p>
    </div>
  );
}
```

### News Component
```javascript
// components/NewsList.jsx
export function NewsList({ articles }) {
  return (
    <div className="news-grid">
      {articles.map(article => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}

function NewsCard({ article }) {
  return (
    <article className="news-card">
      <img src={article.image} alt={article.title} />
      <h3>{article.title}</h3>
      <p>{article.description}</p>
      <small>{article.date}</small>
    </article>
  );
}
```

---

## Environment Setup

### Add Path to Website (if in separate directory)

```javascript
// website/next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@cms': require('path').resolve(__dirname, '../Maraseq-Dashboard/public/content-data/'),
    };
    return config;
  },
};
```

### File Paths Reference

```
Current structure:
Maraseq/
├── Maraseq-Dashboard/
│   ├── public/
│   │   ├── content-data/
│   │   │   ├── pages.json
│   │   │   ├── items.json
│   │   │   └── uploads/
│   │   │       ├── 1704067200000-1234.jpg
│   │   │       ├── 1704067200000-5678.jpg
│   │   │       └── ...
│   │   └── ...
│   └── ...
├── Maraseq-website/
│   ├── src/
│   ├── pages/
│   └── ...
```

---

## Testing Integration

### Test Data Fetching
```javascript
// test-cms.js
import fs from 'fs/promises';
import path from 'path';

async function testCMS() {
  try {
    // Test pages
    const pagesPath = path.join(__dirname, '../Maraseq-Dashboard/public/content-data/pages.json');
    const pagesData = await fs.readFile(pagesPath, 'utf-8');
    const pages = JSON.parse(pagesData);
    console.log('✅ Pages loaded:', pages.pages.length, 'pages');

    // Test items  
    const itemsPath = path.join(__dirname, '../Maraseq-Dashboard/public/content-data/items.json');
    const itemsData = await fs.readFile(itemsPath, 'utf-8');
    const items = JSON.parse(itemsData);
    console.log('✅ Items loaded:', items.properties.length, 'properties,', items.news.length, 'news');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCMS();
```

---

## Deployment Considerations

### For Vercel/Netlify
1. Include `public/content-data/` in deployment
2. Ensure `public/uploads/` is included
3. Set proper file permissions for read access

### For Docker
```dockerfile
# In Dockerfile, copy CMS data
COPY ./Maraseq-Dashboard/public/content-data /app/public/content-data
COPY ./Maraseq-Dashboard/public/uploads /app/public/uploads
```

### For Production Database
Replace JSON file reading with database queries:
```javascript
// Use Supabase, Firebase, or MongoDB instead
const { data } = await supabase
  .from('pages')
  .select('*')
  .eq('id', 'home');
```

---

## Troubleshooting

### Data Not Updating
- Clear Next.js cache: `rm -rf .next`
- Set `revalidate: 0` for real-time updates (performance cost)
- Use ISR (Incremental Static Regeneration) with appropriate revalidation times

### Image Paths Wrong
- Ensure `public/uploads/` is served correctly
- Use relative paths: `/uploads/image.jpg`
- For external CDN, update image URLs to point to CDN domain

### JSON Parse Errors
- Validate JSON files are well-formed
- Create error handling for missing files
- Set default values for missing properties

---

## Best Practices

✅ **DO:**
- Cache page data appropriately (use revalidate)
- Filter out hidden sections (`section.visible`)
- Provide fallback UI if CMS data unavailable
- Test data loading in development

❌ **DON'T:**
- Directly read from dashboard production files
- Skip error handling for file reads
- Hardcode image paths
- Assume sections always exist

---

This integration guide provides everything needed to connect your website frontend with the CMS backend. Choose the method that best fits your project structure and deployment strategy.
