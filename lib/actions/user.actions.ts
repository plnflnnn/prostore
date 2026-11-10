'use server';

import { signInFormSchema, signUpFormSchema, shippingAddressSchema, paymentMethodSchema, updateUserProfileSchema } from "../validators";
import { signIn, signOut, auth } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formatErrors } from "../utils";
import { ShippingAddress, PaymentMethod } from "@/types";

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
}