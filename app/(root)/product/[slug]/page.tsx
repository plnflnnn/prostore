import { getProductBySlug } from "@/lib/actions/product.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import NotFound from "@/app/not-found";
import ProductPrice from "@/components/shared/product/product-price";
import ProductImages from "@/components/shared/product/product-images";

const ProducrDetailsPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return <NotFound />;
  }

  return (
    <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
            {/* {Image} */}
            <div className="col-span-2">
                <ProductImages images={product.images} />
            </div>
            {/* {Description} */}
            <div className="col-span-2 p-5">
                <div className="flex flex-col gap-5">
                    <p>{product.brand} {product.category}</p>
                    <h1 className="h3-bold">{product.name}</h1>
                    <p>{product.rating} of {product.numReviews} Reviews</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <ProductPrice value={Number(product.price)} className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2" />
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
                            <Button className="w-full">Add to Cart</Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </section>
  )
}

export default ProducrDetailsPage;