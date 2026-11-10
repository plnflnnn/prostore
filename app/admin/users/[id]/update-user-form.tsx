'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { updateUser } from '@/lib/actions/user.actions';
import { USER_ROLES } from '@/lib/constants';
import { updateUserSchema } from '@/lib/validators';
import { UpdateUserData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const UpdateUserForm = ({ user }: { user: UpdateUserData }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });

  const onSubmit = async (values: UpdateUserData) => {
    try {
      const res = await updateUser({
        ...values,
        id: user.id,
      });
      toast.add({
        type: res.success ? 'success' : 'error',
        description: res.message,
      });
      if (!res.success) return;

      form.reset(values);
      router.push('/admin/users');
      router.refresh();
    } catch (error) {
      toast.add({
        type: 'error',
        description: (error as Error).message,
      });
    }
  };

  return (
    <form method='POST' onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
      <div>
        <Controller
          name='email'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className='w-full' data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='user-email'>Email</FieldLabel>
              <Input
                id='user-email'
                disabled={true}
                placeholder='Enter user email'
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div>
        <Controller
          name='name'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className='w-full' data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='user-name'>Name</FieldLabel>
              <Input id='user-name' placeholder='Enter user name' {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div>
        <Controller
          name='role'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className='w-full' data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='user-role'>Role</FieldLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  if (value) field.onChange(value);
                }}
              >
                <SelectTrigger id='user-role' className='w-full'>
                  <SelectValue placeholder='Select a role' />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div className='flex-between mt-6'>
        <Button
          type='submit'
          className='w-full'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Update User'}
        </Button>
      </div>
    </form>
  );
};

export default UpdateUserForm;
