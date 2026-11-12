import { Suspense } from "react";
import { getLatestProducts, getFeaturedProducts } from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/product/product-list";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-products-button";
import Loading from "@/app/loading";
import IconBoxes from "@/components/icon-boxes";
import DealCountdown from "@/components/deal-countdown";

async function FeaturedProductCarousel() {
	const featuredProducts = await getFeaturedProducts();
	if (featuredProducts.length === 0) {
		return null;
	}
	return <ProductCarousel data={featuredProducts} />;
}

async function HomepageContent() {
	const products = await getLatestProducts();

	return (
		<>
			<ProductList data={products} title="Newest Arrivals" />
			<ViewAllProductsButton />
			<DealCountdown />
			<IconBoxes />
		</>
	);
}

const Homepage = () => {
	return (
		<>
			<Suspense fallback={<Loading />}>
				<FeaturedProductCarousel />
			</Suspense>
			<Suspense fallback={<Loading />}>
				<HomepageContent />
			</Suspense>
		</>
	);
};

export default Homepage;
