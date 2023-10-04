"use client";
import React, { useEffect, useState } from "react";
import { Textarea } from "@/src/@/components/ui/textarea";
import { Button } from "@/src/@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/@/components/ui/select";
import { Input } from "@/src/@/components/ui/input";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import {
  createProductSchema,
  createProductSchemaType,
} from "@/src/validation/createProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodError } from "zod";

export interface ProductType {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  shipping: boolean;
  weight: number;
  weightMeasurment?: string;
  images: any;
  productStatus: string;
}

const AddProductForm = () => {
  const router = useRouter();
  const [shipping, setShipping] = useState(false);
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
      title: "",
      description: "",
      price: 0,
      quantity: 0,
      // weight: 0,
      // shipping: shipping,
      weightMeasurement: "",
      productStatus: "",
    },
  });

  useEffect(() => {
    setValue("weightMeasurement", "lb");
    setValue("productStatus", "draft");
  }, [setValue]);

  const onSubmit = async (data: createProductSchemaType) => {
    console.log("onSubmit called");
    const productData = { ...data, images: uploadedFiles };

    axios
      .post("/api/product", productData)
      .then(() => {
        toast.success("Product created");
        router.refresh();
      })
      .catch((error) => {
        console.error("Error making the request:", error);
        if (error instanceof ZodError) {
          error.issues.forEach((validationError) => {
            toast.error(validationError.message);
          });
          toast.error("Something went wrong when creating a product");
        }
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
    <div className="flex flex-col md:flex-row">
      <div className="w-full">
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
              type="checkbox"
              onChange={() => setShipping(!shipping)}
              className="mr-2"
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
                      <SelectValue placeholder="lb" />
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
      </div>
      <div className="bg-white ml-3 p-3 rounded-md flex flex-col shadow-lg border mt-5 border-stone-300 sm:mt-5 md:mt-0">
        <label htmlFor="" className="text-black">
          Status
        </label>
        <div className="mt-5">
          <Select
            {...register("productStatus")}
            onValueChange={(e) => setValue("productStatus", e)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
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
    </div>
  );
};

export default AddProductForm;
