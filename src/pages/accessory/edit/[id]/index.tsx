import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import AccessoryForm from "@/components/AccessoryForm";
import { useEffect, useState } from "react";
import { getAccessoryDetail } from "@/api/accessory";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function AccessoryEdit() {
  const router = useRouter();
  const [data,setData] = useState({});
  useEffect(() => {
    const fetch = async() => {
      const {query={}} = router;
      const {id} = query;
      if(id) {
        const res = await getAccessoryDetail(id as string);
        setData(res.data)
      }
    };
    fetch()
  },[router])
  return <AccessoryForm title="Accessory Edit" data={data}/>
}
