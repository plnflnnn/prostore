'use client';

import { toast } from '../ui/toast';
import { insertProductSchema } from '@/lib/validators';
import { Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import slugify from 'slugify';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { UploadButton } from '@/lib/uploadthing';

type Props = {
    type: 'Create' | 'Update';
    product?: Product;
    productId?: string;
}

const ProductForm = ({ type, product, productId }: Props) => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues:
      product && type === 'Update'
        ? {
            name: product.name,
            slug: product.slug,
            category: product.category,
            brand: product.brand,
            price: product.price,
            stock: product.stock,
            images: product.images,
            isFeatured: product.isFeatured,
            banner: product.banner,
            description: product.description,
          }
        : {
            name: '',
            slug: '',
            category: '',
            brand: '',
            price: '',
            stock: 0,
            images: [],
            isFeatured: false,
            banner: null,
            description: '',
          },
  });

  const onSubmit = async (values: z.infer<typeof insertProductSchema>) => {
    if (type === 'Create') {
      const res = await createProduct(values);
      toast.add({
        type: res.success ? 'success' : 'error',
        description: res.message,
      });
      if (res.success) router.push('/admin/products');
      return;
    }

    if (!productId) {
      router.push('/admin/products');
      return;
    }
    const res = await updateProduct({ ...values, id: productId });
    toast.add({
      type: res.success ? 'success' : 'error',
      description: res.message,
    });
    if (res.success) router.push('/admin/products');
  };

  const images = useWatch({ control: form.control, name: 'images' }) ?? [];
  const isFeatured = useWatch({ control: form.control, name: 'isFeatured' });
  const banner = useWatch({ control: form.control, name: 'banner' });

  return (
      <form
        method='POST'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <div className='flex flex-col md:flex-row gap-5'>
          <Controller
            name='name'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className='w-full' data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='product-name'>Name</FieldLabel>
                <Input id='product-name' placeholder='Enter product name' {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name='slug'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className='w-full' data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='product-slug'>Slug</FieldLabel>
                <div className='relative'>
                  <Input id='product-slug' placeholder='Enter slug' {...field} />
                  <Button
                    type='button'
                    className='bg-gray-700 hover:bg-gray-900 text-white px-4 py-1 mt-2'
                    onClick={() => {
                      form.setValue(
                        'slug',
                        slugify(form.getValues('name'), { lower: true })
                      );
                    }}
                  >
                    Generate
                  </Button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          <Controller
            name='category'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className='w-full' data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='product-category'>Category</FieldLabel>
                <Input id='product-category' placeholder='Enter category' {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name='brand'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className='w-full' data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='product-brand'>Brand</FieldLabel>
                <Input id='product-brand' placeholder='Enter brand' {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          <Controller
            name='price'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className='w-full' data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='product-price'>Price</FieldLabel>
                <Input id='product-price' placeholder='Enter product price' {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name='stock'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className='w-full' data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='product-stock'>Stock</FieldLabel>
                <Input
                  id='product-stock'
                  type='number'
                  placeholder='Enter stock'
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.valueAsNumber || 0)}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <div className='upload-field flex flex-col md:flex-row gap-5'>
          <Controller
            name='images'
            control={form.control}
            render={({ fieldState }) => (
              <Field className='w-full' data-invalid={fieldState.invalid}>
                <FieldLabel>Images</FieldLabel>
                <Card>
                  <CardContent className='space-y-2 mt-2 min-h-48'>
                    <div className='flex-start space-x-2 flex-wrap gap-2'>
                      {images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt='product image'
                          className='w-20 h-20 object-cover object-center rounded-sm'
                          width={100}
                          height={100}
                        />
                      ))}
                      <UploadButton
                        endpoint='imageUploader'
                        onClientUploadComplete={(res) => {
                          const url = res[0]?.ufsUrl ?? res[0]?.url;
                          if (!url) return;
                          form.setValue('images', [...images, url], {
                            shouldValidate: true,
                          });
                        }}
                        onUploadError={(error: Error) => {
                          toast.add({
                            type: 'error',
                            description: `ERROR! ${error.message}`,
                          });
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <div className='upload-field'>
          Featured Product
          <Card>
            <CardContent className='space-y-2 mt-2'>
              <Controller
                name='isFeatured'
                control={form.control}
                render={({ field }) => (
                  <Field orientation='horizontal' className='space-x-2 items-center'>
                    <Checkbox
                      id='product-featured'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor='product-featured'>Is Featured?</FieldLabel>
                  </Field>
                )}
              />
              {isFeatured && banner && (
                <Image
                  src={banner}
                  alt='banner image'
                  className='w-full object-cover object-center rounded-sm'
                  width={1920}
                  height={680}
                />
              )}
              {isFeatured && !banner && (
                <UploadButton
                  endpoint='imageUploader'
                  onClientUploadComplete={(res) => {
                    const url = res[0]?.ufsUrl ?? res[0]?.url;
                    if (!url) return;
                    form.setValue('banner', url);
                  }}
                  onUploadError={(error: Error) => {
                    toast.add({
                      type: 'error',
                      description: `ERROR! ${error.message}`,
                    });
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Controller
            name='description'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className='w-full' data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='product-description'>Description</FieldLabel>
                <textarea
                  id='product-description'
                  placeholder='Enter product description'
                  className='resize-none min-h-24 w-full rounded-2xl border bg-input/50 px-2.5 py-2 text-sm'
                  {...field}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <div>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full'
          >
            {form.formState.isSubmitting ? 'Submitting' : `${type} Product`}
          </Button>
        </div>
      </form>
  );
};

export default ProductForm;
