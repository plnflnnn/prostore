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

function uniqueFieldLabel(target: unknown): string {
    const raw = Array.isArray(target) ? target.join('_') : String(target ?? 'Field');

    if (/email/i.test(raw)) {
        return 'Email';
    }

    const field = raw.replace(/(_idx|_key)$/i, '').split('_').pop() || 'Field';
    return field.charAt(0).toUpperCase() + field.slice(1);
}

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatErrors(error: any): string {
    if (error.name === 'ZodError') {
        // Course: Object.keys(error.errors).map(field => error.errors[field].message)
        // Zod 3 `errors` was the issues array. Zod 4 dropped it; use flatten() for the same field messages.
        if (typeof error.flatten === 'function') {
            const { fieldErrors, formErrors } = error.flatten();
            const formattedFieldErrors = Object.keys(fieldErrors).map((field) => {
                const value = fieldErrors[field];
                return Array.isArray(value) ? value.join('. ') : value?.message ?? value;
            });

            return [...(formErrors ?? []), ...formattedFieldErrors].filter(Boolean).join('. ');
        }

        const issues = error.issues ?? error.errors ?? [];
        return issues.map((issue: { message: string }) => issue.message).join('. ');
    } else if (
        (error.name === 'PrismaClientKnownRequestError' || error.code === 'P2002') &&
        error.code === 'P2002'
    ) {
        const field = uniqueFieldLabel(error.meta?.target ?? error.meta?.constraint);
        return `${field} already exists`;
    } else {
        return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
    }
}

// Round number to 2 decimal places
export function round2(value: number | string) {
    if(typeof value === 'string') {
        return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    } else if (typeof value === 'number') {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    } else {
        throw new Error('Invalid value');
    }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});

export function formatCurrency(ammount: number | string | null) {
    if(typeof ammount === 'number') {
        return CURRENCY_FORMATTER.format(ammount);
    } else if(typeof ammount === 'string') {
        return CURRENCY_FORMATTER.format(Number(ammount));
    } else {
        return 'NaN';
    }
};
