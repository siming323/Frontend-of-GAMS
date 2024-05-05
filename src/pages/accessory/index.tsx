import Head from "next/head";
import { Inter } from "next/font/google";
import { Button, Col, Form, Input, Row, Select, Space, Table, TablePaginationConfig, Image, Tooltip, message } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from './index.module.css'
import axios from "axios";
import dayjs from "dayjs";
import { accessoryDelete, getAccessoryList } from "@/api/accessory";
import { AccessoryQueryType, CategoryType } from "@/type";
import Content from "@/components/Content";
import { getCategoryList } from "@/api/category";

const inter = Inter({ subsets: ["latin"] });

const COLUMNS = [
  {
    title: 'Item',
    dataIndex: 'name',
    key: 'name',
    width: 120
  },
  {
    title: 'Appearance',
    dataIndex: 'cover',
    key: 'cover',
    width:120,
    render: (text: string) => {
      return  <Image
                width={50}
                src={text}
                alt="cover"
              />
    }
  },
  {
    title: 'Brand',
    dataIndex: 'brand',
    key: 'brand',
    width:120
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    width: 100,
    render: (text:string) => {
      return text?.name;
    }
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    width: 200,
    render: (text:string) => {
      return <Tooltip placement="top" title={text}>
        {text}
      </Tooltip>
    }
  },
  {
    title: 'Stock',
    dataIndex: 'stock',
    key: 'stock',
    width: 80
  },
  {
    title: 'Create Time',
    dataIndex: 'CreatedAt',
    key: 'CreatedAt',
    width: 130,
    render: (text: string) => dayjs(text).format('YYYY-MM-DD')
  },
];



export default function Home() {

  const [form] = Form.useForm()
  const router = useRouter()
  const [data, setData] = useState([])
  const [categoryList, setCategoryList] = useState<CategoryType[]>([])
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current:1,
    pageSize:20,
    showSizeChanger: true,
    total:0
  })

  async function fetchData(search?: AccessoryQueryType) {
    const res = await getAccessoryList({ 
      current: pagination.current, 
      pageSize: pagination.pageSize,
      ...search
    })
    const { data } = res
    setData(data)
    setPagination({...pagination, total: res.total })
  }

  useEffect(() => {
    fetchData();
    getCategoryList({ all:true }).then(res => {
      setCategoryList(res.data);
    })
  }, [])

  const handleSearchFinish = async (values: AccessoryQueryType) => {
    const res = await getAccessoryList({ ...values, current: 1, pageSize: pagination.pageSize })
    setData(res.data)
    setPagination({ ...pagination, current:1,total:res.total }) 
  }


  const handleSearchReset = () => {
    form.resetFields()
  }

  const handleAccessoryEdit = (id: string) => {
    router.push(`./accessory/edit/${id}`)
  }

  const handleTableChange = async (pagination: TablePaginationConfig) => {
    setPagination(pagination)
    const query = form.getFieldsValue()
    const res = await getAccessoryList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    })
    setData(res.data)
  }

  const handleAccessoryDelete = async (id: string) => {
    await accessoryDelete(id);
    message.success("Successfully delete");
    fetchData(form.getFieldsValue());
  }


  const columns = [...COLUMNS,
    { title: 'Operation', key: "action", render:(_: any, row: any) => 
      <>
        <Space>
          <Button 
            type="link" 
            onClick={() => {
              handleAccessoryEdit(row._id)
            }}>
              Edit
            </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => {
              handleAccessoryDelete(row._id);
            }}
          >
            Delete
          </Button>
        </Space>
      </>
    } 
  ]

  return (
    <Content 
      title="Accessory List"
      operation={
        <Button 
          type="primary"
          onClick={() => {
          router.push("/accessory/add")
        }}>
          Add
        </Button>
      }
    >
      
      <Form
        name="search"
        form={form}
        onFinish={handleSearchFinish}
        initialValues={{
          name: '', brand: '', category: '' 
        }}
      >

      
      <Row gutter={24}>
        <Col span={5}>
          <Form.Item name="name" label="Product Name" >
            <Input placeholder="Please input" allowClear/>
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name="brand" label="Brand" >
            <Input placeholder="Please input" allowClear/>
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name="category" label="Category" >
            <Select 
              allowClear
              showSearch
              placeholder="Please select"
              options={categoryList.map(item => ({
                  label: item.name, 
                  value:item._id
                }))}
            />
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button htmlType="submit" onClick={handleSearchReset}>
                Clear
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
    <div className={styles.tableWrap}>
      <Table 
        dataSource={data} 
        columns={columns} 
        scroll={{x:1000}}
        onChange={handleTableChange}
        pagination={{ ...pagination, showTotal: () => `Total ${pagination.total} Page` }}
      />
    </div>
    </Content>
  );
}
