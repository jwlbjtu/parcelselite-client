import { Button, Form, Input, PageHeader, Select, Space, Tooltip } from 'antd';
import React, { ReactElement, useState } from 'react';
import validateLib from 'validator';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { UserUpdateFormData } from '../../../../custom_types/profile-page';
import {
  selectCurUser,
  selectProfilePageLoading,
  updateUserHandler
} from '../../../../redux/user/userSlice';
import PasswordDescription from '../../../../shared/components/PasswordDescription';

const { Option } = Select;

const ProfilePage = (): ReactElement => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const loading = useSelector(selectProfilePageLoading);
  const user = useSelector(selectCurUser);
  const [phoneLocale, setPhoneLocale] = useState<'en-US' | 'zh-CN'>('en-US');

  const formSubmitHandler = (values: UserUpdateFormData) => {
    if (user) {
      dispatch(updateUserHandler({ id: user.id, ...values }));
    }
  };

  const prefixSelector = (
    <Form.Item
      name="countryCode"
      rules={[{ required: true, message: '请输选择国家区号!' }]}
      noStyle
    >
      <Select
        style={{ width: 70 }}
        onSelect={(value) => {
          setPhoneLocale('en-US');
          if (value === '86') setPhoneLocale('zh-CN');
        }}
      >
        <Option value="1">+1</Option>
        <Option value="86">+86</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div>
      <PageHeader title={<FormattedMessage id="profile" />} />
      <div>
        <Form
          initialValues={user}
          style={{ textAlign: 'center', width: '70%', marginLeft: '15%' }}
          layout="vertical"
          onFinish={formSubmitHandler}
        >
          <Form.Item
            label={<FormattedMessage id="lastName" />}
            name="lastName"
            rules={[
              {
                required: true,
                message: (
                  <>
                    <FormattedMessage id="lastName" />
                    <FormattedMessage id="requiredField" />
                  </>
                )
              }
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="firstName" />}
            name="firstName"
            rules={[
              {
                required: true,
                message: (
                  <>
                    <FormattedMessage id="firstName" />
                    <FormattedMessage id="requiredField" />
                  </>
                )
              }
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="company" />}
            name="companyName"
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号码"
            rules={[
              { required: true, message: '请输入您的手机号码!' },
              () => ({
                validator(rule, value) {
                  if (
                    !value ||
                    validateLib.isMobilePhone(value, [phoneLocale])
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('手机号码格式错误！'));
                }
              })
            ]}
          >
            <Input
              placeholder="手机号码"
              addonBefore={prefixSelector}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="curPassword" />}
            name="password"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="needPassword" />
              }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={
              <Space size="small">
                <FormattedMessage id="newPassword" />
                <Tooltip placement="topLeft" title={PasswordDescription}>
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            }
            name="newPassword"
            rules={[
              () => ({
                validator(rule, value) {
                  if (!value || validateLib.isStrongPassword(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(intl.formatMessage({ id: 'weekPassword' }))
                  );
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="confirmPassword" />}
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(intl.formatMessage({ id: 'passNotMatch' }))
                  );
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ float: 'left' }}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              <FormattedMessage id="save" />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;
