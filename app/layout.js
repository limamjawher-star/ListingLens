export const metadata = {
  title: 'ListingLens — Airbnb Listing Auditor',
  description: 'Find out exactly why your Airbnb listing is not ranking higher.',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body style={{ margin: 0, background: '#f9fafb' }}>{children}</body>
    </html>
  );
}
