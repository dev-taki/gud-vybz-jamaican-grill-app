'use client';

import { ReduxProvider } from './providers/ReduxProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
