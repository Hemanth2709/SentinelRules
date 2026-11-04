// SECURE EXAMPLE
// app/components/flash-message.tsx (Next.js client component)

'use client';

import { useSearchParams } from 'next/navigation';

// Shows ?message=... after a redirect, e.g. /dashboard?message=Saved
export function FlashMessage() {
  const message = useSearchParams().get('message');
  if (!message) return null;
  // React escapes text content, so markup in the message is shown as text.
  return (
    <div role="status">
      <strong>{message}</strong>
    </div>
  );
}
