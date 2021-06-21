import { LockTwoTone, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Tooltip } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useHistory, useParams } from 'react-router-dom';
import validateLib from 'validator';
import PasswordDescription from '../../../shared/components/PasswordDescription';
import LoginPageFrame from '../components/LoginPageFrame';
import axios from '../../../shared/utils/axios.base';
import {
  REST_ERROR_CODE,
  SERVER_ROUTES,
  UI_ROUTES
} from '../../../shared/utils/constants';
import LoginAlert from '../components/LoginAlert';

const ResetPage = (): ReactElement => {
  const history = useHistory();
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [resetErr, setResetErr] = useState<string | undefined>();
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    setLoading(false);
    setResetErr(undefined);
  }, []);

  const onFormSubmit = (values: {
    password: string;
    confirmPassword: string;
  }) => {
    const data = {
      ...values,
      token
    };
    setLoading(true);
    axios
      .post(`${SERVER_ROUTES.USERS}/reset`, data)
      .then(() => {
        message.success('Password reset successfully');
        history.push(UI_ROUTES.LOGIN);
      })
      .catch((error) => {
        if (error.response.data.messages) {
          setResetErr(error.response.data.messages[0].msg);
        }
        if (error.response.data.message) {
          setResetErr(error.response.data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <LoginPageFrame>
      <>
        {resetErr && <LoginAlert content={REST_ERROR_CODE[resetErr]} />}
        <h2 style={{ textAlign: 'center' }}>
          <FormattedMessage id="reset_your_pass" />
        </h2>
        <div style={{ marginBottom: '10px' }}>
          <FormattedMessage id="enter_new_pass" />
        </div>
        <Form onFinish={onFormSubmit}>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: <FormattedMessage id="enter_pass" /> },
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
            <Input.Password
              size="large"
              prefix={<LockTwoTone className="prefixIcon" />}
              placeholder={intl.formatMessage({ id: 'enter_pass' })}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: <FormattedMessage id="enter_pass" /> },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(intl.formatMessage({ id: 'passNotMatch' }))
                  );
                }
              })
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockTwoTone className="prefixIcon" />}
              placeholder={intl.formatMessage({ id: 'confirm_pass' })}
            />
          </Form.Item>
          <Form.Item>
            <FormattedMessage id="use_strong_pass" />{' '}
            <Tooltip placement="topLeft" title={PasswordDescription}>
              <QuestionCircleOutlined />
            </Tooltip>
          </Form.Item>
          <Form.Item style={{ marginBottom: '0px' }}>
            <Button
              htmlType="submit"
              style={{ width: '100%' }}
              type="primary"
              size="large"
              loading={loading}
            >
              <FormattedMessage id="reset_pass" />
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: '0px' }}>
            <FormattedMessage id="go_back" />
            <Link to={UI_ROUTES.LOGIN}>
              {intl.formatMessage({ id: 'sign_in' }).toLowerCase()}
            </Link>
          </Form.Item>
        </Form>
      </>
    </LoginPageFrame>
  );
};

export default ResetPage;
