import MainNav from "./main-nav";

import {APP_NAME} from "@/lib/constants";
import Menu from "@/components/shared/header/menu";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import AdminSearch from "@/components/admin/admin-search-form";
import { Suspense } from "react";

export default function AdminLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex flex-col min-h-full">
            <div className="border-b mx-auto w-full">
				<div className="flex items-center h-16 px-4">
					<Link href="/" className="w-15">
						<Image src="/images/logo.svg" alt={APP_NAME} width={48} height={48} />
					</Link>
					<MainNav className="mx-6" />
					<div className="ml-auto items-center flex space-x-4">
						<div>
							<Suspense fallback={<Input type="search" placeholder="Search..." className="md:w-25 lg:w-75" />}>
								<AdminSearch />
							</Suspense>
						</div>
						<Menu/>
					</div>
				</div>
			</div>
			<div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
				{children}
			</div>
        </div>
	);
}
