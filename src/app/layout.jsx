import '@/assets/scss/style.scss';
import AppProvidersWrapper from '@/components/wrapper/AppProvidersWrapper';
import { DEFAULT_PAGE_TITLE } from '@/context/constants';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  display: 'swap',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900']
});

export const metadata = {
  title: {
    template: '%s | Maraseq - Content Management Dashboard',
    default: DEFAULT_PAGE_TITLE
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://dashboard.maraseqgroup.com'),
  description: 'Maraseq Content Management Dashboard',
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/logo.svg',
    apple: '/logo.svg'
  },
  openGraph: {
    title: 'Maraseq - Content Management Dashboard',
    description: 'Maraseq Content Management Dashboard',
    images: [
      {
        url: '/logo.svg',
        alt: 'Maraseq Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maraseq - Content Management Dashboard',
    description: 'Maraseq Content Management Dashboard',
    images: ['/logo.svg']
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head></head>
      <body className={roboto.className}>
        <div id="__next_splash">
          <AppProvidersWrapper>
            {children}
          </AppProvidersWrapper>
        </div>
      </body>
    </html>
  );
}