import { Suspense } from "react";
import { getLatestProducts } from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/product/product-list";
import Loading from "@/app/loading";

async function LatestProducts() {
	const products = await getLatestProducts();
	return <ProductList data={products} title="Newest Arrivals" />;
}

const Homepage = () => {
	return (
		<Suspense fallback={<Loading />}>
			<LatestProducts />
		</Suspense>
	);
};

export default Homepage;
