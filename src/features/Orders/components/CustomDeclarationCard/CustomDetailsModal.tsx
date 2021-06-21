import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Modal,
  Space,
  Tooltip,
  Select,
  Checkbox,
  Button
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { CustomDeclaration, Order } from '../../../../custom_types/order-page';
import {
  selectLoading,
  updateOrderHanlder
} from '../../../../redux/orders/ordersSlice';
import {
  B13A_OPTION,
  EEL_PFC,
  INCOTERM,
  NON_DELIVERY_HANDLING,
  TAX_ID_TYPE,
  TYPE_OF_CONTENT
} from '../../../../shared/utils/constants';

const { Option } = Select;

interface FormLabelWithDetailsProps {
  title: string;
  description: string | ReactElement;
}

const FormLabelWithDetails = ({
  title,
  description
}: FormLabelWithDetailsProps): ReactElement => {
  return (
    <Space size="small">
      <div>{title}</div>
      <Tooltip placement="topLeft" title={description}>
        <QuestionCircleOutlined />
      </Tooltip>
    </Space>
  );
};

interface CustomDetailModalProps {
  show: boolean;
  order: Order;
  onCancel: () => void;
}

const CustomDetailModal = ({
  show,
  order,
  onCancel
}: CustomDetailModalProps): ReactElement => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const [agreeTerm, setAgreeTerm] = useState(true);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    form.resetFields();
    setAgreeTerm(true);
  }, [form]);

  const onFormSubmit = () => {
    form.validateFields().then((values: CustomDeclaration) => {
      dispatch(
        updateOrderHanlder({
          id: order.id,
          customDeclaration: values
        })
      );
    });
  };

  const onCancelHandler = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Custom Details"
      visible={show}
      closable={false}
      footer={
        <div>
          <Button onClick={onCancelHandler}>
            <FormattedMessage id="cancel" />
          </Button>
          <Button
            type="primary"
            onClick={onFormSubmit}
            disabled={!agreeTerm}
            loading={loading}
          >
            <FormattedMessage id="save" />
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form}>
        <Space style={{ width: '100%' }} size="middle">
          <Form.Item
            style={{ width: '223px' }}
            label={
              <FormLabelWithDetails
                title="Type of Content"
                description="What type of contents do you send?"
              />
            }
            name="typeOfContent"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="requiredField" />
              }
            ]}
            initialValue={
              order.customDeclaration && order.customDeclaration.typeOfContent
            }
          >
            <Select>
              {Object.keys(TYPE_OF_CONTENT).map((key) => {
                const value = TYPE_OF_CONTENT[key];
                return (
                  <Option value={value} key={value}>
                    {value}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            style={{ width: '223px' }}
            label={
              <FormLabelWithDetails
                title="Incoterm"
                description="Selection indicates who pays for custom charges (duties & taxes). Default is DDU (Receiver)"
              />
            }
            name="incoterm"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="requiredField" />
              }
            ]}
            initialValue={
              order.customDeclaration && order.customDeclaration.incoterm
            }
          >
            <Select>
              {Object.keys(INCOTERM).map((key) => {
                const value = INCOTERM[key];
                return (
                  <Option value={value.value} key={value.value}>
                    {value.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Space>
        <Form.Item
          noStyle
          shouldUpdate={(preValue, curValue) =>
            preValue.typeOfContent !== curValue.typeOfContent
          }
        >
          {({ getFieldValue }) =>
            getFieldValue('typeOfContent') === TYPE_OF_CONTENT.OTHER ? (
              <Form.Item
                name="typeOfContentOther"
                label={
                  <FormLabelWithDetails
                    title="Content Explanation"
                    description="Describe the type of content"
                  />
                }
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="requiredField" />
                  }
                ]}
              >
                <Input type="text" />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Space style={{ width: '100%' }} size="middle">
          <Form.Item
            style={{ width: '223px' }}
            label={
              <FormLabelWithDetails
                title="Exporter reference"
                description="Your reference if you are a certified exporter (optional)"
              />
            }
            name="exporterRef"
            initialValue={
              order.customDeclaration && order.customDeclaration.exporterRef
            }
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            style={{ width: '223px' }}
            label={
              <FormLabelWithDetails
                title="Importer reference"
                description="Your reference if you are a certified importer (optional)"
              />
            }
            name="importerRef"
            initialValue={
              order.customDeclaration && order.customDeclaration.importerRef
            }
          >
            <Input type="text" />
          </Form.Item>
        </Space>
        <Space style={{ width: '100%' }} size="middle">
          <Form.Item
            style={{ width: '223px' }}
            label={
              <FormLabelWithDetails
                title="Invoice"
                description="Your invoice number which will be printed on the custom declaration"
              />
            }
            name="invoice"
            initialValue={
              order.customDeclaration && order.customDeclaration.invoice
            }
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            style={{ width: '223px' }}
            label={
              <FormLabelWithDetails
                title="Non-delivery handling"
                description="What should be done when the delivery is not possible? Selecting return might cause additional charges later"
              />
            }
            name="nonDeliveryHandling"
            initialValue={
              order.customDeclaration &&
              order.customDeclaration.nonDeliveryHandling
            }
          >
            <Select>
              {Object.keys(NON_DELIVERY_HANDLING).map((key) => {
                const value = NON_DELIVERY_HANDLING[key];
                return (
                  <Option value={value} key={value}>
                    {value}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Space>
        <Space style={{ width: '100%' }} size="middle">
          <Form.Item
            style={{ width: '223px' }}
            label={
              <FormLabelWithDetails
                title="License"
                description="The license identifier you need for some types of shipments (optional)"
              />
            }
            name="license"
            initialValue={
              order.customDeclaration && order.customDeclaration.license
            }
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            style={{ width: '223px' }}
            label={
              <FormLabelWithDetails
                title="Certificate"
                description="The certificate identifier you need for some types of shipments (optional)"
              />
            }
            name="certificate"
            initialValue={
              order.customDeclaration && order.customDeclaration.certificate
            }
          >
            <Input type="text" />
          </Form.Item>
        </Space>
        <Form.Item
          label={
            <FormLabelWithDetails
              title="Signing person"
              description="The responsible person signing this custom declaration. Must be the one filling this out (required). For USPS this field is not changable, it will be automatically set to the sender's name"
            />
          }
          name="signingPerson"
          initialValue={
            order.customDeclaration && order.customDeclaration.signingPerson
          }
          rules={[
            { required: true, message: <FormattedMessage id="required" /> }
          ]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          label={
            <FormLabelWithDetails
              title="Tax ID Type"
              description="Tax IDs are unique identifiers assigned to a business entity for tax purposes. Examples include EIN(Employer Identification Number), and VAT(Value Added Tax) numbers. ParcelsElite dose not accept persinally identifying Tax IDs, such as Social Security Numbers."
            />
          }
          name="taxIdType"
          initialValue={
            order.customDeclaration && order.customDeclaration.taxIdType
          }
        >
          <Select>
            {Object.keys(TAX_ID_TYPE).map((key) => {
              const value = TAX_ID_TYPE[key];
              return (
                <Option value={value} key={value}>
                  {value}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label={
            <FormLabelWithDetails
              title="EEL/PFC"
              description="Exemption or Exclusion Legend(EEL) or a Proof of Filing Citation(PFC). Only require in specific cases (optional). For most merchants, choose NOEEI 30 36 for shipments from the US or CA or NOEEI 30 37(a) for any other shipments from the US"
            />
          }
          name="eelpfc"
          initialValue={
            order.customDeclaration && order.customDeclaration.eelpfc
          }
        >
          <Select>
            {Object.keys(EEL_PFC).map((key) => {
              const value = EEL_PFC[key];
              return (
                <Option value={value} key={value}>
                  {value}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label={
            <FormLabelWithDetails
              title="B13A Option"
              description="
                  B13A Option details are obtained by filling a B13A Canada
                  Export Declaration via the Canadian Export Reporting
                  System(CERS). Optional.
                "
            />
          }
          name="b13a"
          initialValue={order.customDeclaration && order.customDeclaration.b13a}
        >
          <Select>
            {Object.keys(B13A_OPTION).map((key) => {
              const value = B13A_OPTION[key];
              return (
                <Option value={value} key={value}>
                  {value}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label={
            <FormLabelWithDetails
              title="Notes"
              description="Any notes that might be relevent for customs processing. (optional)"
            />
          }
          name="notes"
          initialValue={
            order.customDeclaration && order.customDeclaration.notes
          }
        >
          <Input.TextArea
            maxLength={200}
            autoSize={{ minRows: 4, maxRows: 4 }}
            allowClear
            showCount
          />
        </Form.Item>
        <Form.Item>
          <Checkbox
            checked={agreeTerm}
            onChange={() => setAgreeTerm(!agreeTerm)}
          >
            I certify the validity of the information prvided
            <sup style={{ color: 'red' }}>*</sup>
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomDetailModal;
