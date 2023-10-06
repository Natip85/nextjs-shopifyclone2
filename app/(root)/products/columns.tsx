"use client";
import { Button } from "@/src/@/components/ui/button";
import { ProductType } from "@/src/components/forms/AddProductForm";
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
      const allImages: string[] = row.getValue("images");
      return (
        <Link href={`/products/${productId}`}>
          <Image
            src={
              // allImages[0] ||
              "https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png"
            }
            alt="prod img"
            width={50}
            height={50}
          />
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
      return <Link href={`/products/${productId}`}>{allTitles}</Link>;
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

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="w-8 h-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(productId.toString());
              }}
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Delete</DropdownMenuItem>
            <DropdownMenuItem
              className="flex justify-start items-center"
              onClick={() => {}}
            >
              <EyeIcon />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
