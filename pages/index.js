import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to the calculator - no email required!
    router.replace('/calculator');
  }, [router]);

  return <div>Redirecting to calculator...</div>;
} 