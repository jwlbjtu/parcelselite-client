import { Button, Col, Image, Row, Typography } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Order } from '../../../../custom_types/order-page';
import { fetchTrackingHandler } from '../../../../redux/shipments/shipmentSlice';
import { CARRIERS } from '../../../../shared/utils/constants';
import { getCarrierIcon } from '../../../../shared/utils/logo.helper';
import { getDisplayTracking } from '../../../../shared/utils/rates.helper';

const { Paragraph } = Typography;

interface LabelComponentProps {
  order: Order;
}

interface TrakingItemProps {
  record: Order;
  tracking: string;
}

const USPSTrackingItem = ({
  record,
  tracking
}: TrakingItemProps): ReactElement => {
  return (
    <div>
      <a
        href={`https://tools.usps.com/go/TrackConfirmAction_input?origTrackNum=${getDisplayTracking(
          record.carrier!,
          tracking,
          record.service!.name
        )}`} // TODO: can make a call to tracking API and update shipping status at the back
        target="blank"
      >
        {getDisplayTracking(record.carrier!, tracking, record.service!.name)}
      </a>
    </div>
  );
};

const UPSTrackingItem = ({
  record,
  tracking
}: TrakingItemProps): ReactElement => {
  return (
    <div>
      <a
        href={`https://www.ups.com/track?loc=null&tracknum=${getDisplayTracking(
          record.carrier!,
          tracking,
          record.service!.name
        )}&requester=WT/trackdetails`} // TODO: can make a call to tracking API and update shipping status at the back
        target="blank"
      >
        {getDisplayTracking(record.carrier!, tracking, record.service!.name)}
      </a>
    </div>
  );
};

const DHLeCommerceTrackingItem = ({
  record,
  tracking
}: TrakingItemProps): ReactElement => {
  const dispatch = useDispatch();
  return (
    <div>
      {record.trackingStatus && (
        <div>
          <small>{record.trackingStatus}</small>
        </div>
      )}
      <Button
        style={{ paddingLeft: '0px', paddingTop: '0px' }}
        type="link"
        onClick={() => dispatch(fetchTrackingHandler(record.id))}
      >
        {getDisplayTracking(record.carrier!, tracking, record.service!.name)}
      </Button>
    </div>
  );
};

const LabelComponent = ({ order }: LabelComponentProps): ReactElement => {
  return (
    <Row className="default-column">
      <Col className="icon-col" span={4}>
        <Image
          src={getCarrierIcon(order.carrier!)}
          preview={false}
          style={{ width: '24px', height: '24px' }}
        />
      </Col>
      <Col span={20}>
        <Row>{order.carrier!}</Row>
        <Row>{order.service!.name}</Row>
        <Row>
          <Paragraph
            style={{ margin: 0 }}
            copyable={{
              text: getDisplayTracking(
                order.carrier!,
                order.trackingId!,
                order.service!.name
              ),
              tooltips: [
                <FormattedMessage id="copy" />,
                <FormattedMessage id="copied" />
              ]
            }}
          >
            <div style={{ float: 'left' }}>
              {order.carrier === CARRIERS.UPS && (
                <UPSTrackingItem record={order} tracking={order.trackingId!} />
              )}
              {order.carrier === CARRIERS.USPS && (
                <USPSTrackingItem record={order} tracking={order.trackingId!} />
              )}
              {order.carrier === CARRIERS.DHL_ECOM && (
                <DHLeCommerceTrackingItem
                  record={order}
                  tracking={order.trackingId!}
                />
              )}
            </div>
          </Paragraph>
        </Row>
      </Col>
    </Row>
  );
};

export default LabelComponent;
