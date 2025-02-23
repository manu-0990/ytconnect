import { updateProjectStatus } from "@/lib/utils/project";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    try {
        const { projectid, status } = await req.json();

        if (!projectid || !status) {
            return NextResponse.json(
                { error: "projectId and status are required fields." },
                { status: 204 }
            );
        }
        if (status !== 'ACCEPTED' && status !== 'REJECTED') {
            return NextResponse.json(
                { message: "Status must be `ACCEPTED` or `REJECTED`." },
                { status: 400 }
            );
        }

        const updatedProject = await updateProjectStatus(projectid, status);

        return NextResponse.json({
            message: "Status updated successfully.",
            poject: updatedProject,
            status: 200
        });
    } catch (error: any) {
        console.error("Error in update-status route:", error);
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred." },
            { status: 500 }
        );
    }
}