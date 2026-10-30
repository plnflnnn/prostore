import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import Link from "next/link";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
        <nav className="hidden md:flex w-full max-w-xs gap-1">
            <ModeToggle />
            <Button variant="ghost">
                <Link
                    href="/cart"
                    className="text-sm flex flex-center flex-row gap-2"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Cart
                </Link>
            </Button>
            <Button>
                <Link
                    href="/sign-in"
                    className="text-sm flex flex-center flex-row gap-2"
                >
                    <UserIcon className="w-5 h-5" />
                    Sign In
                </Link>
            </Button>
        </nav>
        <nav className="md:hidden">
            <Sheet>
                <SheetTrigger className='align-middle'>
                    <EllipsisVertical/>
                </SheetTrigger>
                <SheetContent className='flex flex-col items-start p-3'>
                    <SheetTitle className='font-bold pb-2'>Menu</SheetTitle>
                    <ModeToggle/>
                    <Button variant="ghost">
                        <Link className="text-sm flex flex-center flex-row gap-2"
                            href="/cart">
                            <ShoppingCart /> Cart  
                        </Link>
                    </Button>
                    <Button>
                        <Link className="text-sm flex flex-center flex-row gap-2"
                            href="/sign-in"
                        >
                            <UserIcon className="w-5 h-5" /> 
                            Sign In
                        </Link>
                    </Button>
                </SheetContent>
            </Sheet>
        </nav>
    </div>

  )
}

export default Menu