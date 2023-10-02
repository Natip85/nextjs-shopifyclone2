import getProducts, { IProductParams } from "@/src/actions/getProducts";
import ProductTable from "@/src/components/ProductTable";
import Link from "next/link";
import React from "react";

interface HomeProps {
  searchParams: IProductParams;
}

const Products = async ({ searchParams }: HomeProps) => {
  const products = await getProducts(searchParams);
  console.log(products);

  return (
    <>
      <div className="w-full flex justify-between items-center ">
        <h1 className="font-bold text-xl ">Products</h1>
        <Link
          href={"/products/addProduct"}
          className="h-fit text-xs text-white py-1 px-3 bg-black rounded-lg"
        >
          Add product
        </Link>
      </div>
      <div>
        product table
        <ProductTable />
      </div>
    </>
  );
};

export default Products;
