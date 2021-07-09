import { Col, Row, Tag } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Order } from '../../../../custom_types/order-page';
import { OrderStatus, UI_ROUTES } from '../../../../shared/utils/constants';

import './columns.css';

interface OrderColumnProps {
  record: Order;
}

const OrderColumn = ({ record }: OrderColumnProps): ReactElement => {
  const history = useHistory();
  return (
    <Row
      className="default-column"
      onClick={() =>
        history.push(`${UI_ROUTES.ORDERS}${UI_ROUTES.DETAIL}/${record.id}`)
      }
    >
      <Col style={{ paddingLeft: '.5rem' }}>
        <Row>{record.orderId}</Row>
        <Row>
          <span>
            <FormattedDate
              value={record.createdAt}
              year="numeric"
              month="2-digit"
              day="2-digit"
            />
          </span>
          {record.status === OrderStatus.FULFILLED && (
            <Tag style={{ marginLeft: '20px' }} color="success">
              <FormattedMessage id="shipped" />
            </Tag>
          )}
        </Row>
      </Col>
    </Row>
  );
};

export default OrderColumn;
