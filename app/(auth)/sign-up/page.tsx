import { Suspense } from "react";
import { Metadata } from "next";
import {Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { Loader2 } from "lucide-react";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignUpForm from "@/components/ui/credentials-signup-form";

export const metadata: Metadata = {
    title: 'Sign Up'
}

const SignUpCard = ({ children }: { children: React.ReactNode }) => (
    <div className='w-full max-w-md mx-auto'>
        <Card>
            <CardHeader className='space-y-4'>
                <Link href='/' className='flex-center text-center'>
                    <Image src='/images/logo.svg' alt={`${APP_NAME} logo`} width={100} height={100} className='object-contain'priority={true}/>
                </Link>
                <CardTitle className='text-2xl font-bold text-center'>Create an account</CardTitle>
                <CardDescription className='text-sm text-muted-foreground'>
                    Enter your information below to sign up
                </CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    </div>
);

async function SignUpContent({searchParams}: {searchParams: Promise<{ callbackUrl?: string }>}) {
    const { callbackUrl } = await searchParams;

    const session = await auth();
    if (session) {
        return redirect(callbackUrl || "/");
    }

    return (
        <SignUpCard>
            <SignUpForm/>
        </SignUpCard>
    );
}

const SignUpPage = (props: {searchParams: Promise<{ callbackUrl?: string }> }) => {
    return (
        <Suspense fallback={
            <SignUpCard>
                <div className="flex-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin" />
                </div>
            </SignUpCard>
        }>
            <SignUpContent searchParams={props.searchParams} />
        </Suspense>
    );
}

export default SignUpPage;
