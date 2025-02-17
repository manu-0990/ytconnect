import prisma from "@/db";

export const updateUserRole = async (userId: number, role: 'CREATOR' | 'EDITOR') => {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role }
        }).then(() => console.log('Successful'))
    } catch (error) {
        console.error("Error updating user role:", error);
        throw new Error("Failed to update user role.");
    }
};

export const getUserById = async (userId: number) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user.");
    }
};
