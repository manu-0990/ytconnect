import { NextResponse } from "next/server";
import { getUser } from "@/lib/utils/get-user";
import { getPendingProjects } from "@/lib/utils/project";

export async function GET() {
  try {
    const user = await getUser();

    const projects = await getPendingProjects(user.id);

    return NextResponse.json({ projects });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
