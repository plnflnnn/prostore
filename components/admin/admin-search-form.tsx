'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Input } from '../ui/input';

const AdminSearch = () => {
  const pathname = usePathname();
  const formActionUrl = pathname.includes('/admin/orders')
    ? '/admin/orders'
    : pathname.includes('/admin/users')
      ? '/admin/users'
      : '/admin/products';

  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  return (
    <form action={formActionUrl} method='GET'>
      <Input
        key={query}
        type='search'
        placeholder='Search...'
        name='query'
        defaultValue={query}
        className='md:w-25 lg:w-75'
      />
      <button className='sr-only' type='submit'>
        Search
      </button>
    </form>
  );
};

export default AdminSearch;
