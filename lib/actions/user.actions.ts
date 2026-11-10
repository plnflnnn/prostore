'use server';

import { signInFormSchema, signUpFormSchema, shippingAddressSchema, paymentMethodSchema, updateUserProfileSchema } from "../validators";
import { signIn, signOut, auth } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formatErrors } from "../utils";
import { ShippingAddress, PaymentMethod, UpdateUserData } from "@/types";
import { PAGE_SIZE } from "@/lib/constants";
import { connection } from "next/server";

// Sign in the user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try{
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        });
        const callbackUrl = (formData.get("callbackUrl") as string) || "/";

        await signIn("credentials", {
            email: user.email,
            password: user.password,
            redirectTo: callbackUrl,
        });

        return {success: true, message: 'Signed in successfully'};
    } catch (e) {
        if(isRedirectError(e)) {
            throw e;
        }
        return {success: false, message: 'Invalid email or password'};
    }
}

//Sign out the user
export async function signOutUser() {
    await signOut({ redirect: false });
    revalidatePath("/", "layout");
    redirect("/");
}

//Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
    try{
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        });

        const hashedPassword = hashSync(user.password, 10);

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
            },
        });
        const callbackUrl = (formData.get("callbackUrl") as string) || "/";
        await signIn("credentials", {
            email: user.email,
            password: user.password,
            redirectTo: callbackUrl,
        });

        return {success: true, message: 'Signed up successfully'};
    } catch(error) {
        if(isRedirectError(error)) {
            throw error;
        }
        return {success: false, message: formatErrors(error)};
    }

}

//Get user by the ID
export async function getUserById(userId: string) {
    await connection();
    const user = await prisma.user.findFirst({
        where: { id: userId },
    });
    if(!user) {
        throw new Error('User not found');
    }
    return user;
};

//Update user shipping address
export async function updateUserShippingAddress(data: ShippingAddress) {
    try{
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id },
        });
        if(!currentUser) {
            throw new Error('User not found');
        }
        const userId = currentUser.id;

        const address = shippingAddressSchema.parse(data);

        await prisma.user.update({
            where: { id: userId },
            data: { address },
        });
        return {success: true, message: 'Shipping address updated successfully'};
    } catch(error) {
        if(isRedirectError(error)) {
            throw error;
        }
        return {success: false, message: formatErrors(error)};
    }
};


//Update user payment method
export async function updateUserPaymentMethod(data: PaymentMethod) {
    try{
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id },
        });
        if(!currentUser) {
            throw new Error('User not found');
        }
        const userId = currentUser.id;
        const paymentMethod = paymentMethodSchema.parse(data);
        await prisma.user.update({
            where: { id: userId },
            data: { paymentMethod: paymentMethod.type },
        });
        return {success: true, message: 'Payment method updated successfully'};
    } catch(error) {
        if(isRedirectError(error)) {
            throw error;
        }
        return {success: false, message: formatErrors(error)};
    }
};

//Update user profile
export async function updateProfile(user: { name: string, email: string}) {
    try{
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id },
        });
        if(!currentUser) {
            throw new Error('User not found');
        }
        const userId = currentUser.id;
        const userData = updateUserProfileSchema.parse(user);
        await prisma.user.update({
            where: { id: userId },
            data: { name: userData.name, email: userData.email },
        });
        revalidatePath("/", "layout");
        return {success: true, message: 'Profile updated successfully'};
    } catch(error) {
        if(isRedirectError(error)) {
            throw error;
        }
        return {success: false, message: formatErrors(error)};
    }
};

//Get all users
export async function getAllUsers({limit = PAGE_SIZE, page, query }: { limit?: number; page: number; query: string }) {
    await connection();
    const queryFilter: Prisma.UserWhereInput =
      query && query !== 'all'
        ? {
            name: {
              contains: query,
              mode: 'insensitive',
            } as Prisma.StringFilter,
          }
        : {};

    const data = await prisma.user.findMany({
      where: {
        ...queryFilter,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const dataCount = await prisma.user.count({
      where: {
        ...queryFilter,
      },
    });

    return {
      data,
      totalPages: Math.ceil(dataCount / limit),
    };
}

// Delete a user
export async function deleteUser(id: string) {
    try {
      await prisma.user.delete({ where: { id } });
      revalidatePath('/admin/users');
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      return { success: false, message: formatErrors(error) };
    }
  };

// Update a user
export async function updateUser(user: UpdateUserData) {
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name,
          role: user.role,
        },
      });

      revalidatePath('/admin/users');
      revalidatePath(`/admin/users/${user.id}`);
      revalidatePath('/admin/users/[id]', 'page');
      revalidatePath('/user/profile');
      revalidatePath('/', 'layout');
      return {success: true, message: 'User updated successfully'};
    } catch (error) {
      return { success: false, message: formatErrors(error) };
    }
  }