import {
  ExclamationCircleOutlined,
  ExclamationCircleTwoTone
} from '@ant-design/icons';
import { Col, Popover, Row, Alert } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import uniqid from 'uniqid';
import { OrderTabelColumnProps } from '../../../../../../custom_types/order-page';
import checkOrderRateErrors from '../../../../../../shared/utils/order.helper';

import '../../columns.css';

const ErrorComponent = ({ record }: OrderTabelColumnProps): ReactElement => {
  const [errors, setErrors] = useState<ReactElement[]>([]);

  useEffect(() => {
    setErrors(checkOrderRateErrors(record, true));
  }, [record]);

  return (
    <Popover
      title={
        <div>
          <ExclamationCircleTwoTone
            twoToneColor="#dfb136"
            style={{ marginRight: '10px' }}
          />
          <strong>
            <FormattedMessage id="rate_unavailable" />
          </strong>
        </div>
      }
      content={
        <Alert
          message={
            <strong>
              <FormattedMessage id="fix_following" />:
            </strong>
          }
          description={
            <ul>
              {errors?.map((ele, index) => (
                <li key={`${uniqid(index.toString())}`}>{ele}</li>
              ))}
              {record.errors?.map((ele, index) => (
                <li key={`${uniqid(index.toString())}`}>{ele}</li>
              ))}
            </ul>
          }
          type="warning"
        />
      }
    >
      <Row className="default-column">
        <Col className="icon-col" span={2}>
          <ExclamationCircleOutlined />
        </Col>
        <Col span={22}>
          <Row>
            <strong>
              <FormattedMessage id="rate_unavailable" />
            </strong>
          </Row>
        </Col>
      </Row>
    </Popover>
  );
};

export default ErrorComponent;
