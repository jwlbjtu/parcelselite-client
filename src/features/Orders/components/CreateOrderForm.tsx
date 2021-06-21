import { Card, Form, Input, Select, Space } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import validateLib from 'validator';
import {
  Country,
  COUNTRY_NAMES,
  STATES
} from '../../../shared/utils/constants';

const { Option } = Select;

interface CreateOrderFormProps {
  title: string;
}

const CreateOrderForm = ({ title }: CreateOrderFormProps): ReactElement => {
  const intl = useIntl();

  return (
    <Card
      title={<FormattedMessage id={title.toLowerCase()} />}
      headStyle={{ backgroundColor: '#fbfbfb' }}
    >
      <Space>
        <Form.Item
          style={{ width: '227px' }}
          label={<FormattedMessage id="name" />}
          name={`${title.toLowerCase()}-name`}
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
          name={`${title.toLowerCase()}-company`}
        >
          <Input type="text" />
        </Form.Item>
      </Space>
      <Space>
        <Form.Item
          style={{ width: '227px' }}
          label={<FormattedMessage id="email" />}
          name={`${title.toLowerCase()}-email`}
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
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="phone" />}
          name={`${title.toLowerCase()}-phone`}
          rules={[
            {
              required: true,
              message: (
                <>
                  <FormattedMessage id="phone" />
                  <FormattedMessage id="requiredField" />
                </>
              )
            },
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
      </Space>
      <div style={{ marginBottom: '20px' }}>
        <strong>
          {title === 'Sender' ? (
            <FormattedMessage id="from" />
          ) : (
            <FormattedMessage id="to" />
          )}
        </strong>
      </div>
      <Form.Item
        label={<FormattedMessage id="street1" />}
        name={`${title.toLowerCase()}-street1`}
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
      <Form.Item
        label={<FormattedMessage id="street2" />}
        name={`${title.toLowerCase()}-street2`}
      >
        <Input type="text" />
      </Form.Item>
      <Space>
        <Form.Item
          style={{ width: '227px' }}
          label={<FormattedMessage id="country" />}
          name={`${title.toLowerCase()}-country`}
          rules={[
            {
              required: true,
              message: (
                <>
                  <FormattedMessage id="country" />
                  <FormattedMessage id="requiredField" />
                </>
              )
            }
          ]}
        >
          <Select>
            <Option value={Country.USA}>{COUNTRY_NAMES[Country.USA]}</Option>
            <Option value={Country.CHINA}>
              {COUNTRY_NAMES[Country.CHINA]}
            </Option>
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues[`${title.toLowerCase()}-country`] !==
            currentValues[`${title.toLowerCase()}-country`]
          }
        >
          {({ getFieldValue }) =>
            getFieldValue(`${title.toLowerCase()}-country`) === Country.USA ? (
              <Form.Item
                style={{ width: '163px' }}
                label={<FormattedMessage id="state" />}
                name={`${title.toLowerCase()}-state`}
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
                style={{ width: '163px' }}
                label={<FormattedMessage id="state" />}
                name={`${title.toLowerCase()}-state`}
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
      </Space>
      <Space>
        <Form.Item
          style={{ width: '227px' }}
          label={<FormattedMessage id="city" />}
          name={`${title.toLowerCase()}-city`}
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
        <Form.Item
          label={<FormattedMessage id="zip" />}
          name={`${title.toLowerCase()}-zip`}
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
    </Card>
  );
};

export default CreateOrderForm;
