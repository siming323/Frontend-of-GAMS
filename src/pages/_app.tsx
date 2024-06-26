import { Layout } from "@/components/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useReducer } from "react";
import login from "./login";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
      router.pathname === '/login' ? (<Component {...pageProps} />) :
      ( 
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )
  );
}
