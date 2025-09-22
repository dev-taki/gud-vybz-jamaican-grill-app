import React from 'react';
import ClientBottomNav from '../components/ClientBottomNav';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {children}
      <ClientBottomNav />
    </div>
  );
}
