"use cache";
import { APP_NAME } from "@/lib/constants";

const Footer = async () => {
	const currentYear = await new Date().getFullYear();

	return (
		<footer className="w-full border-t">
			<div className="p-5 flex-center">
				{currentYear} {APP_NAME}. All rights reserved.
			</div>
		</footer>
	);
};

export default Footer;
