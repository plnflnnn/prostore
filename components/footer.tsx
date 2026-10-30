import { APP_NAME } from "@/lib/constants";

async function getCurrentYear() {
	"use cache";
	return new Date().getFullYear();
}

const Footer = async () => {
	const currentYear = await getCurrentYear();

	return (
		<footer className="w-full border-t">
			<div className="p-5 flex-center">
				{currentYear} {APP_NAME}. All rights reserved.
			</div>
		</footer>
	);
};

export default Footer;
