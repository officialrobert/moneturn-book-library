import type { ReactNode } from 'react';

import DialogProvider from './DialogProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return <DialogProvider>{children}</DialogProvider>;
}
