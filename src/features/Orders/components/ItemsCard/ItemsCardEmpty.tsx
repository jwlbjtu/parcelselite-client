import { PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { Order } from '../../../../custom_types/order-page';
import { OrderStatus } from '../../../../shared/utils/constants';

interface ItemsCardEmptyProps {
  isCustom: boolean;
  order: Order;
  onAddItemClicked: () => void;
}

const ItemsCardEmpty = ({
  isCustom,
  order,
  onAddItemClicked
}: ItemsCardEmptyProps): ReactElement => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Space direction="vertical" size="large">
        <div>
          <FormattedMessage id="no_item" />
        </div>
        {order.status !== OrderStatus.FULFILLED && (
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={onAddItemClicked}
          >
            {isCustom ? (
              'Add item to customs'
            ) : (
              <FormattedMessage id="add_item" />
            )}
          </Button>
        )}
      </Space>
    </div>
  );
};

export default ItemsCardEmpty;
