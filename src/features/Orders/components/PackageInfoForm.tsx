import { Button, Form, InputNumber, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import convert from 'convert-units';
import { CloseCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import { Order, PackageInfo } from '../../../custom_types/order-page';
import {
  saveOrderPackageInfo,
  selectSavingPackInfo
} from '../../../redux/orders/ordersSlice';
import { selectPackagesUnits } from '../../../redux/settings/settingSlice';
import {
  CARRIERS,
  DistanceUnit,
  OrderStatus,
  PackageTypes,
  PACKAGE_TYPE_NAMES,
  UPS_SERVICES,
  WeightUnit
} from '../../../shared/utils/constants';

const { Option } = Select;

interface PackageFormData {
  packageType: string;
  dimentions: {
    length: number;
    width: number;
    height: number;
    unitOfMeasure: DistanceUnit;
  };
  weight: {
    value: number;
    unitOfMeasure: WeightUnit;
  };
}

interface FormData extends PackageFormData {
  packages?: PackageFormData[];
}

interface PackageInfoFormProps {
  order: Order;
  onOrderPage: boolean;
  onCancel?: () => void;
  onOk?: () => void;
}

const PackageInfoForm = ({
  order,
  onOrderPage,
  onCancel,
  onOk
}: PackageInfoFormProps): ReactElement => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const packageSetting = useSelector(selectPackagesUnits);
  const savingPackInfo = useSelector(selectSavingPackInfo);
  const [form] = useForm();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const formInitData: FormData = {
      packageType: 'PKG',
      dimentions: {
        length: 0,
        width: 0,
        height: 0,
        unitOfMeasure: packageSetting.distanceUnit
      },
      weight: {
        value: 0,
        unitOfMeasure: packageSetting.weightUnit
      }
    };

    if (order.packageInfo) {
      const packInfo = order.packageInfo;
      const packDim = packInfo.dimentions;
      formInitData.packageType = packInfo.packageType;
      formInitData.dimentions.length = parseFloat(
        convert(packDim.length)
          .from(packDim.unitOfMeasure)
          .to(packageSetting.distanceUnit)
          .toFixed(2)
      );
      formInitData.dimentions.width = parseFloat(
        convert(packDim.width)
          .from(packDim.unitOfMeasure)
          .to(packageSetting.distanceUnit)
          .toFixed(2)
      );
      formInitData.dimentions.height = parseFloat(
        convert(packDim.height)
          .from(packDim.unitOfMeasure)
          .to(packageSetting.distanceUnit)
          .toFixed(2)
      );
      formInitData.weight.value = parseFloat(
        convert(packInfo.weight.value)
          .from(packInfo.weight.unitOfMeasure)
          .to(packageSetting.weightUnit)
          .toFixed(2)
      );
    }
    if (order.morePackages && order.morePackages.length > 0) {
      const newPackages = order.morePackages.map((ele) => {
        const packDim = ele.dimentions;
        const result: PackageInfo = {
          packageType: ele.packageType,
          dimentions: {
            unitOfMeasure: packageSetting.distanceUnit,
            length: parseFloat(
              convert(packDim.length)
                .from(packDim.unitOfMeasure)
                .to(packageSetting.distanceUnit)
                .toFixed(2)
            ),
            width: parseFloat(
              convert(packDim.width)
                .from(packDim.unitOfMeasure)
                .to(packageSetting.distanceUnit)
                .toFixed(2)
            ),
            height: parseFloat(
              convert(packDim.height)
                .from(packDim.unitOfMeasure)
                .to(packageSetting.distanceUnit)
                .toFixed(2)
            )
          },
          weight: {
            value: parseFloat(
              convert(ele.weight.value)
                .from(ele.weight.unitOfMeasure)
                .to(packageSetting.weightUnit)
                .toFixed(2)
            ),
            unitOfMeasure: packageSetting.weightUnit
          }
        };
        return result;
      });
      formInitData.packages = newPackages;
    }

    form.setFieldsValue(formInitData);
  }, [order, form, packageSetting, refresh]);

  const onCancelHandler = () => {
    setRefresh(!refresh);
    if (onCancel) onCancel();
  };

  const onFormSubmit = (values: FormData) => {
    dispatch(
      saveOrderPackageInfo({
        id: order.id,
        packageInfo: {
          packageType: values.packageType,
          dimentions: values.dimentions,
          weight: values.weight
        },
        morePackages: values.packages
      })
    );
    if (onOk) onOk();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFormSubmit}
      style={onOrderPage ? { minWidth: '500px' } : {}}
    >
      <h3>包裹 - 1</h3>
      <Form.Item name="packageType" required>
        <Select disabled={order.status === OrderStatus.FULFILLED}>
          <Option key="custom" value={PackageTypes.PKG}>
            {PACKAGE_TYPE_NAMES[PackageTypes.PKG]}
          </Option>
        </Select>
      </Form.Item>
      <div style={{ marginBottom: '10px' }}>
        <FormattedMessage id="dimentions" /> (
        <FormattedMessage id="dimentions_sub" />)
      </div>
      <Space>
        <Form.Item
          name={['dimentions', 'length']}
          rules={[
            () => ({
              validator(rule, value) {
                if (value > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(intl.formatMessage({ id: 'require_greater_zero' }))
                );
              }
            })
          ]}
        >
          <InputNumber
            min={0}
            placeholder={intl.formatMessage({ id: 'length' })}
            precision={2}
            disabled={order.status === OrderStatus.FULFILLED}
          />
        </Form.Item>
        <Form.Item>X</Form.Item>
        <Form.Item
          name={['dimentions', 'width']}
          rules={[
            () => ({
              validator(rule, value) {
                if (value > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(intl.formatMessage({ id: 'require_greater_zero' }))
                );
              }
            })
          ]}
        >
          <InputNumber
            min={0}
            placeholder={intl.formatMessage({ id: 'width' })}
            precision={2}
            disabled={order.status === OrderStatus.FULFILLED}
          />
        </Form.Item>
        <Form.Item>X</Form.Item>
        <Form.Item
          name={['dimentions', 'height']}
          rules={[
            () => ({
              validator(rule, value) {
                if (value > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(intl.formatMessage({ id: 'require_greater_zero' }))
                );
              }
            })
          ]}
        >
          <InputNumber
            min={0}
            placeholder={intl.formatMessage({ id: 'height' })}
            precision={2}
            disabled={order.status === OrderStatus.FULFILLED}
          />
        </Form.Item>
        <Form.Item
          name={['dimentions', 'unitOfMeasure']}
          style={{ minWidth: '88px' }}
        >
          <Select disabled={order.status === OrderStatus.FULFILLED}>
            {Object.values(DistanceUnit).map((item) => {
              return (
                <Option key={item} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Space>
      <div style={{ marginBottom: '10px' }}>
        <FormattedMessage id="package_weight" />
      </div>
      <Space>
        <Form.Item
          name={['weight', 'value']}
          rules={[
            () => ({
              validator(rule, value) {
                if (value > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(intl.formatMessage({ id: 'require_greater_zero' }))
                );
              }
            })
          ]}
        >
          <InputNumber
            min={0}
            placeholder={intl.formatMessage({ id: 'weight' })}
            precision={2}
            disabled={order.status === OrderStatus.FULFILLED}
          />
        </Form.Item>
        <Form.Item
          name={['weight', 'unitOfMeasure']}
          style={{ minWidth: '88px' }}
        >
          <Select disabled={order.status === OrderStatus.FULFILLED}>
            {Object.values(WeightUnit).map((item) => {
              return (
                <Option key={item} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Space>
      <Form.List name="packages">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }, index) => (
              <div key={key}>
                <Space size="large">
                  <h3>{`包裹 -  ${index + 2}`}</h3>{' '}
                  <CloseCircleTwoTone
                    twoToneColor="red"
                    onClick={() => remove(name)}
                  />
                </Space>
                <Form.Item
                  name={[name, 'packageType']}
                  initialValue={PackageTypes.PKG}
                  required
                >
                  <Select disabled={order.status === OrderStatus.FULFILLED}>
                    <Option key="custom" value={PackageTypes.PKG}>
                      {PACKAGE_TYPE_NAMES[PackageTypes.PKG]}
                    </Option>
                  </Select>
                </Form.Item>
                <div style={{ marginBottom: '10px' }}>
                  <FormattedMessage id="dimentions" /> (
                  <FormattedMessage id="dimentions_sub" />)
                </div>
                <Space>
                  <Form.Item
                    name={[name, 'dimentions', 'length']}
                    rules={[
                      () => ({
                        validator(rule, value) {
                          if (value > 0) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              intl.formatMessage({ id: 'require_greater_zero' })
                            )
                          );
                        }
                      })
                    ]}
                  >
                    <InputNumber
                      min={0}
                      placeholder={intl.formatMessage({ id: 'length' })}
                      precision={2}
                      disabled={order.status === OrderStatus.FULFILLED}
                    />
                  </Form.Item>
                  <Form.Item>X</Form.Item>
                  <Form.Item
                    name={[name, 'dimentions', 'width']}
                    rules={[
                      () => ({
                        validator(rule, value) {
                          if (value > 0) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              intl.formatMessage({ id: 'require_greater_zero' })
                            )
                          );
                        }
                      })
                    ]}
                  >
                    <InputNumber
                      min={0}
                      placeholder={intl.formatMessage({ id: 'width' })}
                      precision={2}
                      disabled={order.status === OrderStatus.FULFILLED}
                    />
                  </Form.Item>
                  <Form.Item>X</Form.Item>
                  <Form.Item
                    name={[name, 'dimentions', 'height']}
                    rules={[
                      () => ({
                        validator(rule, value) {
                          if (value > 0) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              intl.formatMessage({ id: 'require_greater_zero' })
                            )
                          );
                        }
                      })
                    ]}
                  >
                    <InputNumber
                      min={0}
                      placeholder={intl.formatMessage({ id: 'height' })}
                      precision={2}
                      disabled={order.status === OrderStatus.FULFILLED}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[name, 'dimentions', 'unitOfMeasure']}
                    style={{ minWidth: '88px' }}
                    initialValue={packageSetting.distanceUnit}
                    required
                  >
                    <Select disabled={order.status === OrderStatus.FULFILLED}>
                      {Object.values(DistanceUnit).map((item) => {
                        return (
                          <Option key={item} value={item}>
                            {item}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Space>
                <div style={{ marginBottom: '10px' }}>
                  <FormattedMessage id="package_weight" />
                </div>
                <Space>
                  <Form.Item
                    name={[name, 'weight', 'value']}
                    rules={[
                      () => ({
                        validator(rule, value) {
                          if (value > 0) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              intl.formatMessage({ id: 'require_greater_zero' })
                            )
                          );
                        }
                      })
                    ]}
                  >
                    <InputNumber
                      min={0}
                      placeholder={intl.formatMessage({ id: 'weight' })}
                      precision={2}
                      disabled={order.status === OrderStatus.FULFILLED}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[name, 'weight', 'unitOfMeasure']}
                    style={{ minWidth: '88px' }}
                    initialValue={packageSetting.weightUnit}
                    required
                  >
                    <Select disabled={order.status === OrderStatus.FULFILLED}>
                      {Object.values(WeightUnit).map((item) => {
                        return (
                          <Option key={item} value={item}>
                            {item}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Space>
              </div>
            ))}
            {order.status !== OrderStatus.FULFILLED &&
              ((order.carrier === CARRIERS.UPS &&
                order.service!.id !== '92' &&
                order.service!.id !== '93') ||
                (order.carrier === CARRIERS.FEDEX &&
                  order.service!.key !== 'SMART_POST')) && (
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    <FormattedMessage id="add_package" />
                  </Button>
                </Form.Item>
              )}
          </>
        )}
      </Form.List>
      {order.status !== OrderStatus.FULFILLED && (
        <div style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: '10px' }} onClick={onCancelHandler}>
            <FormattedMessage id="cancel" />
          </Button>
          <Button type="primary" htmlType="submit" loading={savingPackInfo}>
            <FormattedMessage id="save" />
          </Button>
        </div>
      )}
    </Form>
  );
};

PackageInfoForm.defaultProps = {
  onCancel: undefined,
  onOk: undefined
};

export default PackageInfoForm;
