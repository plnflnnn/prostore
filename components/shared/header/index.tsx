import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";
import CategoryDrawer from "./category-drawer";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import Search from "./search";

const Header = () => {
	return (
		<header className='w-full border-b'>
			<div className='wrapper flex-between'>
				<div className='flex-start'>
					<Suspense fallback={<Button variant="outline"><MenuIcon /></Button>}>
						<CategoryDrawer />
					</Suspense>
					<Link href='/' className='flex-start ml-4'>
					<Image
						src='/images/logo.svg'
						alt={`${APP_NAME} logo`}
						height={48}
						width={48}
						priority={true}
					/>
					<span className='hidden lg:block font-bold text-2xl ml-3'>
						{APP_NAME}
					</span>
					</Link>
				</div>
				<div className='hidden md:block'>
					<Search />
				</div>
				<Menu />
			</div>
		</header>
	);
};

export default Header;
