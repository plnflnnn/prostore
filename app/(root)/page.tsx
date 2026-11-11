import { Suspense } from "react";
import { getLatestProducts, getFeaturedProducts } from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/product/product-list";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-products-button";
import Loading from "@/app/loading";

async function HomepageContent() {
	const products = await getLatestProducts();
	const featuredProducts = await getFeaturedProducts();
	return (
		<>
			<ProductCarousel data={featuredProducts} />
			<ProductList data={products} title="Newest Arrivals" />
			<ViewAllProductsButton />
		</>
	);
}

const Homepage = () => {
	return (
		<Suspense fallback={<Loading />}>
			<HomepageContent />
		</Suspense>
	);
};

export default Homepage;
