// Server component — allowed to export generateStaticParams.
// All interactive UI lives in MicrogreenDetailClient (a Client Component).

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ slug: 'placeholder' }];
}

import MicrogreenDetailClient from './MicrogreenDetailClient';

export default function MicrogreenDetailPage() {
  return <MicrogreenDetailClient />;
}
