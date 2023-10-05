import prisma from "@/src/libs/prismadb";

// export interface IProductParams {
//   // category?: string | null;
//   searchTerm?: string | null;
// }

export default async function getProducts() {
  try {
    const products = await prisma.product.findMany({});
    return products;
  } catch (error: any) {
    throw new Error(`Error fetching products: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
  // try {
  //   const { searchTerm } = params;
  //   let searchString = searchTerm;

  //   if (!searchTerm) {
  //     searchString = "";
  //   }

  //   let query: any = {};

  //   // if (category) {
  //   //   query.category = category;
  //   // }

  //   console.log("query", query, searchTerm);

  //   const products = await prisma.product.findMany({
  //     where: {
  //       ...query,
  //       OR: [
  //         {
  //           title: {
  //             contains: searchString,
  //             mode: "insensitive",
  //           },
  //         },
  //         {
  //           description: {
  //             contains: searchString,
  //             mode: "insensitive",
  //           },
  //         },
  //       ],
  //     },
  //     include: {
  //       reviews: {
  //         include: {
  //           user: true,
  //         },
  //         orderBy: {
  //           createdDate: "desc",
  //         },
  //       },
  //     },
  //     // orderBy: {
  //     //   createdDate: "desc",
  //     // },
  //   });

  //   return products;
  // } catch (error: any) {
  //   throw new Error(error);
  // }
}
