import { LockTwoTone, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React, { ReactElement, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  loginUserHandler,
  selectLoginError,
  selectLoginLoading,
  setLoginError,
  setResetEmailSent
} from '../../../redux/user/userSlice';
import { UI_ROUTES } from '../../../shared/utils/constants';
import LoginAlert from '../components/LoginAlert';
import LoginPageFrame from '../components/LoginPageFrame';

const LoginPage = (): ReactElement => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const loginError = useSelector(selectLoginError);
  const loginLoading = useSelector(selectLoginLoading);

  useEffect(() => {
    dispatch(setResetEmailSent(false));
    dispatch(setLoginError(false));
  }, [dispatch]);

  const loginFormSubmitHandler = (values: {
    email: string;
    password: string;
  }) => {
    dispatch(loginUserHandler(values));
  };

  return (
    <LoginPageFrame>
      <>
        {loginError && (
          <LoginAlert
            content={intl.formatMessage({ id: 'wrong_email_pass' })}
          />
        )}
        <Form onFinish={loginFormSubmitHandler}>
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                message: intl.formatMessage({ id: 'wrong_email_format' })
              },
              {
                required: true,
                message: intl.formatMessage({ id: 'enter_email' })
              }
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined className="prefixIcon" />}
              placeholder={intl.formatMessage({ id: 'enter_email' })}
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'enter_pass' })
              }
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockTwoTone className="prefixIcon" />}
              placeholder={intl.formatMessage({ id: 'enter_pass' })}
            />
          </Form.Item>
          <Form.Item>
            <Link style={{ float: 'right' }} to={UI_ROUTES.FORGOT}>
              <FormattedMessage id="forgot_pass" />?
            </Link>
          </Form.Item>
          <Form.Item style={{ marginBottom: '0px' }}>
            <Button
              htmlType="submit"
              style={{ width: '100%' }}
              type="primary"
              size="large"
              loading={loginLoading}
            >
              <FormattedMessage id="sign_in" />
            </Button>
          </Form.Item>
        </Form>
      </>
    </LoginPageFrame>
  );
};

export default LoginPage;
