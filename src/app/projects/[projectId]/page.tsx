
'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ProjectRootPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;

  useEffect(() => {
    if (projectId) {
      router.replace(`/projects/${projectId}/board`);
    }
  }, [router, projectId]);

  return null; 
}
