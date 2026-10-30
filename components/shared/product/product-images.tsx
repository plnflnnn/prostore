'use client';
import {useState} from 'react';
import Image from 'next/image';
import {cn} from '@/lib/utils';

const ProductImages = ({images}: {images: string[]}) => {
    const [current, setCurrent] = useState(0);

    return (
        <div className='space-y-4'>
            <Image src={images[current]} alt='product image' width={1000} height={1000} className='min-h-[300px] object-cover object-center' />
            <div className="flex">
                {images.map((image, index) => (
                    <div key={image} className={cn('mr-2 h-20 w-20 cursor-pointer hover:border-primary', current === index ? 'border-1 border-primary' : 'border-1 border-transparent border-black/10')} onClick={() => setCurrent(index)}>
                        <Image src={image} alt='product image' width={1000} height={1000} className='h-full w-full object-cover object-center' />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductImages;