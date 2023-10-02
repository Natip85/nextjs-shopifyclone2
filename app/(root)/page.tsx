import getCurrentUser from "@/src/actions/getCurrentUser";
import Image from "next/image";

export default async function Home() {
  const user = await getCurrentUser();
  return <h1>Hi {user?.name}</h1>;
}
