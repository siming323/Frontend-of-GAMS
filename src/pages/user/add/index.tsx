import UserForm from "@/components/UserForm";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function UserAdd() {
  return <UserForm title="User Add"/>
}
