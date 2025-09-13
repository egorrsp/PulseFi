import Header from '@/components/headers/header';
import type { ReactNode } from 'react';
import { Bitcount } from '../helpers/fonts';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html className={Bitcount.className} lang="en">
      <body className='bg-[#F9FAFB]'>
        <Header />
        <div className='h-20' />
        <div className='sm:px-20 md:px-28 lg:px-40 xl:px-60 px-5'>
          {children}
        </div>
      </body>
    </html>
  );
}