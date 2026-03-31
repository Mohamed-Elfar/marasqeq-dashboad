# Maraseq Dashboard - Content Management System Guide

## Overview

The Maraseq Dashboard now includes a complete Content Management System (CMS) that allows administrators to manage website content without changing styles or positions. The CMS is specifically designed for managing:

1. **Website Pages** (Home, About, FAQ, Contact, Blog)
2. **Properties Listings**
3. **News & Blog Articles**

## Features

### ✨ Main Features

- **Page Content Editing**: Edit individual page sections with ease
- **Image Management**: Upload and manage images directly from the dashboard
- **Visibility Control**: Show/hide sections without deleting them
- **Properties Management**: Add, edit, and delete property listings
- **News Management**: Create and manage blog posts/news articles
- **Simple Interface**: Intuitive forms for different section types
- **Auto-save**: All changes are saved to local storage

## How to Use

### 1. Managing Website Pages

#### Accessing Page Management
1. Login to the admin dashboard
2. Navigate to **Website Content** in the sidebar
3. Click **Manage Pages**
4. Choose a page to edit:
   - Home
   - About
   - FAQ
   - Contact
   - Blog/News

#### Editing Page Sections

Each page contains multiple sections that you can edit:

**For Hero Sections:**
- Title
- Subtitle
- Hero Image (upload or enter URL)
- Button Text
- Button URL

**For Content Sections:**
- Title
- Description/Body Text
- Section Image (where applicable)

**For Contact Information:**
- Phone
- Email
- Address

#### Making Sections Visible/Hidden

Each section has a **Visible** checkbox in the header. You can:
- Keep sections visible by checking the box
- Hide sections by unchecking the box (section won't appear on website)
- Changes are saved immediately

#### Saving Changes

1. Click the **Edit** button on any section
2. Make your changes
3. Click **Save Changes** button
4. To cancel, click **Cancel**
5. Use **Delete Section** to remove a section entirely

### 2. Managing Properties

#### Adding a Property

1. Navigate to **Website Content** → **Properties**
2. Click **Add New Property** button
3. Fill in the following details:
   - **Title**: Property name/address
   - **Description**: Full property details
   - **Image**: Upload property photo
   - **Category**: e.g., "Residential", "Commercial", "Land"
   - **Price**: Property price
   - **Location**: City/area
   - **Date**: Listing date
   - **Mark as Featured**: Check to show in featured section

4. Click **Save** button

#### Editing a Property

1. Find the property in the table
2. Click **Edit** button
3. Update the information
4. Click **Save**

#### Deleting a Property

1. Find the property in the table
2. Click **Delete** button
3. Confirm the deletion

### 3. Managing News & Blog Articles

#### Adding a News Article

1. Navigate to **Website Content** → **News & Blog**
2. Click **Add New News Article** button
3. Fill in the following details:
   - **Title**: Article headline
   - **Description**: Article content
   - **Image**: Article thumbnail (upload or URL)
   - **Category**: e.g., "Real Estate Tips", "Market Update"
   - **Date**: Publication date
   - **Mark as Featured**: Check to highlight on website

4. Click **Save** button

#### Editing a News Article

1. Find the article in the table
2. Click **Edit** button
3. Update the information
4. Click **Save**

#### Deleting a News Article

1. Find the article in the table
2. Click **Delete** button
3. Confirm the deletion

## Image Management

### Uploading Images

The CMS supports multiple ways to add images:

**Method 1: Upload from Your Computer**
1. Click on the upload field
2. Select an image from your device
3. Wait for the upload to complete
4. The image will appear in a preview

**Method 2: Use Image URL**
1. Enter the full URL in the image URL field
2. Examples:
   - `/uploads/property-01.jpg` (uploaded images)
   - `https://example.com/image.jpg` (external URLs)

**Supported Formats:**
- JPG, JPEG
- PNG
- GIF
- WebP

**File Size Limit:** 5 MB

### Image Preview

All uploaded images show a preview in the editor so you can verify before saving.

## Data Storage

The CMS stores all data in JSON files located in:
- `public/content-data/pages.json` - Website page content
- `public/content-data/items.json` - Properties and news
- `public/uploads/` - Uploaded images

**Note**: These files are stored locally. For production, consider integrating with a proper database (like Supabase or Firebase).

## Important Notes

⚠️ **Important:**
- Only edit content and images. Do NOT modify:
  - Page layouts
  - CSS styles
  - Component positions
- To permanently delete a section, click the "Delete Section" button
- Changes are saved in real-time to preserve your work
- Regular backups of the `public/content-data/` folder are recommended

## Troubleshooting

**Problem: Image upload fails**
- Solution: Check file size (must be under 5MB) and format (JPG, PNG, GIF, WebP)

**Problem: Changes not saving**
- Solution: Check your internet connection and try again
- Refresh the page and verify if changes were saved

**Problem: Cannot see updated content on website**
- Solution: Clear your browser cache (Ctrl+Shift+Delete)
- Rebuild the website if necessary

## API Endpoints (For Developers)

- `GET /api/content/pages` - Fetch all pages
- `POST /api/content/pages` - Save page
- `GET/POST/DELETE /api/content/items` - Manage properties and news
- `POST /api/content/upload` - Upload images

## Branding Updates

The dashboard now displays:
- **Logo**: Maraseq Logo (logo.svg)
- **Favicon**: Maraseq Icon (favicon.ico)
- **Brand Name**: Maraseq throughout the interface

---

**Need Help?** Contact your development team for additional support or feature requests.
