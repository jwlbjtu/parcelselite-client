import { Card } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { Order } from '../../../custom_types/order-page';
import PackageInfoForm from './PackageInfoForm';

interface PackageInfoCardProps {
  order: Order;
}

const PackageInfoCard = ({ order }: PackageInfoCardProps): ReactElement => {
  return (
    <Card
      style={{ marginTop: '20px' }}
      size="small"
      title={
        <strong style={order.packageInfo ? {} : { color: 'red' }}>
          <FormattedMessage id="packageInfo" />
        </strong>
      }
    >
      <PackageInfoForm order={order} onOrderPage={false} />
    </Card>
  );
};

export default PackageInfoCard;
