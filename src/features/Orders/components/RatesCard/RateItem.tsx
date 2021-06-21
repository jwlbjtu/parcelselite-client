import { Card, Image, Space, Tag } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { Rate } from '../../../../custom_types/order-page';
import { getCarrierIcon } from '../../../../shared/utils/logo.helper';

import './RateItem.css';

interface RateItemProps {
  rate: Rate;
  selected: boolean;
  onClick: () => void;
}

const RateItem = ({ rate, selected, onClick }: RateItemProps): ReactElement => {
  return (
    <Card
      className={selected ? 'rate-item selected' : 'rate-item'}
      bodyStyle={{ padding: '8px' }}
      onClick={onClick}
    >
      <div>
        <Space style={{ float: 'left' }}>
          <Image
            style={{ width: '40px', height: '40px' }}
            preview={false}
            src={getCarrierIcon(rate.carrier)}
          />{' '}
          <div>
            <div>{rate.carrier}</div>
            <div>{rate.service}</div>
          </div>
          <div style={{ marginLeft: '20px' }}>
            {rate.isTest && (
              <Tag>
                <FormattedMessage id="testRate" />
              </Tag>
            )}
          </div>
        </Space>
        <div style={{ textAlign: 'right', float: 'right' }}>
          <div>
            <strong>
              <big>${rate.rate?.toFixed(2)}</big>
            </strong>
          </div>
          <div>{rate.eta}</div>
        </div>
      </div>
    </Card>
  );
};

export default RateItem;
