'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuGroup,
	DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { SunIcon, MoonIcon, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

const ModeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // next-themes: avoid hydration mismatch before the client theme is known
        // eslint-disable-next-line react-hooks/set-state-in-effect -- mount gate
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						className="focus-visible:ring-0 focus-visible:ring-offset-0"
					/>
				}
			>
				{theme === "system" ? (
					<SunMoon />
				) : theme === "dark" ? (
					<MoonIcon />
				) : (
					<SunIcon />
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuLabel>Appearance</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuCheckboxItem
						checked={theme === "system"}
						onCheckedChange={() => setTheme("system")}
					>
						System
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={theme === "light"}
						onCheckedChange={() => setTheme("light")}
					>
						Light
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={theme === "dark"}
						onCheckedChange={() => setTheme("dark")}
					>
						Dark
					</DropdownMenuCheckboxItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ModeToggle;