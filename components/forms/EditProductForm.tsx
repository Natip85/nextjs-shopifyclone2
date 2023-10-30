"use client";
import React, { useCallback, useState } from "react";
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
  deleteObject,
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
import { Product } from "@prisma/client";
import Image from "next/image";

export interface EditProductFormProps {
  product: Product;
}

const EditProductForm = ({ product }: EditProductFormProps) => {
  const router = useRouter();
  const [shipping, setShipping] = useState(product.shipping);
  const [isProductCreated, setIsProductCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<any[]>(product.images);
  const [newImages, setNewImages] = useState<any[]>([]);
  const storage = getStorage(firebaseApp);
  console.log("EDIT IMAGES>>>", images);
  console.log("EDIT NEW IMAGES>>>", newImages);

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
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      weight: product.weight !== null ? product.weight : undefined,
      shipping: product.shipping !== null ? product.shipping : undefined,
      weightMeasurement: product.weightMeasurement ?? undefined,
      productStatus: product.productStatus,
      category: product.category ?? undefined,
    },
  });

  const onSubmit = async (data: any) => {
    console.log("EDIT DATA", data);
    setIsLoading(true);
    let uploadedImages: any[] = [];
    const productData = { ...data, images: newImages[0]?.image };
    console.log("EDIT PROD DATA>>>>", productData);
    if (newImages.length > 0) {
      const handleImageUploads = async () => {
        toast("Editing product. This might take a while...", {
          icon: "🔃",
        });
        try {
          for (const item of productData.images) {
            console.log("EDIT ITEM>>>>", item);

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
    }

    const finalData = {
      ...productData,
      images: [...images, ...uploadedImages],
      id: product.id,
    };
    console.log("EDIT FINAL DATA", finalData);
    axios
      .put("/api/product", finalData)
      .then(() => {
        toast.success("Product edited");
        setIsProductCreated(true);
        router.refresh();
        router.push("/products");
      })
      .catch((error) => {
        console.error("Error making the request:", error);
        toast.error("Something went wrong when editing a product");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addImageToState = useCallback((value: any) => {
    console.log("EDIT IMG VAL>>>>", value);

    setNewImages((prev) => {
      if (!prev) {
        return [value];
      }
      return [...prev, value];
    });
  }, []);

  const removeImageFromState = useCallback((value: any) => {
    setImages((prev) => {
      if (prev) {
        const filteredImages = prev.filter((item) => item.image.name !== value);
        return filteredImages;
      }
      return prev;
    });
  }, []);

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
          router.refresh();
          router.push("/products");
        })
        .catch((error: any) => {
          toast.error("Failed to delete product");
          console.log(error);
        });
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="w-full mr-5">
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <label htmlFor="title" className="text-sm text-black">
              Title
              <Input
                id="title"
                {...register("title")}
                className="my-2 rounded-md text-sm hover:bg-slate-100 bg-white"
              />
            </label>

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
            <div className="grid grid-cols-4 gap-4 col-span-2">
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`border border-slate-300 rounded-md object-fit overflow-hidden relative aspect-video ${
                    i === 0 ? "row-span-2 col-span-2" : ""
                  }`}
                >
                  <Image
                    src={img.image}
                    alt="prod img"
                    priority
                    fill
                    sizes="20"
                    className="object-fit w-[100%]"
                  />
                  <div className="w-[70px] absolute top-3">
                    <button
                      onClick={() => {
                        // setFile([]);
                        // removeImageFromState(item);
                      }}
                    >
                      cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
          className="h-fit text-xs text-white py-1 bg-black mr-2"
        >
          {isLoading ? "Loading..." : "Update"}
        </Button>
        <Button
          onClick={() => handleDelete(product.id, product.images)}
          className="h-fit text-xs text-white py-1 bg-red-500"
        >
          Delete
        </Button>
      </div>
    </>
  );
};

export default EditProductForm;
