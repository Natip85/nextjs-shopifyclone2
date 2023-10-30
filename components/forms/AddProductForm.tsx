"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Textarea } from "@/src/@/components/ui/textarea";
import { Button } from "@/src/@/components/ui/button";
import { Input } from "@/src/@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import {
  createProductSchema,
  createProductSchemaType,
} from "@/src/libs/validations/createProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomSelect from "../inputs/CustomSelect";
import SelectImgVariant from "../inputs/SelectImgVariant";
import firebaseApp from "@/src/libs/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  categories,
  weightOptions,
  statusOptions,
} from "@/src/constants/Categories";

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
  category: string;
}

const AddProductForm = () => {
  const router = useRouter();
  const [shipping, setShipping] = useState(false);
  const [isProductCreated, setIsProductCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<createProductSchemaType>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      //   title: "",
      //   description: "",
      //   price: 0,
      //   quantity: 0,
      //   weight: 0,
      //   shipping: false,
      //   weightMeasurement: "",
      //   productStatus: "",
    },
  });

  useEffect(() => {
    setValue("weightMeasurement", "lb");
    setValue("productStatus", "draft");
  }, [setValue]);

  const onSubmit = async (data: any) => {
    console.log("ADD DATA>>>>>>", data);
    setIsLoading(true);
    let uploadedImages: any[] = [];
    if (!images || images.length === 0 || !images[0] || !images[0].image) {
      setIsLoading(false);
      return toast.error("Select at least one image");
    }
    const productData = { ...data, images: images[0].image };
    console.log("ADD PROD DATA>>>>>>>", productData);

    if (!productData.images || productData.images.length === 0) {
      setIsLoading(false);
      return toast.error("Select at least one image");
    }

    const handleImageUploads = async () => {
      toast("Creating product. This might take a while...", {
        icon: "🔃",
      });
      try {
        for (const item of productData.images) {
          console.log("ADD ITEM", item);

          if (item) {
            const fileName = new Date().getTime() + "-" + item.name;
            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `products2/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item);

            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                  switch (snapshot.state) {
                    case "paused":
                      break;
                    case "running":
                      break;
                  }
                },
                (error) => {
                  console.log("Error uploading image", error);
                  reject(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                      uploadedImages.push({
                        ...item,
                        image: downloadURL,
                      });

                      console.log("File available at", downloadURL);
                      resolve();
                    })
                    .catch((error) => {
                      console.log("Error getting download URL", error);
                      reject(error);
                    });
                }
              );
            });
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.log("Error handling image uploads", error);
        return toast.error("An error occurred while handling image uploads");
      }
    };
    await handleImageUploads();
    const finalData = { ...productData, images: uploadedImages };
    console.log("ADD FINAL DATA", finalData);

    axios
      .post("/api/product", finalData)
      .then(() => {
        toast.success("Product created");
        setIsProductCreated(true);
        router.refresh();
        router.push("/products");
      })
      .catch((error) => {
        console.error("Error making the request:", error);
        toast.error("Something went wrong when creating a product");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDiscard = () => {
    const confirmed = window.confirm(
      "Are you sure you want to proceed? confirming will delete all unsaved changes."
    );

    if (confirmed) router.back();
  };

  const addImageToState = useCallback((value: any) => {
    setImages((prev) => {
      if (!prev) {
        return [value];
      }
      return [...prev, value];
    });
  }, []);

  const removeImageFromState = useCallback((value: any) => {
    console.log("VALUE>>>", value);

    setImages((prev) => {
      if (prev) {
        const filteredImages = prev.filter((item) => item.image.name !== value);
        return filteredImages;
      }
      return prev;
    });
  }, []);

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
            <label htmlFor="description" className="text-sm text-black">
              Description
            </label>
            <Textarea
              id="description"
              {...register("description")}
              cols={10}
              rows={10}
              className="my-2 hover:bg-slate-100"
            />
          </div>
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <span className="text-sm text-black mb-5">Media</span>
            <SelectImgVariant
              addImageToState={addImageToState}
              removeImageFromState={removeImageFromState}
              isProductCreated={isProductCreated}
              item={images}
            />
          </div>
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <span className="text-sm mb-5 text-black">Pricing</span>
            <label htmlFor="price" className="text-xs text-black">
              Price
            </label>
            <Input
              id="price"
              {...register("price")}
              type="number"
              placeholder="$ 0.00"
              className="sm:w-fit my-2 rounded-md hover:bg-slate-100"
            />
          </div>
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <span className="text-sm mb-5 text-black">Inventory</span>
            <label htmlFor="quantity" className="text-xs text-black">
              Quantity
            </label>
            <Input
              id="quantity"
              {...register("quantity")}
              type="number"
              placeholder="0"
              className="sm:w-fit my-2 rounded-md hover:bg-slate-100"
            />
          </div>
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg border border-stone-300">
            <span className="text-sm mb-5 text-black">Shipping</span>
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
                <label htmlFor="weight" className="text-xs text-slate-800 mt-5">
                  Weight
                </label>
                <div className="flex items-center">
                  <Input
                    id="weight"
                    {...register("weight")}
                    type="number"
                    placeholder="0"
                    className="sm:w-fit my-2 rounded-md hover:bg-slate-100"
                  />
                  <div className="ml-5">
                    <CustomSelect
                      name="weightMeasurement"
                      options={weightOptions}
                      placeholder="Select a weight"
                      control={control}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-5 sm:mt-5 sm:ml-0 md:mt-0 min-w-[250px]">
          <div className="bg-white p-3 rounded-md flex flex-col shadow-lg border border-stone-300">
            <span className="text-black">Status</span>
            <div className="mt-5">
              <CustomSelect
                name="productStatus"
                options={statusOptions}
                placeholder="Select a status"
                control={control}
              />
            </div>
          </div>
          <div className="bg-white mt-5 p-3 rounded-md flex flex-col shadow-lg border border-stone-300">
            <span className="text-black">Categories</span>
            <div className="mt-5">
              <CustomSelect
                name="category"
                options={categories}
                placeholder="Select a category"
                control={control}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <Button
          onClick={handleDiscard}
          className="mr-2 h-fit text-xs text-white py-1 bg-black"
        >
          Discard
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
          className="h-fit text-xs text-white py-1 bg-black"
        >
          {isLoading ? "Loading..." : "Save"}
        </Button>
      </div>
    </>
  );
};

export default AddProductForm;
