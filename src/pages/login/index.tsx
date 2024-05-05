import { Inter } from "next/font/google";
import { Button, Form, Input, message } from "antd";
import  styles from "./index.module.css";
import { login } from "@/api/user";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router =useRouter();
  const handleFinish = async (values:{name: string; password: string}) => {
   const res = await login(values);
   if(res.success) {
    message.success("Login Successfully");
    router.push("/accessory")
   }
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Gym Accessory Manament System</h2>
      <Form onFinish={handleFinish}>
        <Form.Item 
          label="Account" 
          name="name"  
          rules={[{required:true, message: "Please input account"}]}
        >
          <Input placeholder="Please input account"/>
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{required:true, message: "Please input password"}]}>
          <Input.Password placeholder="Please input password"/>
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" size="large" className={styles.btn}>
              Log In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
