import prisma from "@/db";
import { NotificationType, Role, Status } from "@prisma/client";

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

export async function updateProjectStatus(projectId: number, status: 'ACCEPTED' | 'REJECTED' | 'PENDING', senderId: number) {
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

export async function updateVideoDetails(senderId: number, videoId: number, details: { title: string, description: string, videoLink: string, thumbnails?: { id: number, url: string }[] }) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const videoWithProject = await tx.video.findUnique({
                where: { id: videoId },
                include: {
                    Project: {
                        select: {
                            id: true,
                            creatorId: true,
                            editorId: true,
                        }
                    }
                }
            });

            if (!videoWithProject) {
                throw new Error(`Video with ID ${videoId} not found.`);
            }
            if (!videoWithProject.Project) {
                throw new Error(`Project associated with video ID ${videoId} not found.`);
            }

            const projectInfo = videoWithProject.Project;
            const isActorCreator = senderId === projectInfo.creatorId;
            const isActorEditor = senderId === projectInfo.editorId;

            if (!isActorCreator && !isActorEditor) {
                throw new Error(`User ${senderId} is not authorized to update details for video ${videoId} (not project creator or editor).`);
            }

            const recipientId = isActorCreator ? projectInfo.editorId : projectInfo.creatorId;

            const updatedVideo = await tx.video.update({
                where: { id: videoId },
                data: {
                    title: details.title,
                    description: details.description,
                    videoLink: details.videoLink,
                    ...(details.thumbnails !== undefined && {
                        thumbnail: {
                            deleteMany: {},
                            create: details.thumbnails.map(thumbnail => ({
                                id: thumbnail.id,
                                url: thumbnail.url,
                            })),
                        },
                    }),
                    ...(details.thumbnails === undefined && {
                        thumbnail: undefined
                    })
                },
                select: { id: true, title: true, description: true, videoLink: true, editorId: true, projectId: true }
            });

            const updatedProject = await tx.project.update({
                where: { id: projectInfo.id },
                data: {
                    status: Status.PENDING
                },
                select: { id: true, status: true, creatorId: true, editorId: true }
            });

            await tx.review.deleteMany({
                where: { projectId: projectInfo.id }
            });

            await tx.notification.create({
                data: {
                    type: NotificationType.PROJECT_DETAILS_UPDATE,
                    message: `Details for video "${updatedVideo.title}" were updated. Project status set to PENDING.`,
                    recipientId: recipientId,
                    senderId: senderId,
                    projectId: projectInfo.id
                }
            });

            return { updatedVideo, updatedProject };
        });

        return result;

    } catch (error: any) {
        console.error(`Error updating video details for videoId ${videoId}:`, error);
        throw new Error(`Failed to update video details. Reason: ${error.message}`);
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
