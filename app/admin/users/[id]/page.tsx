import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.actions';
import UpdateUserForm from './update-user-form';
import { Suspense } from 'react';
import Loading from '@/app/loading';


export const metadata: Metadata = {
  title: 'Update User',
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const AdminUserUpdatePageContent = async (props: Props) => {
  const { id } = await props.params;
  const user = await getUserById(id);
  if (!user) notFound();
  return (
    <div className='space-y-8 max-w-lg mx-auto'>
      <h1 className='h2-bold'>Update User</h1>
      <UpdateUserForm
        key={`${user.name}-${user.role}`}
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }}
      />
    </div>
  );
};

const AdminUserUpdatePage = async (props: Props) => {
  return (
    <Suspense fallback={<Loading/>}>
      <AdminUserUpdatePageContent params={props.params} />
    </Suspense>
  );
};


export default AdminUserUpdatePage;