import prisma from "@/db";
import { NotificationType, Role } from "@prisma/client";

export interface CreateProjectInput {
    thumbnails?: { id: number; imageLink: string }[];
    title: string;
    description?: string;
    videoLink: string;
    editorId: number;
    creatorId: number;
    status?: "PENDING" | "REVIEW" | "ACCEPTED" | "REJECTED";
}

export async function createProjectWithVideo({ input, senderId, sender, recipientId }: { input: CreateProjectInput, senderId: number, sender: string, recipientId: number }) {
    const { thumbnails, title, description, videoLink, editorId, creatorId } = input;

    const result = await prisma.$transaction(async (prisma) => {

        // Create the video record.
        const video = await prisma.video.create({
            data: {
                title,
                description,
                videoLink,
                editorId,
                projectId: 0, // temporary placeholder; will update below
            },
        });

        //Create thumbnail records with videoId
        thumbnails && await Promise.all(
            thumbnails.map(obj => prisma.thumbnail.create({
                data: {
                    id: obj.id,
                    videoId: video.id,
                    url: obj.imageLink
                }
            }))
        );

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

        // Register a new notification for the project
        await prisma.notification.create({
            data: {
                type: NotificationType.PROJECT_CREATED,
                message: `New project created by ${sender}`,
                recipientId,
                senderId
            }
        })

        return { project, video: updatedVideo };
    });

    return result;
}

export async function updateProjectStatus(projectId: number, status: 'ACCEPTED' | 'REJECTED' | 'PENDING', senderId: number, role: Role) {
    try {
        const updatedProject = await prisma.$transaction(async (tx) => {

            const project = await tx.project.findUnique({
                where: { id: projectId },
                select: {
                    creatorId: true,
                    editorId: true,
                    video: {
                        select: { title: true }
                    }
                }
            });

            if (!project) {
                throw new Error(`Project with ID ${projectId} not found.`);
            }

            let recipientId: number;
            if (senderId === project.creatorId) {
                recipientId = project.editorId;
                const senderUser = await tx.user.findUnique({ where: { id: senderId }, select: { role: true } });
                if (senderUser?.role !== Role.CREATOR) {
                    throw new Error(`Sender ${senderId} is the project creator but does not have CREATOR role.`);
                }
            } else if (senderId === project.editorId) {
                recipientId = project.creatorId;
                const senderUser = await tx.user.findUnique({ where: { id: senderId }, select: { role: true } });
                if (senderUser?.role !== Role.EDITOR) {
                    throw new Error(`Sender ${senderId} is the project editor but does not have EDITOR role.`);
                }
            } else {
                throw new Error(`Sender ${senderId} is not authorized to update status for project ${projectId}.`);
            }

            const updatedProjectResult = await tx.project.update({
                where: { id: projectId },
                data: { status: status }
            });

            const projectTitle = project.video?.title ?? `Project ${projectId}`;
            await tx.notification.create({
                data: {
                    type: NotificationType.PROJECT_STATUS_UPDATE,
                    message: `Status of project "${projectTitle}" was updated to ${status}.`,
                    senderId: senderId,
                    recipientId: recipientId,
                    projectId: projectId
                }
            });

            return updatedProjectResult;
        });

        return updatedProject;
    } catch (error: any) {
        console.error("Error updating project status:", error);
        throw new Error("Failed to update project status.");
    }
}

export async function updateVideoDetails(videoId: number, details: { title: string, description: string, videoLink: string, thumbnails?: { id: number, url: string }[] }) {
    try {
        const updatedProject = await prisma.$transaction(async () => {
            const updatedVideo = await prisma.video.update({
                where: { id: videoId },
                data: {
                    title: details.title,
                    description: details.description,
                    videoLink: details.videoLink,
                    ...(details.thumbnails && {
                        thumbnail: {
                            deleteMany: {},
                            create: details.thumbnails.map(thumbnail => ({
                                id: thumbnail.id,
                                url: thumbnail.url,
                            })),
                        },
                    }),
                },
            });

            const projectStatus = await prisma.project.update({
                where: { videoId: videoId },
                data: {
                    status: "PENDING"
                }
            })
            const existingReview = await prisma.review.findUnique({
                where: { projectId: projectStatus.id }
            });

            if (existingReview) {
                await prisma.review.delete({
                    where: { projectId: projectStatus.id }
                });
            }
            return { updatedVideo, projectStatus };

        });

        return updatedProject;
    } catch (error: any) {
        console.error("Error updating video details:", error);
        throw new Error("Failed to update video details.");
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
            video: {
                include: {
                    thumbnail: true,
                }
            }
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
            video: {
                include: {
                    thumbnail: true,
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return projects;
}

export async function getProjectDetails(projectID: number) {
    const projectDetails = await prisma.project.findFirst({
        where: { id: projectID },
        include: {
            video: {
                include: {
                    thumbnail: true,
                },
            },
            reviews: true
        }
    });
    return projectDetails;
}

export async function createReviewWithProjectId(projectId: number, senderId: number, reviewData: { title: string; description?: string; }) {
    try {
        const projectExists = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!projectExists) {
            throw new Error(`Project with ID ${projectId} does not exist.`);
        };

        const result = await prisma.$transaction(async (tx) => {
            const review = await tx.review.create({
                data: {
                    projectId,
                    title: reviewData.title,
                    description: reviewData.description ?? ""
                }
            });

            const project = await tx.project.update({
                where: { id: projectId },
                data: { status: 'REVIEW' }
            });

            await tx.notification.create({
                data: {
                    type: NotificationType.NEW_REVIEW,
                    message: `A new issue is created by the creator.`,
                    senderId,
                    recipientId: await tx.editor.findFirst({ where: { creatorId: senderId } }).then(res => res?.id as number),
                }
            });

            return { review, project };
        })

        return result;
    } catch (err: any) {
        console.error('Failed to create review: ', err);
        throw new Error('Failed to create review: ');
    }
}
