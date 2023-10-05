import React from "react";
import { Product, Review } from "@prisma/client";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

interface ProductDetailsProps {
  product: Product & {
    reviews: Review[];
  };
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  return (
    <div className="flex items-center font-bold mb-5 ">
      <Link
        href={"/products"}
        className="hover:bg-slate-300 rounded-md mr-1 p-1"
      >
        <BiArrowBack width={25} height={25} />
      </Link>
      <h1 className="mr-5">{product.title}</h1>
      <span
        className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset 
        ${
          product.productStatus === "active"
            ? "bg-green-200 text-green-700 ring-green-600/20"
            : "bg-red-50 text-red-700 ring-red-600/10"
        }
        `}
      >
        {product.productStatus}
      </span>
    </div>
  );
};

export default ProductDetails;
