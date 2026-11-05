'use client';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useActionState } from "react";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { Loader2 } from "lucide-react";

import { useSearchParams } from "next/navigation";


const CredentialsSignInForm = () => {

  const [data, action, isPending] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={action}>
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
      <div className="space-y-6">
          <div>
              <Label htmlFor='email' className='pb-2'>Email</Label>
              <Input
                type='email'
                id='email'
                name='email'
                required
                autoComplete='email'
                defaultValue=''
                placeholder='Enter your email'
              />
          </div>
          <div>
              <Label htmlFor='password' className='pb-2'>Password</Label>
              <Input
                type='password'
                id='password'
                name='password'
                required
                autoComplete='current-password'
                defaultValue=''
                placeholder='Enter your password'
              />
          </div>
          <Button type='submit' className='w-full' variant='default' disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </Button>

          {data && !data.success && data.message && (
            <p className="text-center text-destructive">{data.message}</p>
          )}

          <div className="text-sm text-center text-muted-foreground flex-center gap-2">
              Don&nbsp;t have an account?
              <Link href='/sign-up' target='_self' className='link'>Sign Up</Link>
          </div>
      </div>
    </form>
  )
}

export default CredentialsSignInForm;