import { Inter } from 'next/font/google';

// Setting up the Inter font from Google
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

// Updated SEO Metadata for your website
export const metadata = {
  title: 'ListingLens — Airbnb Listing Intelligence',
  description: 'AI-powered audit for Airbnb hosts. Score, fix, and outrank competitors.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body 
        style={{ 
          fontFamily: "var(--font-inter, system-ui)", 
          margin: 0,
          background: '#f9fafb' // Keeping your light background
        }}
      >
        {children}
      </body>
    </html>
  );
}
