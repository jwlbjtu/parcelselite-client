import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Grid,
  Input,
  InputNumber,
  PageHeader,
  Row,
  Select,
  Space,
  Statistic,
  Switch
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DollarOutlined,
  MinusCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import DescriptionsItem from 'antd/lib/descriptions/Item';
import { OrderAddress } from '../../../custom_types/address-page';
import { Country, COUNTRY_NAMES } from '../../../shared/utils/constants';
import {
  fetchsClientAccountsHandler,
  selectClientAccounts
} from '../../../redux/settings/carriersSlice';
import {
  checkRateHanlder,
  selectLoading,
  selectRates
} from '../../../redux/rate.slice';
import { UserShippingRateRequest } from '../../../custom_types/redux-types';

const ShippingRatePage = () => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const clientAccounts = useSelector(selectClientAccounts);
  const loading = useSelector(selectLoading);
  const rates = useSelector(selectRates);

  useEffect(() => {
    dispatch(fetchsClientAccountsHandler());
  }, [dispatch]);

  const searchRateHandler = () => {
    form.validateFields().then((values) => {
      console.log(values);
      const req: UserShippingRateRequest = {
        channel: values.channel,
        toAddress: {
          name: '',
          company: '',
          email: '',
          phone: '',
          street1: values.street1,
          street2: values.street2,
          city: values.city,
          state: values.state,
          zip: values.zip,
          country: values.country
        },
        packageList: values.packages.map((p: any) => ({
          weight: p.weight,
          length: p.length,
          width: p.width,
          height: p.height
        }))
      };
      console.log(req);
      dispatch(checkRateHanlder(req));
    });
  };

  return (
    <div>
      <PageHeader title="费用查新" />
      <Row>
        <Col span={11}>
          <Form form={form} layout="vertical">
            <Space direction="vertical" style={{ width: 600 }}>
              <Form.Item
                label="物流渠道"
                name="channel"
                rules={[{ required: true, message: '需要物流渠道' }]}
              >
                <Select>
                  {clientAccounts.map((account) => (
                    <Select.Option key={account.id} value={account.accountId}>
                      {account.accountId}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Row gutter={10}>
                <Col span={12}>
                  <Form.Item
                    label="地址1"
                    name="street1"
                    rules={[{ required: true, message: '需要地址1' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="城市"
                    name="city"
                    rules={[{ required: true, message: '需要城市' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="邮编"
                    name="zip"
                    rules={[{ required: true, message: '需要邮编' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="地址2" name="street2">
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="州"
                    name="state"
                    rules={[{ required: true, message: '需要州' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="国家"
                    name="country"
                    initialValue={Country.USA}
                    rules={[{ required: true, message: '需要国家' }]}
                  >
                    <Select>
                      <Select.Option value={Country.USA}>
                        {COUNTRY_NAMES[Country.USA]}
                      </Select.Option>
                      <Select.Option value={Country.CHINA}>
                        {COUNTRY_NAMES[Country.CHINA]}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <div>
                <Form.List name="packages">
                  {(fields, { add, remove }) => {
                    return (
                      <div>
                        {fields.map((field, index) => (
                          <div key={`${field.name}_${field.key}`}>
                            <Space>
                              <Form.Item
                                label="重量(LB)"
                                name={[field.name, 'weight']}
                                initialValue={1}
                                rules={[
                                  { required: true, message: '需要重量' }
                                ]}
                              >
                                <InputNumber min={0} step={0.1} />
                              </Form.Item>
                              <Form.Item
                                label="长(IN)"
                                name={[field.name, 'length']}
                                initialValue={1}
                              >
                                <InputNumber min={0} step={0.1} />
                              </Form.Item>
                              <Form.Item
                                label="宽(IN)"
                                name={[field.name, 'width']}
                                initialValue={1}
                              >
                                <InputNumber min={0} step={0.1} />
                              </Form.Item>
                              <Form.Item
                                label="高(IN)"
                                name={[field.name, 'height']}
                                initialValue={1}
                              >
                                <InputNumber min={0} step={0.1} />
                              </Form.Item>
                              <MinusCircleOutlined
                                style={{ fontSize: '14px' }}
                                className="dynamic-delete-button"
                                onClick={() => {
                                  remove(field.name);
                                }}
                              />
                            </Space>
                          </div>
                        ))}

                        <Row style={{ marginBottom: '24px' }}>
                          <Col push={4} xl={16}>
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => {
                                  add();
                                }}
                                style={{ width: '100%' }}
                              >
                                <PlusOutlined /> 添加包裹
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    );
                  }}
                </Form.List>
              </div>
              <Button
                key="submit"
                type="primary"
                onClick={searchRateHandler}
                loading={loading}
              >
                查询价格
              </Button>
            </Space>
          </Form>
        </Col>
        <Col span={11}>
          <Card bordered={false} title="物流收费">
            <Statistic
              title="总费用"
              value={(rates.baseRate + rates.fee).toFixed(2)}
              precision={2}
              prefix={<DollarOutlined />}
            />
            <Divider />
            <div>
              {rates.details && (
                <Space direction="vertical">
                  <Descriptions title="费用详情" column={1}>
                    <DescriptionsItem label="计费重量">
                      {`${rates.details.billingWeight} LB`}
                    </DescriptionsItem>
                    <DescriptionsItem label="报价区域">
                      {rates.details.rateZone}
                    </DescriptionsItem>
                    <DescriptionsItem label="附加费">
                      {rates.details.totalSurcharges}
                    </DescriptionsItem>
                  </Descriptions>
                  <Descriptions title="附加费清单" column={1}>
                    {rates.details.surCharges.map((charge: any) => (
                      <DescriptionsItem label={charge.description}>
                        ${charge.amount}
                      </DescriptionsItem>
                    ))}
                  </Descriptions>
                </Space>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ShippingRatePage;
