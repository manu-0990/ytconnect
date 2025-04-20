import prisma from "@/db";
import { getUser } from "@/lib/utils/get-user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format." },
      { status: 400 }
    );
  }

  const userData = await prisma.user.findUnique({
    where: { email }
  })

  if (!userData) {
    return NextResponse.json(
      { error: "User not found." },
      { status: 404 }
    );
  };
  
  return NextResponse.json({
    status: 200,
    username: userData?.name
  })
}