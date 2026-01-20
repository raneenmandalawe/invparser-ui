import './globals.css';

export const metadata = {
  title: 'InvoiceParser',
  description: 'Modern invoice parsing and management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
