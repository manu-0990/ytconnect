import { getUser } from "@/lib/utils/get-user";
import { getAllProjectList } from "@/lib/utils/project";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getUser();
        const projects = await getAllProjectList(user.id);

        return NextResponse.json({ projects });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "An unexpected error occured." },
            { status: 500 }
        )
    }
}