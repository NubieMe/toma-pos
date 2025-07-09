import { Menu } from "@/types/menu";
import { Action, ActionTable } from "@/types/action";
import { NextResponse } from "next/server";
import { ResponseError } from "@/lib/error/response-error";

/**
 * Returns a query object for MongoDB that matches all dates in the given month (inclusive),
 * taking into account the UTC+7 timezone offset.
 * @param date The date for which to get the query object.
 * @returns The query object.
 */
export const queryMonth = (date: Date | string) => {
    const tzOffset = 7 * 60 * 60000;

    const start_date = new Date(date);
    start_date.setDate(1);
    start_date.setHours(0, 0, 0, 0);
    const start_utc7 = new Date(start_date.getTime() - tzOffset);

    const end_date = new Date(start_date);
    end_date.setMonth(end_date.getMonth() + 1);
    end_date.setDate(0);
    end_date.setHours(23, 59, 59, 999);
    const end_utc7 = new Date(end_date.getTime() - tzOffset);

    return { gte: start_utc7, lte: end_utc7 };
};

/**
 * Filter out all keys that are not included in the keys array from the data object.
 * @param data The object to filter.
 * @param keys The array of keys to include in the filtered object.
 * @returns The filtered object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filter = (data: any, keys: string[]) => {
    const dataCopy = { ...data };
    Object.keys(dataCopy).forEach((k) => {
        if (!keys.includes(k)) {
            delete dataCopy[k];
        }
    })
    return dataCopy;
};

export const errorHandler = (error: ResponseError) => {
    console.error(error)
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: error.status || 500 });
}

export function convertAction(action?: Action) {
    console.log(action, 'act')
    const permissions: ActionTable[] = [];

    if (action?.read) {
        permissions.push("view");
    }
    if (action?.update) {
        permissions.push("edit");
    }
    if (action?.delete) {
        permissions.push("delete");
    }

    return permissions;
}

export function flattenMenus(menus: Menu[]): Menu[] {
    if (menus.length === 0) return []
    return menus.flatMap(menu => {
        if (menu.children?.length) {
            return [menu, ...flattenMenus(menu.children)]
        }
        return [menu]
    })
}