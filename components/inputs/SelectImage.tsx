"use client";
import { useDropzone } from "react-dropzone";

interface SelectImageProps {
  handleFileChange: (value: any) => void;
}

const SelectImage = ({ handleFileChange }: SelectImageProps) => {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      accept: { "image/*": [".jpeg", ".png", ".jpg", ".webp"] },
      onDrop: (acceptedFiles) => {
        handleFileChange(acceptedFiles);
      },
    });

  return (
    <div
      {...getRootProps()}
      className="h-[5rem] hover:bg-slate-100 border-black border-[1px] border-dashed p-3 mt-3 mb-3 rounded-lg w-full flex flex-col justify-center items-center cursor-pointer"
    >
      <input {...getInputProps()} />

      {isDragActive ? (
        <p className="text-sm font-normal text-slate-400">Drop image here...</p>
      ) : (
        <p className="text-sm font-normal text-slate-400">
          Click to upload or drag images here
        </p>
      )}
    </div>
  );
};

export default SelectImage;
