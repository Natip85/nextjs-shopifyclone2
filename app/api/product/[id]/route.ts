import { NextResponse } from "next/server";
import prisma from "@/src/libs/prismadb";
import getCurrentUser from "@/src/actions/getCurrentUser";

export async function DELETE({ params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();

  // if (currentUser?.role !== "ADMIN") {
  //   return NextResponse.error();
  // }

  const id = params.id;

  const product = await prisma.product.delete({
    where: { id: id },
  });

  return NextResponse.json(product);
}
