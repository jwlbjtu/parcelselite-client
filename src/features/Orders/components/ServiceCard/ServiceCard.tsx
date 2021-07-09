import { Card, Checkbox, Form, Select, Space, Spin } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import zh_CN from 'antd/es/date-picker/locale/zh_CN';
import en_US from 'antd/es/date-picker/locale/en_US';
import { ClientAccount } from '../../../../custom_types/carrier-page';
import { Order } from '../../../../custom_types/order-page';
import {
  selectLoading,
  updateOrderHanlder
} from '../../../../redux/orders/ordersSlice';
import {
  fetchsClientAccountsHandler,
  selectClientAccounts
} from '../../../../redux/settings/carriersSlice';
import { LOCALES, OrderStatus } from '../../../../shared/utils/constants';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import { selectLanguage } from '../../../../redux/i18n/intlSlice';
import DatePicker from '../../../../shared/components/DatePicker';

const { Option } = Select;

interface ServiceCardProps {
  order: Order;
  isTest: boolean;
  testHandler: Dispatch<SetStateAction<boolean>>;
}

const ServiceCard = ({
  order,
  isTest,
  testHandler
}: ServiceCardProps): ReactElement => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const accounts = useSelector(selectClientAccounts);
  const language = useSelector(selectLanguage);
  const loading = useSelector(selectLoading);
  const [selectedAccount, setSelectedAccount] = useState<
    ClientAccount | undefined
  >();

  useEffect(() => {
    dispatch(fetchsClientAccountsHandler());
    if (order.accountName && accounts) {
      setSelectedAccount(
        accounts.find((ele) => ele.accountName === order.accountName)
      );
    }
    form.setFieldsValue({
      carrierAccount: order.accountName || undefined,
      service: order.service?.key,
      facility: order.facility,
      shippingDate: dayjs(order.shipmentOptions.shipmentDate)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, order, form]);

  const clientAccountSelectHandler = (value: string) => {
    setSelectedAccount(accounts.find((ele) => ele.accountName === value));
  };

  const serviceSelectHandler = (value: string) => {
    if (selectedAccount) {
      const service = selectedAccount.services.find((ele) => ele.key === value);
      if (service) {
        dispatch(
          updateOrderHanlder({
            id: order.id,
            accountName: selectedAccount.accountName,
            carrierAccount: selectedAccount.accountId,
            carrier: selectedAccount.carrier,
            service
          })
        );
      }
    }
  };

  const facilitySelectHandler = (value: string) => {
    dispatch(updateOrderHanlder({ id: order.id, facility: value }));
  };

  return (
    <Card
      size="small"
      style={{ marginBottom: '25px' }}
      title={
        <strong>
          <FormattedMessage id="shipment_options" />
        </strong>
      }
      bodyStyle={{
        minHeight: '141px',
        maxHeight: '900px',
        overflowX: 'hidden',
        overflowY: 'auto'
      }}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical">
          <FormItem
            label="账号"
            name="carrierAccount"
            rules={[{ required: true, message: '请选择物流账号' }]}
          >
            <Select
              onChange={clientAccountSelectHandler}
              disabled={order.status === OrderStatus.FULFILLED}
            >
              {accounts.map((ele) => (
                <Option value={ele.accountName} key={ele.accountId}>
                  {ele.accountName}
                </Option>
              ))}
            </Select>
          </FormItem>
          {selectedAccount && (
            <>
              <FormItem
                label={<FormattedMessage id="service_title" />}
                name="service"
                rules={[{ required: true, message: '请选择物流服务' }]}
              >
                <Select
                  onChange={serviceSelectHandler}
                  disabled={order.status === OrderStatus.FULFILLED}
                >
                  {selectedAccount.services.map((ele) => (
                    <Option key={ele.key} value={ele.key}>
                      {ele.name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
              {selectedAccount.facilities &&
                selectedAccount.facilities.length > 0 && (
                  <FormItem
                    label="分拣中心"
                    name="facility"
                    rules={[{ required: true, message: '请选择分拣中心' }]}
                  >
                    <Select
                      onChange={facilitySelectHandler}
                      disabled={order.status === OrderStatus.FULFILLED}
                    >
                      {selectedAccount.facilities.map((ele) => (
                        <Option key={ele} value={ele}>
                          {ele}
                        </Option>
                      ))}
                    </Select>
                  </FormItem>
                )}
            </>
          )}
          <Space size="large" align="end">
            <FormItem
              label="邮寄日期"
              name="shippingDate"
              rules={[{ required: true, message: '请选择邮寄日期' }]}
            >
              <DatePicker
                locale={language === LOCALES.CHINESE ? zh_CN : en_US}
                allowClear={false}
                style={{ minWidth: '188px', marginRight: '25px' }}
                defaultValue={dayjs(order.shipmentOptions.shipmentDate)}
                disabledDate={(currentDate) =>
                  currentDate.isBefore(dayjs(), 'day')
                }
                onChange={(value) => {
                  dispatch(
                    updateOrderHanlder({
                      id: order.id,
                      shipmentOptions: { shipmentDate: value }
                    })
                  );
                }}
                disabled={order.status === OrderStatus.FULFILLED}
              />
            </FormItem>
            <FormItem>
              <Checkbox
                checked={isTest}
                onClick={() => testHandler(!isTest)}
                disabled={order.status === OrderStatus.FULFILLED}
              >
                生成测试面单
              </Checkbox>
            </FormItem>
          </Space>
        </Form>
      </Spin>
    </Card>
  );
};

export default ServiceCard;
