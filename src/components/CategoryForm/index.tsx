import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Image,
  message
} from 'antd';
import { CategoryType } from '@/type';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import dayjs from 'dayjs';
import Content from '../Content';
import { LEVEL_OPTIONS } from '@/pages/category';
import { categoryAdd, categoryUpdate, getCategoryList } from '@/api/category';

const { RangePicker } = DatePicker;
const { TextArea } = Input;


export default function CategoryForm({ 
  title, 
  data 
}:{ 
  title:string, 
  data: CategoryType 
}) {
    const [form] = Form.useForm();
    const [level, setLevel] = useState(1);
    const [levelOneList, setLevelOneList] = useState<CategoryType[]>([]);
    const router = useRouter();

    const handleFinish = async (values: CategoryType) => {
      if(data?._id) {
        await categoryUpdate(data?._id, values)
        message.success('Update Successfully');
      }else {
        await categoryAdd(values);
        message.success('Created Successfully');
      }
        router.push("/category");
    }

    useEffect(() => {
      if(data?._id) {
        form.setFieldsValue({...data});
      }
    }, [data, form])

    useEffect(() => {
      async function fetchData (){
        const res = await getCategoryList({ all: true, level:1 })
        setLevelOneList(res.data)
      }
      fetchData();
    },[])

    const levelOneOptions = useMemo(() => {
      return levelOneList.map(item => ({
        value: item._id,
        label: item.name,
      }))
    }, [levelOneList]);

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
                label="Category name" 
                name="name" 
                rules={[{
                    required: true,
                    message:"Please input accessory name"
                    }
                ]}
            >
              <Input placeholder='Please input'/>
            </Form.Item>
            <Form.Item 
              label="Level" 
              name="level"
              rules={[{
                required: true,
                message:"Please select level"
                }
              ]}
            >
              <Select 
                onChange={(value) => {
                  setLevel(value);
                }}
                disabled={!!data?._id}
                placeholder="Please select" 
                options={LEVEL_OPTIONS}
              >
                
              </Select> 
            </Form.Item>
            {(level === 2 || data?.level === 2) && <Form.Item 
                label="Level Belonged" 
                name="parent"
                rules={[{
                  required: true,
                  message:"Please select level"
                  }
                ]}
              >
                <Select placeholder="Please select" options={levelOneOptions}>
                </Select> 
              </Form.Item> }
            <Form.Item label=" " colon={false}>
              <Button 
                size='large'
                type='primary'
                htmlType='submit' 
                className={styles.btn}
              >
                {data?._id ? 'Update' : 'Create'}
              </Button>
            </Form.Item>
          </Form>
        </Content>
      );
}




const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
