"use client";
import { Button } from "@/src/@/components/ui/button";
import { Input } from "@/src/@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/@/components/ui/select";
import { Textarea } from "@/src/@/components/ui/textarea";
import {
  createProductSchema,
  createProductSchemaType,
} from "@/src/validation/createProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { categories } from "@/src/constants/Categories";
export interface EditProductFormProps {
  product: Product;
}
const EditProductForm = ({ product }: EditProductFormProps) => {
  const router = useRouter();
  const [shipping, setShipping] = useState(product.shipping);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".png", ".jpg", ".webp"] },
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prevImages) => [...prevImages, ...acceptedFiles]);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<createProductSchemaType>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      weight: product.weight !== null ? product.weight : undefined,
      shipping: shipping,
      weightMeasurement: product.weightMeasurement,
      productStatus: product.productStatus,
      category: product.category,
    },
  });
  const onSubmit = async (data: createProductSchemaType) => {
    console.log(data);
    const productData = { ...data, images: uploadedFiles, id: product.id };

    axios
      .put("/api/product", productData)
      .then(() => {
        toast.success("Product edited");
        router.refresh();
      })
      .catch((error) => {
        toast.error("Something went wrong when editing the product");
      })
      .finally(() => {});
  };
  const handleDiscard = () => {
    const confirmed = window.confirm(
      "Are you sure you want to proceed? confirming will delete all unsaved changes."
    );

    if (confirmed) router.back();
  };
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="w-full mr-5">
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <label htmlFor="title" className="text-sm text-black">
              Title
            </label>
            <Input
              id="title"
              {...register("title")}
              className="my-2 rounded-md text-sm hover:bg-slate-100 bg-white"
            />
            <label htmlFor="" className="text-sm text-black">
              Description
            </label>
            <Textarea
              {...register("description")}
              cols={10}
              rows={10}
              className="my-2 hover:bg-slate-100"
            />
          </div>
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <label htmlFor="" className="text-sm text-black">
              Media
            </label>
            {uploadedFiles.length < 1 ? (
              <div className="hover:bg-slate-100 focus:bg-slate-100 focus:border-blue-800 focus:border-[3px] border-black border-dashed p-3 mt-3 rounded-lg border-[1px] w-full flex flex-col justify-center items-center cursor-pointer">
                <div
                  {...getRootProps()}
                  className="w-full flex flex-col items-center justify-center p-2"
                >
                  <input {...getInputProps()} />
                  <Button
                    type="button"
                    className="bg-slate-100 text-black hover:bg-white"
                  >
                    Upload image
                  </Button>
                  <p className="text-slate-700 text-xs mt-3">
                    Drag & drop images here, or click to select images
                  </p>
                </div>
              </div>
            ) : (
              <div className="hover:bg-slate-100 focus:bg-slate-100 focus:border-blue-800 focus:border-[3px] border-black border-dashed p-3 mt-3 rounded-lg border-[1px] w-full flex  flex-wrap justify-around items-center cursor-pointer">
                {uploadedFiles.map((item, i) => (
                  <Image
                    key={i}
                    src={`${URL.createObjectURL(item)}`}
                    alt="product image"
                    width={100}
                    height={100}
                    className="border p-2 m-2 rounded-lg"
                  />
                ))}
                <div
                  {...getRootProps()}
                  className=" w-[100px] h-[100px] rounded-lg border border-dashed border-black flex justify-center items-center"
                >
                  <input {...getInputProps()} />
                  <Button className="bg-slate-100 text-black hover:bg-white">
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <label htmlFor="" className="text-sm mb-5 text-black">
              Pricing
            </label>
            <label htmlFor="" className="text-xs text-black">
              Price
            </label>
            <Input
              {...register("price")}
              type="number"
              placeholder="$ 0.00"
              className="sm:w-fit my-2 rounded-md hover:bg-slate-100"
            />
          </div>
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <label htmlFor="" className="text-sm mb-5 text-black">
              Inventory
            </label>
            <label htmlFor="" className="text-xs text-black">
              Quantity
            </label>
            <Input
              {...register("quantity")}
              type="number"
              placeholder="0"
              className="sm:w-fit my-2 rounded-md hover:bg-slate-100"
            />
          </div>
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg border border-stone-300">
            <label htmlFor="" className="text-sm mb-5 text-black">
              Shipping
            </label>
            <label
              htmlFor="shipping"
              className="text-xs flex items-center text-slate-800 cursor-pointer"
            >
              <input
                {...register("shipping")}
                checked={shipping}
                type="checkbox"
                onChange={() => setShipping(!shipping)}
                className="mr-2 hover:cursor-pointer"
                id="shipping"
              />
              This product requires shipping
            </label>

            {shipping && (
              <>
                <label htmlFor="" className="text-xs text-slate-800 mt-5">
                  Weight
                </label>
                <div className="flex items-center">
                  <Input
                    {...register("weight")}
                    type="number"
                    placeholder="0"
                    className="sm:w-fit my-2 rounded-md hover:bg-slate-100"
                  />
                  <div className="ml-5">
                    <Select
                      {...register("weightMeasurement")}
                      onValueChange={(e) => setValue("weightMeasurement", e)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={product.weightMeasurement} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem className="cursor-pointer" value="lb">
                            lb
                          </SelectItem>
                          <SelectItem className="cursor-pointer" value="oz">
                            oz
                          </SelectItem>
                          <SelectItem className="cursor-pointer" value="kg">
                            kg
                          </SelectItem>
                          <SelectItem className="cursor-pointer" value="g">
                            g
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-5 sm:mt-5 sm:ml-0 md:mt-0 min-w-[250px]">
          <div className="bg-white p-3 rounded-md flex flex-col shadow-lg border border-stone-300">
            <label htmlFor="" className="text-black">
              Status
            </label>
            <div className="mt-5">
              <Select
                {...register("productStatus")}
                defaultValue={product.productStatus}
                onValueChange={(e) => setValue("productStatus", e)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={product.productStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="active" className="cursor-pointer">
                      Active
                    </SelectItem>
                    <SelectItem value="draft" className="cursor-pointer">
                      Draft
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="bg-white mt-5 p-3 rounded-md flex flex-col shadow-lg border border-stone-300">
            <label htmlFor="" className="text-black">
              Categories
            </label>
            <div className="mt-5">
              <Select
                {...register("category")}
                onValueChange={(e) => setValue("category", e)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={product.category} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.label}
                        value={category.label}
                        className="cursor-pointer"
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <Button
          onClick={handleDiscard}
          className="mr-2 h-fit text-xs text-white py-1 bg-black"
        >
          Discard
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          className="h-fit text-xs text-white py-1 bg-black"
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default EditProductForm;
