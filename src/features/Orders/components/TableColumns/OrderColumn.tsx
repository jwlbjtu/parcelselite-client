import { Col, Image, Row, Tag } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Order } from '../../../../custom_types/order-page';
import {
  OrderStatus,
  Store,
  UI_ROUTES
} from '../../../../shared/utils/constants';
import { getStoreIcon } from '../../../../shared/utils/logo.helper';

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
      <Col className="icon-col" span={3}>
        {(record.orderId && record.company === Store.PARCELSELITE) ||
        record.company === Store.CSV_IMPORT ? null : (
          <Image
            style={{ width: '24px', height: '24px' }}
            src={getStoreIcon(record.company)}
            preview={false}
          />
        )}
      </Col>
      <Col style={{ paddingLeft: '.5rem' }} span={21}>
        <Row>{record.orderId ? <strong>{record.orderId}</strong> : '-'}</Row>
        <Row>
          <span>
            <FormattedDate
              value={new Date(record.orderDate)}
              year="numeric"
              month="2-digit"
              day="2-digit"
            />
          </span>
          {record.orderStatus === OrderStatus.FULFILLED && (
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
