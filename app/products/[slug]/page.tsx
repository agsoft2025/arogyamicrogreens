// Server component — allowed to export generateStaticParams.
// All interactive UI lives in ProductDetailClient (a Client Component).

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ slug: 'placeholder' }];
}

import ProductDetailClient from './ProductDetailClient';

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
