import { NextResponse } from "next/server";
import prisma from "@/src/libs/prismadb";
import getCurrentUser from "@/src/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  const body = await request.json();
  const {
    title,
    description,
    images,
    price,
    quantity,
    shipping,
    weight,
    weightMeasurement,
    productStatus,
  } = body;

  const product = await prisma.product.create({
    data: {
      title,
      description,
      images,
      price: parseFloat(price),
      quantity,
      shipping,
      weight,
      weightMeasurement,
      productStatus,
    },
  });

  return NextResponse.json(product);
}
