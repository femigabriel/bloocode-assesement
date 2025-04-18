import './globals.css';
import QueryClientWrapper from './QueryClientWrapper';

export const metadata = {
  title: 'naija podcast',
  description: 'Naija Podcasts Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <link href='https://fonts.cdnfonts.com/css/montserrat' rel='stylesheet' />
        <link rel='icon' type='image/svg+xml' href='/assets/images/ABR Logo 1.svg' />
      </head>
      <body>
        <QueryClientWrapper>{children}</QueryClientWrapper>
      </body>
    </html>
  );
}