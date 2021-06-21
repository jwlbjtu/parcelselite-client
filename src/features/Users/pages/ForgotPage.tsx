import { MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Result } from 'antd';
import React, { ReactElement, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
  resetUserPasswordEmail,
  selectLoginLoading,
  selectResetEmailSent,
  selectResetError,
  setResetEmailSent,
  setResetError
} from '../../../redux/user/userSlice';
import { UI_ROUTES } from '../../../shared/utils/constants';
import LoginAlert from '../components/LoginAlert';
import LoginPageFrame from '../components/LoginPageFrame';

const ForgotPage = (): ReactElement => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const resetEmailSent = useSelector(selectResetEmailSent);
  const history = useHistory();
  const loading = useSelector(selectLoginLoading);
  const resetError = useSelector(selectResetError);

  useEffect(() => {
    dispatch(setResetEmailSent(false));
    dispatch(setResetError(undefined));
  }, [dispatch]);

  const onFormSubmit = (values: { email: string }) => {
    dispatch(resetUserPasswordEmail(values));
  };

  if (resetEmailSent) {
    return (
      <Result
        status="success"
        title={<FormattedMessage id="send_email" />}
        subTitle={<FormattedMessage id="check_email_reset" />}
        extra={[
          <Button
            type="primary"
            key="login"
            onClick={() => history.push(UI_ROUTES.LOGIN)}
          >
            <FormattedMessage id="go_back_login" />
          </Button>
        ]}
      />
    );
  }

  return (
    <LoginPageFrame>
      <>
        <h2 style={{ textAlign: 'center' }}>
          <FormattedMessage id="trouble_login" />?
        </h2>
        <div style={{ marginBottom: '10px' }}>
          <FormattedMessage id="enter_email_reset" />
        </div>
        {resetError !== undefined && <LoginAlert content={resetError} />}
        <Form onFinish={onFormSubmit}>
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                message: <FormattedMessage id="wrong_email_format" />
              },
              { required: true, message: <FormattedMessage id="enter_email" /> }
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined className="prefixIcon" />}
              placeholder={intl.formatMessage({ id: 'enter_email' })}
              allowClear
            />
          </Form.Item>
          <Form.Item>
            <FormattedMessage id="go_back" />
            <Link to={UI_ROUTES.LOGIN}>
              {intl.formatMessage({ id: 'sign_in' }).toLowerCase()}
            </Link>
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
        </Form>
      </>
    </LoginPageFrame>
  );
};

export default ForgotPage;
