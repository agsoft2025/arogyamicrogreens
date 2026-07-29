// Server component — allowed to export generateStaticParams.
// All interactive UI lives in EditSubscriptionPlanClient (a Client Component).

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

import EditSubscriptionPlanClient from './EditSubscriptionPlanClient';

export default function EditSubscriptionPlanPage() {
  return <EditSubscriptionPlanClient />;
}
