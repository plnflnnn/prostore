import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import ProfileForm from "./profile-form";
import { Suspense } from "react";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Profile page',
}

const ProfilePageContent = async () => {
    const session = await auth();
    if(!session) {
        redirect('/sign-in');
    }

    return (
    <SessionProvider session={session}>
        <div className="max-w-md mx-auto space-y-4">
            <h2 className="h2-bold">Profile</h2>
            <ProfileForm/>
        </div>
    </SessionProvider>
    )
}

const ProfilePage = async () => {
    return (
        <Suspense fallback={<Loading/>}>
            <ProfilePageContent/>
        </Suspense>
    )
}

export default ProfilePage;