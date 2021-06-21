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
import { COUNTRY_NAMES, UI_ROUTES } from '../../../../shared/utils/constants';
import { getCountryIcon } from '../../../../shared/utils/logo.helper';

import './columns.css';

const CusomterColumnPopup = ({
  record
}: OrderTabelColumnProps): ReactElement => {
  const { recipient, id } = record;
  const dispatch = useDispatch();
  return (
    <div style={{ width: '200px' }}>
      <div>
        <strong>{recipient.company || recipient.name}</strong>
      </div>
      <div>
        <small>{recipient.street1}</small>
      </div>
      <div>
        <small>{recipient.street2}</small>
      </div>
      <div>
        <small>{`${recipient.city}, ${recipient.state} ${recipient.zip}`}</small>
      </div>
      <div>
        <small>{COUNTRY_NAMES[recipient.country]}</small>
      </div>
      <div>
        <small>
          <a className="dark-link" href={`mailto:${recipient.email}`}>
            {recipient.email}
          </a>
        </small>
      </div>
      <div>
        <small>
          <a className="dark-link" href={`tel:${recipient.phone}`}>
            {recipient.phone}
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
            <strong>
              <small>
                <FormattedMessage id="editRecipient" />
              </small>
            </strong>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const CustomerColumn = ({ record }: OrderTabelColumnProps): ReactElement => {
  const history = useHistory();
  const { id, recipient } = record;

  return (
    <Popover content={<CusomterColumnPopup record={record} />}>
      <Row
        className="default-column"
        onClick={() =>
          history.push(`${UI_ROUTES.ORDERS}${UI_ROUTES.DETAIL}/${id}`)
        }
      >
        <Col className="icon-col" span={4}>
          {recipient.country && (
            <Image
              style={{ width: '18px', height: '18px' }}
              src={getCountryIcon(recipient.country)}
              preview={false}
            />
          )}
        </Col>
        <Col span={20}>
          <Row>
            <strong>{recipient.name}</strong>
          </Row>
          <Row>
            <span>{`${recipient.city}, ${recipient.state} ${recipient.zip}`}</span>
          </Row>
        </Col>
      </Row>
    </Popover>
  );
};

export default CustomerColumn;
