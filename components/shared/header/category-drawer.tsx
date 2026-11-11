import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { getAllCategories } from '@/lib/actions/product.actions';
import { Button, buttonVariants } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from 'cn';

const CategoryDrawer = async () => {
  const categories = await getAllCategories();

  return (
    <Drawer swipeDirection='left'>
      <DrawerTrigger render={<Button variant='outline' />}>
        <MenuIcon />
      </DrawerTrigger>
      <DrawerContent className='h-full max-w-sm'>
        <DrawerHeader>
          <DrawerTitle>Select a category</DrawerTitle>
          <div className='space-y-1 mt-4'>
            {categories.map((x) => (
              <DrawerClose
                key={x.category}
                nativeButton={false}
                render={
                  <Link
                    href={`/search?category=${x.category}`}
                    className={cn(
                      buttonVariants({ variant: 'ghost' }),
                      'w-full justify-start'
                    )}
                  />
                }
              >
                {x.category} ({x._count})
              </DrawerClose>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
