import { getUser } from "@/lib/utils/get-user";
import { createReviewWithProjectId, updateProjectStatus } from "@/lib/utils/project";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Body {
    projectId: number;
    status: 'PENDING' | 'REJECTED' | 'REVIEW';
    reviewData: {
        title: string;
        description: string;
    }
}

export async function PATCH(req: NextRequest) {
    const user = await getUser();

    try {
        const { projectId, status, reviewData }: Body = await req.json();

        if (!projectId || !status) {
            return NextResponse.json(
                { error: "projectId and status are required fields." },
                { status: 204 }
            );
        }
        if (status !== 'PENDING' && status !== 'REJECTED' && status !== 'REVIEW') {
            return NextResponse.json(
                { message: "Status must be `ACCEPTED`, `REJECTED` OR `REVIEW`." },
                { status: 400 }
            );
        };

        const updatedProject = status !== 'REVIEW' ?
            await updateProjectStatus(projectId, status, user.id, user.role as Role) :
            await createReviewWithProjectId(projectId, user.id, { title: reviewData.title, description: reviewData.description });


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