import { Form, Input, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form';
import React, { ReactElement } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import validateLib from 'validator';
import { Address, OrderAddress } from '../../custom_types/address-page';
import { Country, COUNTRY_NAMES, STATES } from '../utils/constants';

const { Option } = Select;

interface AddressFormProps {
  form: FormInstance<any>;
  address: OrderAddress | Address | undefined;
}

const AddressForm = ({ form, address }: AddressFormProps): ReactElement => {
  const intl = useIntl();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label={<FormattedMessage id="name" />}
        name="name"
        initialValue={address && address.name}
        rules={[
          {
            required: true,
            message: (
              <>
                <FormattedMessage id="name" />
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
        name="company"
        initialValue={address && address.company}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item
        label={<FormattedMessage id="email" />}
        name="email"
        initialValue={address && address.email}
        rules={[
          () => ({
            validator(rule, value) {
              if (!value || validateLib.isEmail(value)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  `${intl.formatMessage({
                    id: 'email'
                  })}${intl.formatMessage({ id: 'invalidFormat' })}`
                )
              );
            }
          })
        ]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item
        label={<FormattedMessage id="phone" />}
        name="phone"
        initialValue={address && address.phone}
        rules={[
          () => ({
            validator(rule, value) {
              if (!value) {
                return Promise.resolve();
              }
              if (/\D/.test(value)) {
                return Promise.reject(
                  new Error(
                    `${intl.formatMessage({
                      id: 'phone'
                    })} should be all numeric characters`
                  )
                );
              }
              return Promise.resolve();
            }
          })
        ]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item
        label={<FormattedMessage id="country" />}
        name="country"
        initialValue={(address && address.country) || Country.USA}
        required
      >
        <Select>
          <Option value={Country.USA}>{COUNTRY_NAMES[Country.USA]}</Option>
          <Option value={Country.CHINA}>{COUNTRY_NAMES[Country.CHINA]}</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label={<FormattedMessage id="street1" />}
        name="street1"
        initialValue={address && address.street1}
        rules={[
          {
            required: true,
            message: (
              <>
                <FormattedMessage id="street1" />
                <FormattedMessage id="requiredField" />
              </>
            )
          }
        ]}
      >
        <Input type="text" />
      </Form.Item>
      <Space size="large">
        <Form.Item
          style={{ width: '223px' }}
          label={<FormattedMessage id="street2" />}
          name="street2"
          initialValue={address && address.street2}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          style={{ width: '223px' }}
          label={<FormattedMessage id="city" />}
          name="city"
          initialValue={address && address.city}
          rules={[
            {
              required: true,
              message: (
                <>
                  <FormattedMessage id="city" />
                  <FormattedMessage id="requiredField" />
                </>
              )
            }
          ]}
        >
          <Input type="text" />
        </Form.Item>
      </Space>
      <Space size="large">
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.country !== currentValues.country
          }
        >
          {({ getFieldValue }) =>
            getFieldValue('country') === Country.USA ? (
              <Form.Item
                style={{ width: '223px' }}
                label={<FormattedMessage id="state" />}
                name="state"
                initialValue={address && address.state}
                rules={[
                  {
                    required: true,
                    message: (
                      <>
                        <FormattedMessage id="state" />
                        <FormattedMessage id="requiredField" />
                      </>
                    )
                  }
                ]}
              >
                <Select
                  showSearch
                  placeholder={<FormattedMessage id="searchSelect" />}
                  optionFilterProp="label"
                  options={Object.keys(STATES[Country.USA]).map((item) => {
                    return { label: STATES[Country.USA][item], value: item };
                  })}
                  filterOption={(input, option) => {
                    if (!option) return false;
                    if (!option.label) return false;
                    const findValue =
                      option.value
                        .toString()
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0;
                    if (findValue) {
                      return true;
                    }
                    const findLabel =
                      option.label
                        .toString()
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0;
                    return findLabel;
                  }}
                  filterSort={(optionA, optionB) =>
                    optionA.value
                      .toLowerCase()
                      .localeCompare(optionB.value.toLowerCase())
                  }
                />
              </Form.Item>
            ) : (
              <Form.Item
                style={{ width: '223px' }}
                label={<FormattedMessage id="state" />}
                name="state"
                initialValue={address && address.state}
                rules={[
                  {
                    required: true,
                    message: (
                      <>
                        <FormattedMessage id="state" />
                        <FormattedMessage id="requiredField" />
                      </>
                    )
                  }
                ]}
              >
                <Input type="text" />
              </Form.Item>
            )
          }
        </Form.Item>

        <Form.Item
          style={{ width: '223px' }}
          label={<FormattedMessage id="zip" />}
          name="zip"
          initialValue={address && address.zip}
          rules={[
            {
              required: true,
              message: (
                <>
                  <FormattedMessage id="zip" />
                  <FormattedMessage id="requiredField" />
                </>
              )
            },
            () => ({
              validator(_, value) {
                if (/^\d*$/.test(value) || value === undefined) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(intl.formatMessage({ id: 'wrong_format' }))
                );
              }
            })
          ]}
        >
          <Input type="text" />
        </Form.Item>
      </Space>
    </Form>
  );
};

export default AddressForm;
