"use client";

import { useRouter } from "next/navigation";
import React from "react";
import AddProductForm from "@/src/components/forms/AddProductForm";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";

const AddProduct = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center font-bold mb-5 ">
        <Link
          href={"/products"}
          className="hover:bg-slate-300 rounded-md mr-1 p-1"
        >
          <BiArrowBack width={25} height={25} />
        </Link>
        Add product
      </div>
      <AddProductForm />
    </>
  );
};

export default AddProduct;
