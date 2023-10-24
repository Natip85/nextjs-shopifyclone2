"use client";
import React, { useCallback, useEffect, useState } from "react";
import SelectImage from "./SelectImage";
import Image from "next/image";

interface SelectColorProps {
  item?: any[];
  addImageToState: (value: any) => void;
  removeImageFromState: (value: any) => void;
  isProductCreated: boolean;
}

const SelectImgVariant = ({
  item,
  addImageToState,
  removeImageFromState,
  isProductCreated,
}: SelectColorProps) => {
  const [file, setFile] = useState<File[]>([]);

  useEffect(() => {
    if (isProductCreated) {
      setFile([] || item);
    }
  }, [isProductCreated, item]);

  const handleFileChange = useCallback(
    (value: File[]) => {
      setFile((prevImages) => [...prevImages, ...value]);
      addImageToState({ ...item, image: value });
    },
    [addImageToState, item]
  );

  return (
    <div>
      {file.length > 0 && (
        <div className="grid grid-cols-4 gap-4 col-span-2">
          {file.map((img, i) => (
            <div
              key={i}
              className={`border border-slate-300 rounded-md object-fit overflow-hidden relative aspect-square ${
                i === 0 ? "row-span-2 col-span-2" : ""
              }`}
            >
              <Image
                src={`${URL.createObjectURL(img)}`}
                alt="prod img"
                priority
                fill
                className="object-fit w-[100%]"
              />
              <div className="w-[70px] absolute top-3">
                <button
                  onClick={() => {
                    setFile([]);
                    removeImageFromState(item);
                  }}
                >
                  cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="col-span-2 text-center">
        <SelectImage handleFileChange={handleFileChange} />
      </div>
    </div>
  );
};

export default SelectImgVariant;
