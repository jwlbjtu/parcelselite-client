import { Breadcrumb, Button, Divider, Form, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { ReactElement, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { CreateOrderData } from '../../../custom_types/order-page';
import {
  createOrderHandler,
  selectLoading,
  selectRedirectOrderId,
  setRedirectOrderId
} from '../../../redux/orders/ordersSlice';
import { selectDefaultAddress } from '../../../redux/settings/addressSlice';
import {
  Country,
  INCOTERM,
  NON_DELIVERY_HANDLING,
  TYPE_OF_CONTENT,
  UI_ROUTES
} from '../../../shared/utils/constants';
import CreateOrderForm from '../components/CreateOrderForm';

interface FormData {
  'sender-name': string;
  'sender-company'?: string;
  'sender-email'?: string;
  'sender-phone'?: string;
  'sender-street1': string;
  'sender-street2'?: string;
  'sender-city': string;
  'sender-state': string;
  'sender-zip': string;
  'sender-country': Country;
  'recipient-name': string;
  'recipient-company'?: string;
  'recipient-email'?: string;
  'recipient-phone'?: string;
  'recipient-street1': string;
  'recipient-street2'?: string;
  'recipient-city': string;
  'recipient-state': string;
  'recipient-zip': string;
  'recipient-country': Country;
}

const CreateOrderPage = (): ReactElement => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const defaultSender = useSelector(selectDefaultAddress);
  const redirectOrderId = useSelector(selectRedirectOrderId);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    dispatch(setRedirectOrderId(undefined));
    form.resetFields();
    form.setFieldsValue({
      'sender-name': defaultSender?.name,
      'sender-company': defaultSender?.company,
      'sender-email': defaultSender?.email,
      'sender-phone': defaultSender?.phone,
      'sender-street1': defaultSender?.street1,
      'sender-street2': defaultSender?.street2,
      'sender-city': defaultSender?.city,
      'sender-state': defaultSender?.state,
      'sender-zip': defaultSender?.zip,
      'sender-country': defaultSender?.country
    });
  }, [form, defaultSender, dispatch, redirectOrderId]);

  if (redirectOrderId !== undefined) {
    return (
      <Redirect
        to={`${UI_ROUTES.ORDERS}${UI_ROUTES.DETAIL}/${redirectOrderId}`}
      />
    );
  }

  const formSubmitHandler = (values: FormData) => {
    const data: CreateOrderData = {
      sender: {
        name: values['sender-name'],
        company: values['sender-company'],
        email: values['sender-email'],
        phone: values['sender-phone'],
        country: values['sender-country'],
        street1: values['sender-street1'],
        street2: values['sender-street2'],
        city: values['sender-city'],
        state: values['sender-state'],
        zip: values['sender-zip']
      },
      toAddress: {
        name: values['recipient-name'],
        company: values['recipient-company'],
        email: values['recipient-email'],
        phone: values['recipient-phone'],
        country: values['recipient-country'],
        street1: values['recipient-street1'],
        street2: values['recipient-street2'],
        city: values['recipient-city'],
        state: values['recipient-state'],
        zip: values['recipient-zip']
      }
    };
    // Check if order is international
    if (values['sender-country'] !== values['recipient-country']) {
      data.customDeclaration = {
        typeOfContent: TYPE_OF_CONTENT.MERCHANDISE,
        incoterm: INCOTERM.DDU.value,
        nonDeliveryHandling: NON_DELIVERY_HANDLING.RETURN,
        signingPerson: values['sender-name']
      };
    }

    dispatch(createOrderHandler(data));
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={UI_ROUTES.ORDERS}>
            <FormattedMessage id="orders" />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FormattedMessage id="createOrderManually" />
        </Breadcrumb.Item>
      </Breadcrumb>
      <Divider />
      <div
        style={{ maxWidth: '920px', marginLeft: 'auto', marginRight: 'auto' }}
      >
        <Form layout="vertical" form={form} onFinish={formSubmitHandler}>
          <Space size="large">
            <CreateOrderForm title="Sender" />
            <CreateOrderForm title="Recipient" />
          </Space>
          <Form.Item style={{ marginTop: '20px', textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              <FormattedMessage id="saveAndContinue" />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateOrderPage;
