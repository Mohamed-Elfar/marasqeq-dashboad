# Create Admin User in Supabase

## Option 1: Using Supabase SQL Editor (Recommended)

1. Go to https://supabase.com/dashboard/project/cmdaduhxxqeswuwckhcu
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**
4. Paste this SQL:

```sql
-- First, delete any existing users (optional)
DELETE FROM auth.users;

-- Create admin user with confirmed email
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@maraseq.com',
  crypt('Admin123456!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

## Option 2: Check Authentication Settings

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. **Uncheck** "Confirm email" 
4. **Uncheck** "Secure email change"
5. Click **Save**

## Option 3: Check Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://dashboard.maraseqgroup.com`
3. Add to **Redirect URLs**:
   - `https://dashboard.maraseqgroup.com/**`
   - `http://localhost:3000/**`
4. Click **Save**

## Test Login

After running the SQL:
- Email: `admin@maraseq.com`
- Password: `Admin123456!`

## If Still Not Working

Check the browser console for the exact error and share it with me.
