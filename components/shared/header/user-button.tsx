import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import { auth } from "@/auth";
import { signOutUser } from "@/lib/actions/user.actions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { connection } from "next/server";

const UserButton = async () => {
  await connection();
  const session = await auth();

  if(!session) {
    return (
        <Button>
            <Link className="text-sm flex flex-center flex-row gap-2"
                href="/sign-in"
            >
                <UserIcon className="w-5 h-5" />
                Sign In
            </Link>
        </Button>
      )
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="flex gap-2 items-center">
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full ml-2 flex items-center justify-center bg-gray-200"
                    />
                }
            >
                {session.user?.image && session.user?.name ? (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image} alt={session.user?.name} />
                        <AvatarFallback>{firstInitial}</AvatarFallback>
                    </Avatar>
                ) : (
                    firstInitial
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className='font-normal'>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none text-black">{session.user?.name}</p>
                            <p className="text-xs leading-none text-muted-foreground pb-3">{session.user?.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem className='p-0 mb-3'>
                        <form action={signOutUser} className="w-full">
                            <Button type='submit' className='w-full justify-start py-4 px-2 h-4' variant='ghost'>Sign Out</Button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}

export default UserButton;