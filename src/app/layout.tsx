// The root layout is required and can't be deleted.
// Since we have a `[locale]` layout, this layout should be minimal.

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CareerFlow',
  description: 'Healthcare Jobs in Kuwait & Gulf',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
