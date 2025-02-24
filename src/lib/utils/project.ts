import prisma from "@/db";

export interface CreateProjectInput {
    thumbnail?: string;
    title?: string;
    description?: string;
    videoLink: string;
    editorId: number;
    creatorId: number;
    status?: "PENDING" | "ACCEPTED" | "REJECTED";
}

export async function createProjectWithVideo(input: CreateProjectInput) {
    const { thumbnail, title, description, videoLink, editorId, creatorId } = input;

    const result = await prisma.$transaction(async (prisma) => {
        // Create the video record.
        const video = await prisma.video.create({
            data: {
                thumbnail,
                title,
                description,
                videoLink,
                editorId,
                projectId: 0, // temporary placeholder; will update below
            },
        });

        // Create the project referencing the video.
        const project = await prisma.project.create({
            data: {
                editorId,
                creatorId,
                videoId: video.id,
            },
        });

        // Update the video record with the projectId.
        const updatedVideo = await prisma.video.update({
            where: { id: video.id },
            data: { projectId: project.id },
        });

        return { project, video: updatedVideo };
    });

    return result;
}

export async function updateProjectStatus(projectid: number, status: 'ACCEPTED' | 'REJECTED') {

    try {
        const updatedProject = await prisma.project.update({
            where: { id: projectid },
            data: { status }
        });
        return updatedProject;
    } catch (error: any) {
        console.error("Error updating project status:", error);
        throw new Error("Failed to update project status.");
    }
}

export async function getAllProjectList(userId: number) {
    const projects = await prisma.project.findMany({
        where: {
            OR: [
                { creatorId: userId },
                { editorId: userId }
            ]
        },
        include: {
            video: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return projects;
}

export async function getPendingProjects(userId: number) {
    const projects = await prisma.project.findMany({
        where: {
            status: "PENDING",
            OR: [
                { creatorId: userId },
                { editorId: userId }
            ]
        },
        include: {
            video: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return projects;
}