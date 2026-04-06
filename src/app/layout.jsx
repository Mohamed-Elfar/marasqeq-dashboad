import '@/assets/scss/style.scss';
import AppProvidersWrapper from '@/components/wrapper/AppProvidersWrapper';
import { DEFAULT_PAGE_TITLE } from '@/context/constants';
import favIcon from '@/assets/images/fav.svg';
import { Roboto } from 'next/font/google';
import Footer from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Container } from 'react-bootstrap';

const TopNavigationBar = dynamic(() => import('@/components/layout/TopNavigationBar/page'));
const VerticalNavigationBar = dynamic(() => import('@/components/layout/VerticalNavigationBar/page'));

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
  description: 'Maraseq Content Management Dashboard',
  icons: {
    icon: [
      { url: favIcon.src, type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: favIcon.src,
    apple: favIcon.src
  }
};
export default function RootLayout({
  children
}) {
  return <html lang="en">
      <head></head>
      <body className={roboto.className}>
        <div id="__next_splash">
          <AppProvidersWrapper>
            <div className="wrapper">
              <Suspense>
                <TopNavigationBar />
              </Suspense>
              <VerticalNavigationBar />
              <div className="page-content">
                <Container fluid>{children}</Container>
                <Footer />
              </div>
            </div>
          </AppProvidersWrapper>
        </div>
      </body>
    </html>;
}