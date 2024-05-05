import React, { useEffect, useState } from 'react';
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
import { accessoryAdd, accessoryUpdate } from '@/api/accessory';
import { AccessoryType, CategoryType } from '@/type';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import dayjs from 'dayjs';
import Content from '../Content';
import { getCategoryList } from '@/api/category';

const { RangePicker } = DatePicker;
const { TextArea } = Input;


export default function AccessoryForm({ title, data }:{ title: string ,data: AccessoryType}) {
    const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
    const [preview, setPreview] = useState("");
    const [form] = Form.useForm();
    const [categoryList, setCategoryList] = useState<CategoryType[]>([])
    const router = useRouter();

    useEffect(() => {
      if(data?._id) {
        data.madeAt = dayjs(data.madeAt)
        data.category = data.category._id
        form.setFieldsValue({...data});
      }
    }, [data, form])

    const handleFinish = async (values: AccessoryType) => {
        if(values.madeAt) {
            values.madeAt = dayjs(values.madeAt).valueOf()
        }
        if(data?._id) {
          await accessoryUpdate(data?._id, values)
        }else {
          await accessoryAdd(values);
        }
        message.success('Created Successfully');
        router.push("/accessory");
    }

    useEffect(() => {
      getCategoryList({ all: true}).then(res => {
        setCategoryList(res.data)
      })
    }, [])

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
                label="Brand" 
                name="brand"
                rules={[{
                    required: true,
                    message:"Please input brand"
                    }
                ]}
            >
              <Input placeholder='Please input'/>
            </Form.Item>
            {<Form.Item 
                label="Category" 
                name="category"
                rules={[{
                    required: true,
                    message:"Please select category"
                    }
                ]}
            >
              <Select 
                placeholder='Please select' 
                options={categoryList.map(item => ({
                  label: item.name, value: item._id
                  }))}
                >
              </Select>
                </Form.Item>}
            <Form.Item label="Appearance" name="cover">
                <Input.Group compact>
                    <Input 
                        placeholder='Please input' 
                        style={{width: "calc(100% - 82px)"}}
                        onChange={(e) => {
                            form.setFieldValue('cover', e.target.value);
                        }}
                    />
                    <Button 
                        type='primary' 
                        onClick={(e) => {
                            setPreview(form.getFieldValue('cover'));
                        }}
                    >
                        Preview
                    </Button>
                </Input.Group>
            </Form.Item>
            {preview && (
                <Form.Item label=" " colon={false}>
                    <Image src={preview} width={100} height={100} alt=''/>
                </Form.Item>
            )}
            <Form.Item label="MadeDate" name="madeAt">
              <DatePicker placeholder='Please select'/>
            </Form.Item>
            <Form.Item label="Stock" name="stock">
              <InputNumber placeholder='Please input'/>
            </Form.Item>
            <Form.Item label="Description" name="description">
              <TextArea rows={4} placeholder='Please input'/>
            </Form.Item>
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

