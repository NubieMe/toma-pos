import { Separator } from "@/constant/enum";

export type Company = {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logo: string | null;
    category_auto: boolean;
    category_format: string | null;
    category_separator: Separator;
    item_auto: boolean;
    item_format: string | null;
    item_separator: Separator;
    user_auto: boolean;
    user_format: string | null;
    user_separator: Separator;
    created_date: Date;
    updated_date: Date;
    created_by: string | null;
    updated_by: string | null;
};