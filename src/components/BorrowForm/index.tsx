import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Content from "@/components/Content";
import { Button, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { getUserList } from "@/api/user";
import { getAccessoryList } from "@/api/accessory";
import { BorrowType } from "@/type";
import { borrowAdd, borrowUpdate } from "@/api/borrow";

const inter = Inter({ subsets: ["latin"] });

export default function BorrowForm({ title, editData }: { title: string } ) {
  const [form] = Form.useForm()
  const [userList, setUserList] = useState([])
  const [accessoryList, setAccessoryList] = useState([])
  const [stock,setStock] = useState(0)

  useEffect(() => {
    getUserList().then((res) => {
      setUserList(res.data)
    })
    getAccessoryList().then((res) => {
      setAccessoryList(res.data)
    })
  }, [])

  const handleFinish = async( values: BorrowType ) => {
    try {
      if(editData?.id) {
        await borrowUpdate(values)
        message.success("Edit Successfully")
      }else {
        await borrowAdd(values)
        message.success("Create Successfully")
      }
    } catch (error) {
      
    }
  }


  const handleAccessoryChange = (value,option) => {
    setStock(option.stock)
  }

  return (
    <Content title={ title }>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        onFinish={handleFinish}
      >
        <Form.Item 
            label="Accessory" 
            name="accessory" 
            rules={[{
            required: true,
            message:"Please input accessory name"
              }
            ]}
        >
        <Select 
          onChange={handleAccessoryChange}
          placeholder='Please select' 
          options={accessoryList.map(item => ({
            label: item.name, 
            value: item._id,
            stock: item.stock
            }))}
          >
        </Select>
        </Form.Item>
        <Form.Item 
            label="Borrower" 
            name="user"
            rules={[{
                required: true,
                message:"Please input brand"
                }
            ]}
        >
        <Select 
          placeholder='Please select' 
          options={userList.map(item => ({
            label: item.name, 
            value: item._id,
            }))}
          >
        </Select>
        </Form.Item>
        <Form.Item 
            label="Stock" 
            name="stock"
            rules={[{
                message:"Please select category"
                }
            ]}
        >
          {stock}
        </Form.Item>
        <Form.Item label=" " colon={false}>
            <Button 
                size='large'
                type='primary'
                htmlType='submit' 
                className={styles.btn}
                disabled={!(stock > 0)}
            >
                Create
            </Button>
        </Form.Item>
      </Form>
    </Content>
  );
}
