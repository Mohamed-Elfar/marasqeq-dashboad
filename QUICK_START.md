# Maraseq Dashboard CMS - Quick Start Guide

## 🚀 Getting Started

Your dashboard has been upgraded with a powerful Content Management System (CMS) that allows you to manage all website content without touching any code or styles.

## 📋 What's New

### Dashboard Branding
- ✅ Updated with Maraseq logo and branding
- ✅ New favicon and brand colors
- ✅ Updated all references to "Maraseq"

### Content Management System
- ✅ Edit website pages (Home, About, FAQ, Contact, Blog)
- ✅ Manage property listings
- ✅ Manage news and blog articles
- ✅ Upload and manage images
- ✅ Toggle section visibility

## 🎯 Quick Start (5 Minutes)

### Step 1: Login to Dashboard
1. Navigate to your Maraseq Dashboard
2. Login with your admin credentials

### Step 2: Access Content Management
1. Look at the left sidebar
2. Click on **"Website Content"** menu
3. You'll see three options:
   - Manage Pages
   - Properties
   - News & Blog

### Step 3: Edit Your First Page - Home

1. Click **Website Content** → **Manage Pages** → **Home**
2. You'll see sections like:
   - Hero Section
   - About Us Section
   - Featured Properties
   - Services
   - Testimonials
   - Call to Action

3. Click **Edit** on any section to modify it
4. For example, edit the Hero Section:
   - Change the title
   - Update subtitle
   - Upload a new hero image
   - Update button text and link

5. Click **Save Changes** button
6. Done! The changes are saved

### Step 4: Add a Property

1. Click **Website Content** → **Properties**
2. Click **Add New Property**
3. Fill in:
   - Property title/address
   - Description
   - Upload property image
   - Set category (Residential, Commercial, etc.)
   - Add price and location
   - Check "Mark as Featured" if needed

4. Click **Save**

### Step 5: Add a News Article

1. Click **Website Content** → **News & Blog**
2. Click **Add New News Article**
3. Fill in your article details
4. Upload thumbnail image
5. Click **Save**

## 🖼️ Image Management

### Uploading Images

**Direct Upload:**
- Click on image upload field
- Select image from your computer
- See preview immediately
- Image is uploaded automatically

**Using URL:**
- Paste image URL directly
- Supports external URLs and `/uploads/` paths

**Supported Formats:** JPG, PNG, GIF, WebP (Max 5MB)

## 🔄 Publishing Content to Website

The CMS stores your content in:
- `public/content-data/pages.json` - Pages and sections
- `public/content-data/items.json` - Properties and news

**Your website should fetch from these files to display the managed content.**

## 📱 Managing Different Pages

| Page | What to Edit |
|------|-------------|
| **Home** | Hero banner, featured properties, testimonials |
| **About** | Company info, team, history |
| **FAQ** | Frequently asked questions |
| **Contact** | Contact form, phone, email, address |
| **Blog/News** | News articles and blog posts |

## ⚙️ Advanced Features

### Hide/Show Sections
- Each section has a **Visible** checkbox
- Uncheck to hide from website (doesn't delete it)
- Check to make visible again

### Edit vs Delete
- **Edit Button** - Modify section content
- **Delete Section** - Permanently remove section
- Use delete carefully - it cannot be undone

### Mark as Featured
- Properties and news can be marked as "Featured"
- Featured items appear in special sections on website

## ❓ Common Tasks

### I want to change the hero image on home page
1. Homepage → Edit Hero Section → Change Image → Save

### I want to add a new property listing
1. Website Content → Properties → Add New Property → Fill form → Save

### I want to hide a section temporarily
1. Find section → Uncheck "Visible" → That's it!

### I want to remove content permanently
1. Find section/item → Click Delete → Confirm

## 💡 Tips & Best Practices

✅ **DO:**
- Take time to craft good descriptions
- Use high-quality images (but keep file size reasonable)
- Mark important content as featured
- Regularly update news section
- Use consistent naming for categories

❌ **DON'T:**
- Don't modify HTML/CSS directly
- Don't upload huge files (keep images under 5MB)
- Don't delete sections you might need later (hide them instead)
- Don't forget to save changes

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Image won't upload | Check file size (max 5MB) and format |
| Changes don't appear on website | Rebuild website, clear cache |
| Can't find a page | Make sure it's in "Manage Pages" menu |
| Delete button missing | Some sections can't be deleted, hide them instead |

## 📖 Detailed Guide

For complete documentation, see: `CMS_GUIDE.md` in the dashboard folder

## 🎓 What Each Section Does

### Hero Section
- Large banner image at top of page
- Main title and call-to-action button

### About Section
- Company/page description
- Usually includes an image

### Featured Items
- Showcase special properties or content
- Configurable visibility

### Services/Info
- Lists services or information
- Contact details, hours, etc.

### Testimonials
- Customer reviews and feedback
- Display social proof

### Call to Action
- Encourages user action
- Button to take next step

---

**You're ready to go!** Start by editing the Home page sections and see how easy content management can be. 🎉

For support or questions, check the full documentation in `CMS_GUIDE.md`.
