import HomePage from '@/components/pages/HomePage';
import RoleSelectPage from '@/components/pages/RoleSelectPage';
import { authOptions } from '@/lib/auth';
import { Role } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession( authOptions );

  if (!session) {
    redirect("/api/auth/signin");    // Need to change this area
  }
  if(!session.user.role) {
    return <RoleSelectPage userName={`${session.user.name?.split(' ')[0]}`} />
  }else {
    return <HomePage role={session.user.role as Role} />
  }
}
