import { getBorrowDetail, getBorrowList } from "@/api/borrow";
import BorrowForm from "@/components/BorrowForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BorrowEdit() {
    const router = useRouter()
    const [data,setData] = useState()
    useEffect(() => {
        if (router.query.id) {
            getBorrowDetail(router.query.id).then(res => {
                setData(res.data)
            })
        }
    },[])

  return <BorrowForm title="Borrow Edit" editData={data}/>
}
