'use client';
import Image from 'next/image';
import {APP_NAME} from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';

const NotFound = () => {
    const router = useRouter();

    return (
    <div className='flex flex-col items-center  justify-center min-h-screen'>
        <Image src={'/images/logo.svg'} alt={`${APP_NAME} logo`} width={48} height={48} priority/>
        <div className="p-6 sm:3/3 w-1/3 rounded-lg shadow-md text-center">
            <h1 className='text-4xl font-bold'>Page Not Found</h1>
            <p className='text-destructive'>The page you are looking for does not exist.</p>
            <Button onClick={() => router.push('/')} className='mt-4 p-2 px-4'>
                <ArrowLeftIcon className='w-4 h-4 mr-2' />
                Go Back
            </Button>
        </div>
    </div>
    )
}

export default NotFound