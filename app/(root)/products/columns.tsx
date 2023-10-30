"use client";
import { Button } from "@/src/@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, EyeIcon } from "lucide-react";
import { Checkbox } from "@/src/@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";
import toast from "react-hot-toast";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "@/src/libs/firebase";
import axios from "axios";

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "",
    accessorKey: "images",
    cell: ({ row }) => {
      const product = row.original;
      const productId = product.id;
      const allImages: any[] = row.getValue("images");

      return (
        <Link href={`/products/${productId}`}>
          <div className="w-[60px] h-[60px] overflow-hidden relative aspect-video">
            <Image
              src={
                allImages[0].image ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTv2rNkxu82jwemyb3lSLkmbyLCqflQDMJPA&usqp=CAU"
              }
              alt="prod img"
              priority
              fill
              sizes="20"
              className="object-contain"
            />
          </div>
        </Link>
      );
    },
  },
  {
    header: "Product",
    accessorKey: "title",
    cell: ({ row }) => {
      const product = row.original;
      const productId = product.id;
      const allTitles: string = row.getValue("title");
      return (
        <Link
          href={`/products/${productId}`}
          className="font-bold hover:underline "
        >
          {allTitles}
        </Link>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Product Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "category",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Product Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "productStatus",
    cell: ({ row }) => {
      const product = row.original;
      const prodStatus = product.productStatus;
      // const allStatuses: string = row.getValue("productStatus");
      return (
        <span
          className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset
          ${
            product.productStatus === "active"
              ? "bg-green-200 text-green-700 ring-green-600/20"
              : "bg-red-50 text-red-700 ring-red-600/10"
          }
          `}
        >
          {prodStatus}
        </span>
      );
    },
  },

  {
    header: "Product Inventory",
    accessorKey: "quantity",

    cell: ({ row }) => {
      // const quantityPrice = row.getValue("quantity") as number;
      //  const formattedXxxxx = new Date(xxxx as string).toLocaleDateString()
      //  return <div className="font-medium">{formattedXxxxx}</div>
      // const formatter = new Intl.NumberFormat("en-US", {
      //   style: "currency",
      //   currency: "USD",
      // });
      // return formatter.format(quantityPrice);
      const quantity = row.getValue("quantity") as number;
      return <span className="text-stone-500">{quantity} in stock</span>;
    },
  },
  {
    header: "",
    id: "id",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      const productId = product.id;
      const storage = getStorage(firebaseApp);

      const handleDelete = async (id: string, images: any[]) => {
        const confirmed = window.confirm(
          "Are you sure you want to proceed? confirming will delete all unsaved changes."
        );

        if (confirmed) {
          toast("Deleting product, please wait.");
          try {
            for (const item of images) {
              if (item.image) {
                const imageRef = ref(storage, item.image);
                await deleteObject(imageRef);
                console.log("image deleted", item.image);
              }
            }
          } catch (error) {
            console.error("An error occurred:", error);
          }
          const res = await axios
            .delete(`/api/product/${id}`)
            .then((res) => {
              toast.success("Product deleted");
              window.location.reload();
            })
            .catch((error: any) => {
              toast.error("Failed to delete product");
              console.log(error);
            });
        }
      };
      const handleCopyID = () => {
        try {
          navigator.clipboard.writeText(productId.toString());
          toast.success("ID copied to clipboard");
        } catch (error) {
          toast.error("Failed to copy ID");
          console.error("An error occurred:", error);
        }
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="w-8 h-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={handleCopyID}
              className="flex justify-center items-center cursor-pointer"
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(productId, product.images)}
              className="flex justify-center items-center cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-center items-center">
              <Link
                href={`/products/${productId}`}
                className="w-full flex justify-center items-center"
              >
                <EyeIcon />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
