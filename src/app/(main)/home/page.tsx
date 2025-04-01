import CreatorPage from '@/components/ui/pages/CreatorPage';
import EditorPage from '@/components/ui/pages/EditorPage';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession( authOptions );

  if (!session) {
    redirect("/api/auth/signin");    // Need to change this area
  }
  if(!session.user.role) {
    redirect("/auth/role-select");
  } else if (session.user?.role === "CREATOR") {
    return <CreatorPage />
  } else if (session.user?.role === "EDITOR") {
    return <EditorPage />
  }
}
