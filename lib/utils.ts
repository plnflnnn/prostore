export { cn } from "cn";


//Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: unknown): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
    const [int, decimal] = num.toString().split('.');
    return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}