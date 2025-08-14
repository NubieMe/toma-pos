import { Menu } from "@/types/menu";
import { NextResponse } from "next/server";
import { ResponseError } from "@/lib/error/response-error";
import { Separator } from "@/constant/enum";
import { Separator as SeparatorPrisma } from "@prisma/client";

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

export function flattenMenus(menus: Menu[]): Menu[] {
  if (menus.length === 0) return []
  return menus.flatMap(menu => {
    if (menu.children?.length) {
      return [menu, ...flattenMenus(menu.children)]
    }
    return [menu]
  })
}

export function findParents(menus: Menu[], menuId: string): Menu[] {
  const parents: Menu[] = [];

  function find(currentMenus: Menu[], targetId: string, path: Menu[]): boolean {
    for (const menu of currentMenus) {
      const currentPath = [...path, menu];
      if (menu.id === targetId) {
        parents.push(...path);
        return true;
      }
      if (menu.children && menu.children.length > 0) {
        if (find(menu.children, targetId, currentPath)) {
          return true;
        }
      }
    }
    return false;
  }

  find(menus, menuId, []);
  return parents;
}

export function convertSeparator(separator: Separator): SeparatorPrisma | null {
  switch (separator) {
    case '-':
      return 'HYPHEN'
    case '/':
      return 'SLASH'
    default:
      return null
  }
}

export function convertSeparatorBack(separator: SeparatorPrisma | null): Separator {
  switch (separator) {
    case "SLASH":
      return '/'
    case 'HYPHEN':
      return '-'
    default:
      return null
  }
}

export function convertNumber(str: string) {
  const value = Number(parseNumber(str))

  if (str === '') return ''
  else if (isNaN(value)) return ''
  else return toCurrencyFormat(value)
}

export function toCurrencyFormat(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
  }).format(value)
}

export function parseNumber(value: string) {
  return value.replace(/\./g, '');
}

export function romanizeMonth(month: number) {
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return roman[month];
}
