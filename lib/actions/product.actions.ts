'use server';

import { prisma } from "@/db/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { convertToPlainObject, formatErrors } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import type { Product, GetAllProductsProps, UpdateProductData, InsertProductData } from "@/types";
import { revalidatePath } from "next/cache";
import { connection } from 'next/server';
import { insertProductSchema, updateProductSchema } from "../validators";

// Get the latest products
export async function getLatestProducts(): Promise<Product[]> {
    await connection();
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        take: Number(LATEST_PRODUCTS_LIMIT),
    });
    return convertToPlainObject<Product[]>(products);
}

// Get single product by it's slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
    await connection();
    const product = await prisma.product.findFirst({
        where: { slug: slug },
    });
    return product ? convertToPlainObject<Product>(product) : null;
}

// Get single product by it's ID
export async function getProductById(productId: string) {
    await connection();
    const data = await prisma.product.findFirst({
      where: { id: productId },
    });
    return data ? convertToPlainObject<Product>(data) : null;
}


// Get all products
export async function getAllProducts(props: GetAllProductsProps) {
    await connection();
    const { query, limit = PAGE_SIZE, page, category, price, rating, sort } = props;

    //Query filter
    const queryFilter: Prisma.ProductWhereInput =
      query && query !== 'all'
        ? {
            name: {
              contains: query,
              mode: 'insensitive',
            } as Prisma.StringFilter,
          }
        : {};

    //Category Filter
    const categoryFilter: Prisma.ProductWhereInput =
      category && category.toLowerCase() !== 'all' ? { category } : {};

    //Price filter
    const priceFilter: Prisma.ProductWhereInput =
      price && price !== 'all' ? {
          price: { gte: Number(price.split('-')[0]),
          lte: Number(price.split('-')[1])
        }
      } : {};

    //Rating filter
    const ratingFilter: Prisma.ProductWhereInput =
      rating && rating !== 'all' ? { rating: { gte: Number(rating) } } : {};

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === 'lowest'
        ? { price: 'asc' }
        : sort === 'highest'
          ? { price: 'desc' }
          : sort === 'rating'
            ? { rating: 'desc' }
            : { createdAt: 'desc' };

    const where = {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
    };

    const data = await prisma.product.findMany({
        where,
        orderBy,
        take: limit,
        skip: (page - 1) * limit,
    });
    const dataCount = await prisma.product.count({ where });
    return {
        data: convertToPlainObject<Product[]>(data),
        totalPages: Math.ceil(dataCount / limit)
    };
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });
    if (!productExists) throw new Error('Product not found');
    await prisma.product.delete({ where: { id } });
    revalidatePath('/admin/products');
    return {success: true, message: 'Product deleted successfully',};
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
}


// Create a product
export async function createProduct(data: InsertProductData) {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });
    revalidatePath('/admin/products');
    return {
      success: true,
      message: 'Product created successfully',
    };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
}

// Update a product
export async function updateProduct(data: UpdateProductData) {
  try {
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });
    if (!productExists) throw new Error('Product not found');

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });
    revalidatePath('/admin/products');
    return { success: true, message: 'Product updated successfully', };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
}

// Get all categories
export async function getAllCategories() {
  await connection();
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  });

  return data;
}

// Get featured products
export async function getFeaturedProducts() {
  await connection();
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });
  return convertToPlainObject(data) as Product[];
}