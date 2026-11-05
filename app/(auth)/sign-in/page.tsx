import { Suspense } from "react";
import { Metadata } from "next";
import {Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import CredentialsSignInForm from "@/components/ui/credentials-signin-form";
import { Loader2 } from "lucide-react";

import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Sign in to your account',
}

const SignInCard = ({ children }: { children: React.ReactNode }) => (
    <div className='w-full max-w-md mx-auto'>
        <Card>
            <CardHeader className='space-y-4'>
                <Link href='/' className='flex-center text-center'>
                    <Image src='/images/logo.svg' alt={`${APP_NAME} logo`} width={100} height={100} className='object-contain'priority={true}/>
                </Link>
                <CardTitle className='text-2xl font-bold text-center'>Sign In</CardTitle>
                <CardDescription className='text-sm text-muted-foreground'>
                    Enter your email and password to sign in to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    </div>
);

async function SignInContent({
    searchParams,
}: {
    searchParams: Promise<{callback: string}>
}) {
    const {callback} = await searchParams;

    const session = await auth();
    if (session) {
        return redirect(callback || "/");
    }

    return (
        <SignInCard>
            <CredentialsSignInForm/>
        </SignInCard>
    );
}

const SignInPage = (props: {
    searchParams: Promise<{callback: string}>
}) => {
    return (
        <Suspense fallback={
            <SignInCard>
                <div className="flex-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin" />
                </div>
            </SignInCard>
        }>
            <SignInContent searchParams={props.searchParams} />
        </Suspense>
    );
}

export default SignInPage;
