import { Button, Image, Tag } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Address } from '../../../custom_types/address-page';
import { Shipment, ShipmentRate } from '../../../custom_types/shipment-page';
import { fetchTrackingHandler } from '../../../redux/shipments/shipmentSlice';
import { CARRIERS } from '../../../shared/utils/constants';
import { getCarrierLogo } from '../../../shared/utils/logo.helper';
import { getDisplayTracking } from '../../../shared/utils/rates.helper';

import './ShipmentTableColumns.css';

interface TrakingItemProps {
  record: Shipment;
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
          record.carrier,
          tracking,
          record.label.serviceId
        )}`} // TODO: can make a call to tracking API and update shipping status at the back
        target="blank"
      >
        {getDisplayTracking(record.carrier, tracking, record.label.serviceId)}
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
        {getDisplayTracking(record.carrier, tracking, record.label.serviceId)}
      </Button>
    </div>
  );
};

const ShipmentTableColumns = [
  {
    title: <FormattedMessage id="carrier" />,
    key: 'carrier',
    dataIndex: 'carrier',
    render: (carrier: string): ReactElement => {
      return (
        <div className="transation_table_cell">
          <Image
            style={{ width: '100px', height: '60px' }}
            src={getCarrierLogo(carrier)}
            preview={false}
          />
        </div>
      );
    }
  },
  {
    title: <FormattedMessage id="service" />,
    key: 'service',
    dataIndex: 'service',
    render: (service: string): ReactElement => {
      return <div className="transation_table_cell">{service}</div>;
    }
  },
  {
    title: <FormattedMessage id="tag" />,
    key: 'tags',
    dataIndex: 'tags',
    render: (tags: string[]): ReactElement => {
      return (
        <div className="transation_table_cell">
          {tags.map((tag) => {
            return <Tag key={tag}>{tag}</Tag>;
          })}
        </div>
      );
    }
  },
  {
    title: <FormattedMessage id="shipment_rate" />,
    key: 'rate',
    dataIndex: 'rate',
    render: (rate: ShipmentRate): ReactElement => {
      return (
        <div className="transation_table_cell">{`$${rate.amount.toFixed(
          2
        )}`}</div>
      );
    }
  },
  {
    title: <FormattedMessage id="recipient" />,
    key: 'recipient',
    dataIndex: 'recipient',
    render: (recipient: Address, record: Shipment): ReactElement => {
      return (
        <div className="transation_table_cell">
          <div>{`${recipient.company || recipient.name},${
            recipient.city
          }`}</div>
          {record.orderInfo && <div>{record.orderInfo}</div>}
        </div>
      );
    }
  },
  {
    title: <FormattedMessage id="date" />,
    key: 'createdAt',
    dataIndex: 'createdAt',
    render: (createdAt: string): ReactElement => {
      return (
        <div className="transation_table_cell">
          <FormattedDate
            value={new Date(createdAt)}
            year="numeric"
            month="2-digit"
            day="2-digit"
          />
        </div>
      );
    }
  },
  {
    title: <FormattedMessage id="tracking_status" />,
    key: 'tracking',
    dataIndex: 'tracking',
    render: (tracking: string, record: Shipment): ReactElement => {
      return (
        <div className="transation_table_cell">
          {record.carrier === CARRIERS.USPS ? (
            <USPSTrackingItem record={record} tracking={tracking} />
          ) : (
            <>
              {record.carrier === CARRIERS.DHL_ECOM ? (
                <DHLeCommerceTrackingItem record={record} tracking={tracking} />
              ) : (
                <div>
                  {getDisplayTracking(
                    record.carrier,
                    tracking,
                    record.label.serviceId
                  )}
                </div>
              )}
            </>
          )}
        </div>
      );
    }
  }
];

export default ShipmentTableColumns;
