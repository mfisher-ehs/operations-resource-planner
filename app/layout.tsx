import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Operations Resource Planner', description: 'Synthetic resource scheduling dashboard' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
