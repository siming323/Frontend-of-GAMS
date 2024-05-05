import { Inter } from "next/font/google";
import CategoryForm from "@/components/CategoryForm";
import { useEffect, useState } from "react";
import { getCategoryDetail } from "@/api/category";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function CategoryEdit() {
  const router = useRouter();
  const [data,setData] = useState({});
  useEffect(() => {
    const fetch = async() => {
      const {query={}} = router;
      const {id} = query;
      if(id) {
        const res = await getCategoryDetail(id as string);
        setData(res.data)
      }
    };
    fetch()
  },[router])
  return <CategoryForm title="Category Edit" data={data}/>
}
