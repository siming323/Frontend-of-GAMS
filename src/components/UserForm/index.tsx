import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Image,
  message,
  Radio
} from 'antd';
import { accessoryAdd } from '@/api/accessory';
import { AccessoryType, CategoryType, UserType } from '@/type';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import dayjs from 'dayjs';
import Content from '../Content';
import { getCategoryList } from '@/api/category';
import { userAdd, userUpdate } from '@/api/user';
import { USER_GENDER, USER_ROLE, USER_STATUS } from '@/constant/user';

const { RangePicker } = DatePicker;
const { TextArea } = Input;


export default function UserForm({ 
  title, 
  editData = {
    gender: USER_GENDER.MALE,
    role: USER_ROLE.USER,
    status: USER_STATUS.ON,
  },
}:{
  title: string,
  editData?: Partial<UserType>
}) {
    const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
    const [preview, setPreview] = useState("");
    const [form] = Form.useForm();
    const [categoryList, setCategoryList] = useState<CategoryType[]>([])
    const router = useRouter();

    useEffect(() => {
      if(editData._id) {
        form.setFieldsValue(editData);
      }
    },[editData])

    const handleFinish = async (values: UserType) => {
      if (editData?._id) {
        await userUpdate(values);
        message.success('update Successfully');
      }else {
        await userAdd(values);
        message.success('Created Successfully');
      }
      router.push("/user");
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
            initialValues={editData}
            layout="horizontal"
            onFinish={handleFinish}
          >
            <Form.Item 
                label="Account" 
                name="name" 
                rules={[{
                    required: true,
                    message:"Please input account"
                    }
                ]}
            >
              <Input placeholder='Please input'/>
            </Form.Item>
            <Form.Item 
                label="Name" 
                name="nickName"
                rules={[{
                    required: true,
                    message:"Please input name"
                    }
                ]}
            >
              <Input placeholder='Please input'/>
            </Form.Item>
            <Form.Item 
                label="Gender" 
                name="gender"
                rules={[{
                    required: true,
                    message:"Please select gender"
                    }
                ]}
            >
              <Radio.Group>
                <Radio value="male">male</Radio>
                <Radio value="female">female</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input.Password 
                  placeholder='Please input' 
                  style={{width: "calc(100% - 82px)"}}
              />
            </Form.Item>
            <Form.Item label="Status" name="status">
              <Radio.Group>
                <Radio value="on">Enable</Radio>
                <Radio value="off">Disable</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Role" name="role">
              <Radio.Group>
                <Radio value="user">User</Radio>
                <Radio value="admin">Administrator</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label=" " colon={false}>
                <Button 
                    size='large'
                    type='primary'
                    htmlType='submit' 
                    className={styles.btn}
                >
                    Create
                </Button>
            </Form.Item>
          </Form>
        </Content>
      );
}