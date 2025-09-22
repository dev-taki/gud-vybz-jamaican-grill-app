import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: process.env.NEXT_PUBLIC_PWA_NAME!,
    short_name: process.env.NEXT_PUBLIC_PWA_SHORT_NAME!,
    description: process.env.NEXT_PUBLIC_PWA_DESCRIPTION!,
    start_url: '/',
    display: 'standalone',
    background_color: process.env.NEXT_PUBLIC_BACKGROUND_PRIMARY!,
    theme_color: process.env.NEXT_PUBLIC_PRIMARY_COLOR!,
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['business', 'productivity'],
    icons: [
      {
        src: process.env.NEXT_PUBLIC_PWA_ICON_192!,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: process.env.NEXT_PUBLIC_PWA_ICON_512!,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'Go to dashboard',
        url: '/admin/dashboard',
        icons: [
          {
            src: process.env.NEXT_PUBLIC_PWA_ICON_192!,
            sizes: '192x192'
          }
        ]
      },
      {
        name: 'Profile',
        short_name: 'Profile',
        description: 'View your profile',
        url: '/admin/profile',
        icons: [
          {
            src: process.env.NEXT_PUBLIC_PWA_ICON_192!,
            sizes: '192x192'
          }
        ]
      },
      {
        name: 'Plans',
        short_name: 'Plans',
        description: 'View available plans',
        url: '/plans',
        icons: [
          {
            src: process.env.NEXT_PUBLIC_PWA_ICON_192!,
            sizes: '192x192'
          }
        ]
      },
      {
        name: 'Redeem',
        short_name: 'Redeem',
        description: 'View redeem options',
        url: '/redeem',
        icons: [
          {
            src: process.env.NEXT_PUBLIC_PWA_ICON_192!,
            sizes: '192x192'
          }
        ]
      }
    ]
  };

  return NextResponse.json(manifest);
}
