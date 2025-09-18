import Header from '@/components/headers/header';
import type { ReactNode } from 'react';
import { Bitcount } from '../helpers/fonts/fonts';
import './globals.css';
import { Providers } from '../helpers/layouts/wallet_providers';
import { UserSyncProvider } from '../helpers/layouts/state_manager_provider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={Bitcount.className} lang="en">
      <body className="bg-[#F9FAFB]">
        <Providers>
          <UserSyncProvider>
            <Header />
            <div className="h-20" />
            <div className="sm:px-20 md:px-28 lg:px-40 xl:px-60 px-5 mt-20">
              {children}
            </div>
          </UserSyncProvider>
        </Providers>
      </body>
    </html>
  );
}