import { Inter } from "next/font/google";
import UserForm from "@/components/UserForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getUserDetail, getUserList } from "@/api/user";

const inter = Inter({ subsets: ["latin"] });

export default function USerEdit() {
  const router = useRouter();
  const id = router.query.id;

  const [data, setData] = useState();
  useEffect(() => {
    if(id) {
      getUserDetail(id as string).then(res => {
        setData(res.data)
      })
    }
  }, [])
  return <UserForm title="User Edit" editData={data}/>
}
