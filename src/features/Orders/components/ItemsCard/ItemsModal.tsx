import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import convert from 'convert-units';
import { Item, ItemUpdateData } from '../../../../custom_types/order-page';
import {
  deleteOrderItemHandler,
  selectDeletingItem,
  selectLoading,
  setShowItemsModal,
  updateOrderItemHandler
} from '../../../../redux/orders/ordersSlice';
import { selectPackagesUnits } from '../../../../redux/settings/settingSlice';
import {
  Country,
  COUNTRY_NAMES,
  Currency,
  WeightUnit
} from '../../../../shared/utils/constants';

const { Option } = Select;

interface ItemsModalProps {
  show: boolean;
  orderId: string;
  item: Item | undefined;
  isCustom: boolean;
}

interface ItemFormData {
  country: Country;
  itemTitle: string;
  itemValue: number;
  itemValueCurrency: Currency;
  itemWeight: number;
  itemWeightUnit: WeightUnit;
  quantity: number;
  sku: string;
  hsTariffNumber?: string;
}

const ItemsModal = ({
  show,
  orderId,
  item,
  isCustom
}: ItemsModalProps): ReactElement => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const [form] = useForm();
  const loading = useSelector(selectLoading);
  const packageSetting = useSelector(selectPackagesUnits);
  const deleting = useSelector(selectDeletingItem);
  const [quantity, setQuantity] = useState(item ? item.quantity : 0);
  const [itemWeight, setItemWeight] = useState(
    item
      ? convert(item.itemWeight)
          .from(item.itemWeightUnit)
          .to(packageSetting.weightUnit)
      : 0
  );
  const [itemValue, setItemValue] = useState(item ? item.itemValue : 0);
  const [totalWeight, setTotalWeight] = useState(
    item
      ? convert(item.totalWeight)
          .from(item.itemWeightUnit)
          .to(packageSetting.weightUnit)
      : 0
  );
  const [totalValue, setTotalValue] = useState(item ? item.totalValue : 0);
  const [weightUnit, setWeightUnit] = useState(
    packageSetting.weightUnit || WeightUnit.LB
  );
  const [valueUnit, setValueUnit] = useState(
    item ? item.itemValueCurrency : Currency.USD
  );

  useEffect(() => {
    setQuantity(item ? item.quantity : 0);
    setItemWeight(
      item
        ? convert(item.itemWeight)
            .from(item.itemWeightUnit)
            .to(packageSetting.weightUnit)
        : 0
    );
    setItemValue(item ? item.itemValue : 0);
    setTotalWeight(
      item
        ? convert(item.totalWeight)
            .from(item.itemWeightUnit)
            .to(packageSetting.weightUnit)
        : 0
    );
    setTotalValue(item ? item.totalValue : 0);
    setWeightUnit(packageSetting.weightUnit || WeightUnit.LB);
    setValueUnit(item ? item.itemValueCurrency : Currency.USD);
    form.resetFields();
    form.setFieldsValue({
      itemTitle: item?.itemTitle,
      quantity: item ? item.quantity : 0,
      itemWeight: item
        ? convert(item.itemWeight)
            .from(item.itemWeightUnit)
            .to(packageSetting.weightUnit)
        : 0,
      itemValue: item ? item.itemValue : 0,
      itemWeightUnit: packageSetting.weightUnit || WeightUnit.LB,
      itemValueCurrency: item ? item.itemValueCurrency : Currency.USD,
      country: item?.country,
      sku: item?.sku,
      hsTariffNumber: item?.hsTariffNumber
    });
  }, [show, item, form, packageSetting]);

  const onOKHandler = () => {
    form
      .validateFields()
      .then((values: ItemFormData) => {
        const data: ItemUpdateData = {
          orderId,
          id: item?.id,
          ...values,
          totalValue,
          totalWeight,
          isCustom
        };
        dispatch(updateOrderItemHandler(data));
      })
      .catch((error) => {
        console.log('Form validation failed');
        console.log(error);
      });
  };

  const onQuancityChangeHandler = (
    value: number | string | null | undefined
  ) => {
    if (!value) {
      setQuantity(0);
      setTotalWeight(0.0);
      setTotalValue(0.0);
    } else {
      let data = value;
      if (typeof data === 'string') data = parseInt(data, 10);
      setQuantity(data);
      setTotalWeight(data * itemWeight);
      setTotalValue(data * itemValue);
    }
  };

  const onItemWeightChangeHandler = (
    value: number | string | null | undefined
  ) => {
    if (!value) {
      setItemWeight(0.0);
      setTotalWeight(0.0);
    } else {
      let data = value;
      if (typeof data === 'string') data = parseFloat(data);
      setItemWeight(data);
      setTotalWeight(data * quantity);
    }
  };

  const onItemValueChangeHandler = (
    value: number | string | null | undefined
  ) => {
    if (!value) {
      setItemValue(0.0);
      setTotalValue(0.0);
    } else {
      let data = value;
      if (typeof data === 'string') data = parseFloat(data);
      setItemValue(data);
      setTotalValue(data * quantity);
    }
  };

  const weightUnitChangeHandler = (value: WeightUnit) => {
    setWeightUnit(value);
  };

  const valueUnitChangeHandler = (value: Currency) => {
    setValueUnit(value);
  };

  const onCancelHandler = () => {
    dispatch(setShowItemsModal(false));
  };

  return (
    <Modal
      title={
        item ? (
          <>
            {isCustom ? (
              'Customs Item Detials'
            ) : (
              <FormattedMessage id="item_detail" />
            )}
          </>
        ) : (
          <>
            {isCustom ? 'New Customs Item' : <FormattedMessage id="new_item" />}
          </>
        )
      }
      visible={show}
      closable={false}
      footer={
        <div>
          <Row>
            <Col style={{ textAlign: 'left' }} span={15}>
              {item ? (
                <Button
                  type="link"
                  loading={deleting}
                  onClick={() =>
                    dispatch(deleteOrderItemHandler(item.id, isCustom))
                  }
                >
                  {isCustom ? (
                    'Delete Customs Item'
                  ) : (
                    <FormattedMessage id="deleteItem" />
                  )}
                </Button>
              ) : null}
            </Col>
            <Col span={9}>
              <Button onClick={onCancelHandler}>
                <FormattedMessage id="cancel" />
              </Button>
              <Button onClick={onOKHandler} type="primary" loading={loading}>
                <FormattedMessage id="save" />
              </Button>
            </Col>
          </Row>
        </div>
      }
    >
      <Form
        layout="vertical"
        form={form}
        style={{ maxWidth: '400px', margin: 'auto' }}
      >
        <Space>
          <Form.Item
            style={{ width: '260px' }}
            label={<FormattedMessage id="item_description" />}
            name="itemTitle"
            rules={[
              {
                required: true,
                message: (
                  <>
                    <FormattedMessage id="item_description" />
                    <FormattedMessage id="requiredField" />
                  </>
                )
              }
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="quantity" />}
            name="quantity"
            rules={[
              {
                required: true,
                message: (
                  <>
                    <FormattedMessage id="quantity" />
                    <FormattedMessage id="requiredField" />
                  </>
                )
              },
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
              style={{ width: '130px' }}
              min={0}
              step={1}
              precision={0}
              onChange={onQuancityChangeHandler}
            />
          </Form.Item>
        </Space>
        <Space>
          <Form.Item
            label={<FormattedMessage id="unit_weight" />}
            name="itemWeight"
            rules={[
              {
                required: true,
                message: (
                  <>
                    <FormattedMessage id="unit_weight" />
                    <FormattedMessage id="requiredField" />
                  </>
                )
              },
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
              style={{ width: '130px' }}
              min={0}
              precision={2}
              onChange={onItemWeightChangeHandler}
            />
          </Form.Item>
          <Form.Item style={{ width: '130px' }} label=" " name="itemWeightUnit">
            <Select onChange={weightUnitChangeHandler}>
              {Object.values(WeightUnit).map((unit) => {
                return (
                  <Option key={unit} value={unit}>
                    {unit}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          {totalWeight > 0 && (
            <Form.Item label=" ">
              <div style={{ color: '#7f8d93' }}>
                <FormattedMessage id="item_total" />{' '}
                {`${totalWeight.toFixed(2)} ${weightUnit}`}
              </div>
            </Form.Item>
          )}
        </Space>
        <Space>
          <Form.Item
            label={<FormattedMessage id="unit_value" />}
            name="itemValue"
            rules={[
              {
                required: true,
                message: (
                  <>
                    <FormattedMessage id="unit_value" />
                    <FormattedMessage id="requiredField" />
                  </>
                )
              },
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
              style={{ width: '130px' }}
              min={0}
              precision={2}
              onChange={onItemValueChangeHandler}
              value={itemValue}
            />
          </Form.Item>
          <Form.Item
            style={{ width: '130px' }}
            label=" "
            name="itemValueCurrency"
          >
            <Select onChange={valueUnitChangeHandler}>
              {Object.values(Currency).map((unit) => {
                return (
                  <Option key={unit} value={unit}>
                    {unit}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          {totalValue > 0 && (
            <Form.Item label=" ">
              <div style={{ color: '#7f8d93' }}>
                <FormattedMessage id="item_total" />{' '}
                {`$${totalValue.toFixed(2)}`}
              </div>
            </Form.Item>
          )}
        </Space>
        <Form.Item
          label={<FormattedMessage id="country_of_origin" />}
          name="country"
          rules={[
            {
              required: true,
              message: (
                <>
                  <FormattedMessage id="country_of_origin" />
                  <FormattedMessage id="requiredField" />
                </>
              )
            }
          ]}
        >
          <Select>
            <Option key={Country.CHINA} value={Country.CHINA}>
              {COUNTRY_NAMES[Country.CHINA]}
            </Option>
            <Option key={Country.USA} value={Country.USA}>
              {COUNTRY_NAMES[Country.USA]}
            </Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="SKU"
          name="sku"
          rules={[
            {
              required: isCustom,
              message: (
                <>
                  SKU <FormattedMessage id="requiredField" />
                </>
              )
            }
          ]}
        >
          <Input type="text" />
        </Form.Item>
        {isCustom && (
          <Form.Item label="Harmonization Code(HS/HTS)" name="hsTariffNumber">
            <Input type="text" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ItemsModal;
