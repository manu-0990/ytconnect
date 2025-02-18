import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import CreatorPage from '@/components/creator/page';
import EditorPage from '@/components/editor/page';

export default async function Dashboard() {
  const session = await getServerSession( authOptions );

  if (!session) {
    redirect("/auth/signin");
  }
  if(!session.user.role) {
    redirect("/auth/role-select");
  } else if (session.user?.role === "CREATOR") {
    return <CreatorPage />
  } else if (session.user?.role === "EDITOR") {
    return <EditorPage />
  }
}

