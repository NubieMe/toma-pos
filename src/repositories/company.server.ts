import { prisma } from "@/lib/prisma"
import { Company } from "@/types/company";
import { convertSeparatorBack } from "@/utils/helper";
import { Separator } from "@prisma/client";

export async function getCompany(): Promise<Company | null> {
    const data = await prisma.company.findFirst();

    if (!data) return null;

    (Object.keys(data) as Array<keyof typeof data>).forEach(key => {
        if (key.includes('separator')) {
            const value = (data[key] as Separator | null)
            // @ts-expect-error if you know Typescript you know what I'm doing
            data[key] = convertSeparatorBack(value)
        }
    })

    return (data as Company)
}