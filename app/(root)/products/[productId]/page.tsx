import getProductById from "@/src/actions/getProductById";
import ProductDetails from "@/src/components/ProductDetails";
import React from "react";

interface IParams {
  productId?: string;
}

const ProductPage = async ({ params }: { params: IParams }) => {
  const product = await getProductById(params);
  if (!product) {
    return <div>Oops! Product with the given id does not exist.</div>;
  }
  return <ProductDetails product={product} />;
};

export default ProductPage;
