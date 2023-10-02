import AuthForm from "@/src/components/AuthForm";
import Image from "next/image";
import React from "react";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          src={"/assets/logo.svg"}
          alt="Logo"
          height={75}
          width={75}
          className="mx-auto w-auto"
        />
      </div>
      <AuthForm />
    </div>
  );
};

export default Home;
