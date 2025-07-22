
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectRootPage({ params }: { params: { projectId: string } }) {
  const router = useRouter();
  const { projectId } = params;

  useEffect(() => {
    if (projectId) {
      router.replace(`/projects/${projectId}/board`);
    }
  }, [router, projectId]);

  return null; 
}
