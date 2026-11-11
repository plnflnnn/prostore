import { Suspense } from "react";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import NotFound from "@/app/not-found";
import ProductPrice from "@/components/shared/product/product-price";
import ProductImages from "@/components/shared/product/product-images";
import Loading from "@/app/loading";
import AddToCart from "@/components/shared/product/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.actions";
import ReviewList from "./reviews-list";
import { auth } from "@/auth";
import Rating from "@/components/shared/product/rating";
import { getReviews } from "@/lib/actions/review.actions";
import { ReviewProps } from "@/types";

async function ProductDetails({ params }: { params: Promise<{ slug: string }>}) {
	const { slug } = await params;
	const product = await getProductBySlug(slug);
	if (!product) {
		return <NotFound />;
	}

	const cart = await getMyCart();

	const session = await auth();
	const userId = session?.user?.id;
	const reviews = await getReviews({ productId: product.id });

	return (
		<>
		<section>
			<div className="grid grid-cols-1 md:grid-cols-5">
				<div className="col-span-2">
					<ProductImages images={product.images} />
				</div>
				<div className="col-span-2 p-5">
					<div className="flex flex-col gap-5">
						<p>
							{product.brand} {product.category}
						</p>
						<h1 className="h3-bold">{product.name}</h1>
						<Rating value={Number(product.rating)} />
						<p>{product.numReviews} reviews</p>
						<div className="flex flex-col sm:flex-row sm:items-center gap-3">
							<ProductPrice
								value={Number(product.price)}
								className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
							/>
						</div>
					</div>
					<div className="mt-10">
						<p className="font-semibold">Description</p>
						<p>{product.description}</p>
					</div>
				</div>
				<div>
					<Card>
						<CardContent className="p-4">
							<div className="mb-2 flex justify-between">
								<div>Price</div>
								<div>
									<ProductPrice value={Number(product.price)} />
								</div>
							</div>
							<div className="mb-2 flex justify-between">
								<div>Status</div>
								{product.stock > 0 ? (
									<Badge variant="outline">In Stock</Badge>
								) : (
									<Badge variant="destructive">Out of Stock</Badge>
								)}
							</div>
							{product.stock > 0 && (
								<AddToCart
									cart={cart}
									item={{
										productId: product.id,
										name: product.name,
										slug: product.slug,
										image: product.images[0],
										price: product.price,
										quantity: 1,
									}}
								/>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
		<section className="mt-10">
			<h2 className="h2-bold mb-5">Customer Reviews</h2>
			<ReviewList
				userId={userId || ""}
				productId={product.id}
				productSlug={product.slug}
				initialReviews={reviews.data as ReviewProps[]}
			/>
		</section>
		</>
	);
}

const ProductDetailsPage = (props: {
	params: Promise<{ slug: string }>;
}) => {
	return (
		<Suspense fallback={<Loading />}>
			<ProductDetails params={props.params} />
		</Suspense>
	);
};

export default ProductDetailsPage;
