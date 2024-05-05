import Head from "next/head";
import { Inter } from "next/font/google";
import { Button, Col, Form, Input, Row, Select, Space, Table, TablePaginationConfig, Image, Tooltip, Tag, Modal, message } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from './index.module.css'
import axios from "axios";
import dayjs from "dayjs";
import { categoryDelete, getCategoryList } from "@/api/category";
import { CategoryQueryType } from "@/type";
import Content from "@/components/Content";

const inter = Inter({ subsets: ["latin"] });

const LEVEL = {
  ONE: 1,
  TWO: 2,
};

export const LEVEL_OPTIONS = [
  {label: 'level 1', value: LEVEL.ONE},
  {label: 'level 2', value: LEVEL.TWO}
]

const COLUMNS = [
  {
    title: 'Category Name',
    dataIndex: 'name',
    key: 'name',
    width: 160
  },
  {
    title: 'Level',
    dataIndex: 'level',
    key: 'level',
    width:120,
    render: (text: number) => {
      return <Tag color={text == 1 ? "green": "cyan"}>  
        {`Level${text}`}
      </Tag>
    }
  },
  {
    title: 'Parent Category',
    dataIndex: 'parent',
    key: 'parent',
    width:160,
    render:(text: {name: string}) => {
      return text?.name ?? "-"; 
    }
  },
  {
    title: 'Create Time',
    dataIndex: 'CreatedAt',
    key: 'CreatedAt',
    eidth: 130,
    render: (text: string) => dayjs(text).format('YYYY-MM-DD')
  },
];



export default function Category() {

  const [form] = Form.useForm()
  const router = useRouter()
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current:1,
    pageSize:20,
    showSizeChanger: true,
    total:0
  })
  
  async function fetchData(values?: any) {
    const res = await getCategoryList({ 
      current: pagination.current, 
      pageSize: pagination.pageSize,
      ...values,
    })
    const { data } = res;
    setData(data);
    setPagination({...pagination, total: res.total })
  }
  
  useEffect(() => {
    fetchData()
  }, [])

  const handleSearchFinish = async (values: CategoryQueryType) => {
    const res = await getCategoryList({ ...values, current: 1, pageSize: pagination.pageSize })
    setData(res.data)
    setPagination({ ...pagination, current:1,total:res.total }) 
  }


  const handleSearchReset = () => {
    form.resetFields()
  }

  const handleCategoryEdit = (id: string) => {
    router.push(`./category/edit/${id}`)
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination)
    const query = form.getFieldsValue()
    getCategoryList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    })
  }

  const handleCategoryDelete = (id: string) => {
    Modal.confirm({
      title: "Confirm deletion?",
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        await categoryDelete(id);
        message.success("Successfully delete.");
        fetchData(form.getFieldsValue());
      }
    })
  }

  const columns = [...COLUMNS,
    { title: 'Operation', key: "action", render:(_: any, row: any) => 
      <>
        <Space>
          <Button 
            type="link" 
            onClick={() => {
              handleCategoryEdit(row._id)
            }}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => {
            handleCategoryDelete(row)
          }}>
            Delete
          </Button>
        </Space>
      </>
    } 
  ]

  return (
    <Content 
      title="Category List"
      operation={
        <Button 
          type="primary"
          onClick={() => {
          router.push("/category/add")
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
          <Form.Item name="level" label="Level" >
            <Select 
              allowClear
              showSearch
              placeholder="Please select"
              options={LEVEL_OPTIONS}
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
