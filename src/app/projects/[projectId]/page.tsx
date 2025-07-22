
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectRootPage({ params }: { params: { projectId: string } }) {
  const router = useRouter();

  useEffect(() => {
    if (params.projectId) {
      router.replace(`/projects/${params.projectId}/board`);
    }
  }, [router, params.projectId]);

  return null; 
}
