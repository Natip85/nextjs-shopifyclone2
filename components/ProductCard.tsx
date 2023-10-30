"use client";
import { Product, Review } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { Rating } from "@mui/material";
import { formatPrice } from "../constants/formatPrice";

interface ProductCardProps {
  data: Product & {
    reviews: Review[];
  };
}

const ProductCard = ({ data }: ProductCardProps) => {
  const router = useRouter();
  console.log(data.images[0].image);

  const ProductRating = data.reviews
    ? data.reviews.reduce((acc, item) => item.rating + acc, 0) /
      (data.reviews.length || 1)
    : 0;

  return (
    <div
      onClick={() => router.push(`/product/${data.id}`)}
      className="
        col-span-1
        cursor-pointer
        border-[1.2px]
        border-slate-200
        bg-slate-50
        rounded-md
        p-2
        transition
        hover:scale-105
        text-center
        text-sm
      "
    >
      <div className="flex flex-col items-center w-full gap-1">
        <div
          className="
            aspect-square
            overflow-hidden
            relative
            w-full
            "
        >
          <Image
            fill
            sizes="20"
            className="w-full h-full object-contain"
            src={data.images[0]?.image}
            alt={data.title}
          />
        </div>
        <div className="mt-4">{data.title}</div>
        <Rating value={ProductRating} readOnly />
        <div>{data.reviews ? data.reviews.length : 0} reviews</div>
        <div className="font-semibold">{formatPrice(data.price)}</div>
      </div>
    </div>
  );
};

export default ProductCard;
