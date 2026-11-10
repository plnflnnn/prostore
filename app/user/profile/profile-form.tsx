'use client';

import { useSession } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserProfileSchema } from '@/lib/validators';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { UserProfile } from '@/types';
import { updateProfile } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

const ProfilePorm = ({ user }: { user: UserProfile }) => {
  const { data: session, update } = useSession();
  const form = useForm<z.infer<typeof updateUserProfileSchema>>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
    },
  });

  const router = useRouter();

  const onSubmit = async (data: UserProfile) => {
    const result = await updateProfile(data);
    toast.add({
        type: result.success ? 'success' : 'error',
        description: result.message,
    });
    const newSession = {
        ...session,
        user: {
            ...session?.user,
            name: data.name,
            email: data.email,
        }
    };
    await update(newSession);
    router.refresh();
  }

  return (
    <form method='post' className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
            <FieldGroup>
                <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                            Full Name
                        </FieldLabel>
                        <Input
                            {...field}
                            id="form-rhf-demo-title"
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter your full name"
                            autoComplete="off"
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
                />
                <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                        Email
                        </FieldLabel>
                        <Input
                            {...field}
                            id="form-rhf-demo-title"
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter your email"
                            autoComplete="off"
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
                />
            </FieldGroup>
        </div>
        <div className="flex">
            <Button type="submit" className="button col-span-2 w-full" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Update Profile'}
            </Button>
        </div>
    </form>
  )
}

export default ProfilePorm;