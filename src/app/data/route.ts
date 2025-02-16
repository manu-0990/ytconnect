// import { NextResponse } from 'next/server';
// import prisma from '@/db/index';
import { signOut } from "next-auth/react";


export async function GET() {
    signOut();
//     try {
//         const accounts = await prisma.account.findMany();

//         // const user = await prisma.user.findUnique({
//         //     where: {
//         //         email: 'garenagamer464@gmail.com'
//         //     }
//         // });

//         if (accounts) {
//             return NextResponse.json(accounts);
//         } else {
//             return NextResponse.json({ message: 'User not found' }, { status: 404 });
//         }
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
//     }
}

