import CreatorPage from '@/components/pages/CreatorPage';
import EditorPage from '@/components/pages/EditorPage';
import RoleSelectPage from '@/components/pages/RoleSelectPage';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession( authOptions );

  if (!session) {
    redirect("/api/auth/signin");    // Need to change this area
  }
  if(!session.user.role) {
    return <RoleSelectPage userName={`${session.user.name?.split(' ')[0]}`} />
  } else if (session.user?.role === "CREATOR") {
    return <CreatorPage />
  } else if (session.user?.role === "EDITOR") {
    return <EditorPage />
  }
}
