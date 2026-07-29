import EditSubscriptionPlanClient from './EditSubscriptionPlanClient';

export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default function EditSubscriptionPlanPage() {
  return <EditSubscriptionPlanClient />;
}
