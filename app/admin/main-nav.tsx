'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { ShoppingBagIcon, UserIcon } from "lucide-react";

const links = [
    {
        title: 'Overview',
        href: '/admin/overview',
        icon: UserIcon,
    },
    {
        title: 'Products',
        href: '/admin/products',
        icon: ShoppingBagIcon,
    },
    {
        title: 'Orders',
        href: '/admin/orders',
        icon: ShoppingBagIcon,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: ShoppingBagIcon,
    },
]

const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const pathname = usePathname();
    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
            {links.map((item) => {
                return (
                    <Link key={item.title} href={item.href} className={cn("text-sm font-medium transition-colors hover:text-primary", pathname.includes(item.href)  ? "" : "text-muted-foreground")}>
                        {item.title}
                    </Link>
                )
            })}
        </nav>
    );
};

export default MainNav;