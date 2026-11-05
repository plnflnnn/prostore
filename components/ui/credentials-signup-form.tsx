'use client';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useActionState } from "react";
import { signUpUser } from "@/lib/actions/user.actions";
import { Loader2 } from "lucide-react";

import { useSearchParams } from "next/navigation";


const SignUpForm = () => {

  const [data, action, isPending] = useActionState(signUpUser, {
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
              <Label htmlFor='name' className='pb-2'>Name</Label>
              <Input
                type='name'
                id='name'
                name='name'
                autoComplete='name'
                defaultValue=''
                placeholder='Enter your name'
              />
          </div>
          <div>
              <Label htmlFor='email' className='pb-2'>Email</Label>
              <Input
                type='text'
                id='email'
                name='email'
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
                autoComplete='current-password'
                defaultValue=''
                placeholder='Enter your password'
              />
          </div>
          <div>
              <Label htmlFor='confirmPassword' className='pb-2'>Confirm Password</Label>
              <Input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                autoComplete='current-password'
                defaultValue=''
                placeholder='Confirm your password'
              />
          </div>
          <Button type='submit' className='w-full' variant='default' disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Up"}
          </Button>

          {data && !data.success && data.message && (
            <p className="text-center text-destructive">{data.message}</p>
          )}

          <div className="text-sm text-center text-muted-foreground flex-center gap-2">
              Already have an account?
              <Link href='/sign-ip' target='_self' className='link'>Sign In</Link>
          </div>
      </div>
    </form>
  )
}

export default SignUpForm;