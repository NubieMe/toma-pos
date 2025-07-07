import { prisma } from "@/lib/prisma"

export const getCompany = async () => {
    return await prisma.company.findFirst();
}