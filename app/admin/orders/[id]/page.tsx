// Server component — allowed to export generateStaticParams.
// All interactive UI lives in AdminOrderDetailClient (a Client Component).

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

import AdminOrderDetailClient from './AdminOrderDetailClient';

export default function AdminOrderDetailPage() {
  return <AdminOrderDetailClient />;
}
