import ProductTable from "@/src/components/ProductTable";
import Link from "next/link";
import React from "react";
import { columns } from "./columns";
import getProducts from "@/src/actions/getProducts";

const Products = async () => {
  const allProducts = await getProducts();

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
        <ProductTable columns={columns} data={allProducts} />
      </div>
    </>
  );
};

export default Products;
