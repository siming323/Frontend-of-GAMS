import { Inter } from "next/font/google";
import { Button, Col, Form, Row, Select, Space, Table, TablePaginationConfig, Tag, message } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from './index.module.css'
import dayjs from "dayjs";
import { accessoryDelete, getAccessoryList } from "@/api/accessory";
import { borrowDelete, getBorrowList } from "@/api/borrow";
import { AccessoryType, BorrowQueryType, BorrowType } from "@/type";
import Content from "@/components/Content";

const inter = Inter({ subsets: ["latin"] });

const STATUS_OPTIONS = [
  {
    label: "lent",
    value: "on"
  }, 
  {
    label: "return",
    value: "off"
  }
]

const COLUMNS = [
  {
    title: 'Item',
    dataIndex: 'productName',
    key: 'productName',
    width: 120
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (text: string) => 
      text === 'on' ? (
      <Tag color="red">
        Lending
      </Tag> 
      ) : (
      <Tag color="green">
        Returned
      </Tag>
      )
  },
  {
    title: 'Borrower',
    dataIndex: 'borrower',
    key: 'borrower',
    width: 100
  },
  {
    title: 'Borrow Time',
    dataIndex: 'borrowAt',
    key: 'borrowAt',
    width: 130,
    render: (text: string) => dayjs(text).format('YYYY-MM-DD')
  },
  {
    title: 'Return Time',
    dataIndex: 'returnAt',
    key: 'returnAt',
    width: 130,
    render: (text: string) => dayjs(text).format('YYYY-MM-DD')
  },
];



export default function Borrow() {

  const [form] = Form.useForm()
  const router = useRouter()
  const [data, setData] = useState([])
  const [accessoryList, setAccessoryList] = useState<AccessoryType[]>([]);
  const [userList, setUserList] = useState<any[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current:1,
    pageSize:20,
    showSizeChanger: true,
    total:0
  })

  async function fetchData(search?: BorrowQueryType) {
    const res = await getBorrowList({ 
      current: pagination.current, 
      pageSize: pagination.pageSize,
      ...search
    })
    const newData = res.data.map((item: BorrowType) => ({
      ...item,
      productName: item.accessory.name,
      borrower: item.user.nickName,
    }))
    setData(newData)
    setPagination({...pagination, total: res.total })
  }

  useEffect(() => {
    fetchData();
    getAccessoryList({ all: true }).then(res=>{
      setAccessoryList(res.data);
    });
  }, [])

  const handleSearchFinish = async (values: BorrowQueryType) => {
    const res = await getBorrowList({ 
      ...values, 
      current: 1, 
      pageSize: pagination.pageSize 
    })
    const newData = res.data.map((item: BorrowType) => ({
      ...item,
      productName: item.accessory.name,
      borrower: item.user.nickName,
    }))
    setData(newData)
    setPagination({ ...pagination, current:1,total:res.total }) 
  }


  const handleSearchReset = () => {
    form.resetFields()
  }

  const handleBorrowEdit = (id: string) => {
    router.push(`./borrow/edit/${id}`)
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination)
    const query = form.getFieldsValue()
    getAccessoryList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    })
  }

  const handleBorrowDelete = async (id: string) => {
    await borrowDelete(id);
    message.success("Successfully delete");
    fetchData(form.getFieldsValue());
  }


  const columns = [...COLUMNS,
    { title: 'Operation', key: "action", render:(_: any, row: any) => 
      <>
        <Space>
          {row.status === 'on' && (
          <Button 
            type="link" 
            onClick={() => {
              handleBorrowEdit(row._id)
            }}>
              Return
          </Button>
          )}
          <Button 
            type="link" 
            danger 
            onClick={() => {
              handleBorrowDelete(row._id);
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
      title="Borrow List"
      operation={
        <Button 
          type="primary"
          onClick={() => {
          router.push("/borrow/add")
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
            <Select 
              allowClear 
              showSearch 
              optionFilterProp="label"
              options={accessoryList.map(item => ({
                label: item.name, 
                value: item._id
                })
              )}></Select>
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name="status" label="Status" >
            <Select allowClear options={[STATUS_OPTIONS]}></Select>
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name="borrower" label="Borrower" >
            <Select 
              allowClear
              showSearch
              placeholder="Please select"
              options={userList.map(item => ({
                  label: item.name, 
                  value: item._id
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

