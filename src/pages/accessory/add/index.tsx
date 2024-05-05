import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import AccessoryForm from "@/components/AccessoryForm";

const inter = Inter({ subsets: ["latin"] });

export default function AccessoryAdd() {
  return <AccessoryForm title="Accessory Add"/>
}
