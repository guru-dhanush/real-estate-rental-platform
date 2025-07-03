import { Outfit } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Providers from './Providers';
import CookieConsentWrapper from '@/components/CookieConsent';
import { defaultMetadata } from './metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  // Additional metadata specific to the root layout can be added here
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`} itemScope itemType="https://schema.org/WebSite">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Dweltin',
              url: 'https://www.dweltin.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://www.dweltin.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          async
          defer
        ></script>
        <Providers>
          <ThemeProvider>
            <SidebarProvider>
              {children}
              <CookieConsentWrapper />
            </SidebarProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
