import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import CreatorPage from '@/components/creator/page';
import EditorPage from '@/components/editor/page';
import SelectRole from '@/components/select-role/page';

export default async function Dashboard() {
  const session = await getServerSession( authOptions );

  if (!session) {
    redirect("/api/auth/signin");
  }
  if(!session.user.role) {
    return <SelectRole />
  } else if (session.user?.role === "CREATOR") {
    return <CreatorPage />
  } else if (session.user?.role === "EDITOR") {
    return <EditorPage />
  }
}

