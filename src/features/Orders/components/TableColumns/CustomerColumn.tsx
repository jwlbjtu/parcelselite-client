import { Row, Col, Image, Popover, Button, Divider } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { OrderTabelColumnProps } from '../../../../custom_types/order-page';
import {
  setPurchasingOrderId,
  setShowOrderAddressModal
} from '../../../../redux/orders/ordersSlice';
import {
  COUNTRY_NAMES,
  OrderStatus,
  UI_ROUTES
} from '../../../../shared/utils/constants';
import { getCountryIcon } from '../../../../shared/utils/logo.helper';

import './columns.css';

const CusomterColumnPopup = ({
  record
}: OrderTabelColumnProps): ReactElement => {
  const { toAddress, id } = record;
  const dispatch = useDispatch();
  return (
    <div style={{ width: '200px' }}>
      <div>
        <strong>{toAddress.company || toAddress.name}</strong>
      </div>
      <div>
        <small>{toAddress.street1}</small>
      </div>
      <div>
        <small>{toAddress.street2}</small>
      </div>
      <div>
        <small>{`${toAddress.city}, ${toAddress.state} ${toAddress.zip}`}</small>
      </div>
      <div>
        <small>{COUNTRY_NAMES[toAddress.country]}</small>
      </div>
      <div>
        <small>
          <a className="dark-link" href={`mailto:${toAddress.email}`}>
            {toAddress.email}
          </a>
        </small>
      </div>
      <div>
        <small>
          <a className="dark-link" href={`tel:${toAddress.phone}`}>
            {toAddress.phone}
          </a>
        </small>
      </div>
      <Divider style={{ margin: 0 }} />
      <Row>
        <Col span={13} />
        <Col span={11}>
          <Button
            className="dark-link"
            size="small"
            type="link"
            onClick={() => {
              dispatch(setPurchasingOrderId(id));
              dispatch(setShowOrderAddressModal(true));
            }}
          >
            {record.status !== OrderStatus.FULFILLED && (
              <strong>
                <small>
                  <FormattedMessage id="editRecipient" />
                </small>
              </strong>
            )}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const CustomerColumn = ({ record }: OrderTabelColumnProps): ReactElement => {
  const history = useHistory();
  const { id, toAddress } = record;

  return (
    <Popover content={<CusomterColumnPopup record={record} />}>
      <Row
        className="default-column"
        onClick={() =>
          history.push(`${UI_ROUTES.ORDERS}${UI_ROUTES.DETAIL}/${id}`)
        }
      >
        <Col className="icon-col" span={4}>
          {toAddress.country && (
            <Image
              style={{ width: '18px', height: '18px' }}
              src={getCountryIcon(toAddress.country)}
              preview={false}
            />
          )}
        </Col>
        <Col span={20}>
          <Row>
            <strong>{toAddress.name}</strong>
          </Row>
          <Row>
            <span>{`${toAddress.city}, ${toAddress.state} ${toAddress.zip}`}</span>
          </Row>
        </Col>
      </Row>
    </Popover>
  );
};

export default CustomerColumn;
