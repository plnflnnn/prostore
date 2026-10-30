import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import type { Product } from "@/types";

// Get the latest products
export async function getLatestProducts(): Promise<Product[]> {
    "use cache";
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        take: Number(LATEST_PRODUCTS_LIMIT),
    });
    return convertToPlainObject<Product[]>(products);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    "use cache";
    const product = await prisma.product.findFirst({
        where: { slug: slug },
    });
    return product ? convertToPlainObject<Product>(product) : null;
}