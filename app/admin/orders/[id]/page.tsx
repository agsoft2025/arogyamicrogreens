import AdminOrderDetailClient from './AdminOrderDetailClient';

export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default function AdminOrderDetailPage() {
  return <AdminOrderDetailClient />;
}
