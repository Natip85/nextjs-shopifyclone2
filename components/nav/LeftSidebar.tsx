"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { sidebarLinks } from "@/src/constants/index";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/src/types";

interface LeftSidebarProps {
  currentUser: SafeUser | null;
}

const LeftSidebar = ({ currentUser }: LeftSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <section className="custom-scrollbar bg-stone-200 sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-dark-4 bg-dark-2 pb-5 pt-28 max-md:hidden dark:bg-[#030303]">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname!.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`hover:bg-neutral-500 relative flex justify-start gap-4 rounded-lg p-4 ${
                isActive && "bg-neutral-800 text-white"
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
      {currentUser && (
        <div className="mt-10 px-6">
          <button
            className="flex cursor-pointer gap-4 p-4"
            onClick={() => signOut()}
          >
            <Image
              src="/assets/logout.svg"
              alt="logout"
              width={24}
              height={24}
            />
            <p className="max-lg:hidden">Logout</p>
          </button>
        </div>
      )}
    </section>
  );
};

export default LeftSidebar;
