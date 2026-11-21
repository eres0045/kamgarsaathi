import WorkerDetail from '@/components/WorkerDetail';

export function generateStaticParams() {
  return [{ id: 'ramesh' }, { id: 'arjun' }, { id: 'sunita' }];
}


export default async function WorkerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <WorkerDetail id={id} />;
}
