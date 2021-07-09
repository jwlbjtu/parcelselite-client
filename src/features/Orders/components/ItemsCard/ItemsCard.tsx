import { Button, Card, Space, Tabs } from 'antd';
import React, { ReactElement, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import converter from 'convert-units';
import {
  ExclamationCircleTwoTone,
  FileDoneOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Item, Order } from '../../../../custom_types/order-page';
import {
  selectShowItemsModal,
  setShowItemsModal
} from '../../../../redux/orders/ordersSlice';
import ItemsCardEmpty from './ItemsCardEmpty';
import ItemsModal from './ItemsModal';
import { selectPackagesUnits } from '../../../../redux/settings/settingSlice';
import ItemsCardTable from './ItemsCardTable';
import { OrderStatus } from '../../../../shared/utils/constants';
import { isOrderInternational } from '../../../../shared/utils/helpers';

const { TabPane } = Tabs;

interface ItemsCardProps {
  order: Order;
}

const ItemsCard = ({ order }: ItemsCardProps): ReactElement => {
  const dispatch = useDispatch();
  const showModal = useSelector(selectShowItemsModal);
  const packagesUnits = useSelector(selectPackagesUnits);
  const [curItem, setCurItem] = useState<Item | undefined>();
  const [isCustom, setIsCustom] = useState(false);

  const itemClickedHandler = (record: Item, isCustomItem: boolean) => {
    setCurItem(record);
    setIsCustom(isCustomItem);
    dispatch(setShowItemsModal(true));
  };

  const addItemClickedHandler = (isCustomItem: boolean) => {
    setCurItem(undefined);
    setIsCustom(isCustomItem);
    dispatch(setShowItemsModal(true));
  };

  const getFirstCol = (isCustomItem: boolean) => {
    let firstCol = {
      title: (
        <small>
          <FormattedMessage id="item" />
        </small>
      ),
      key: 'itemTitle',
      dataIndex: 'itemTitle',
      render: (title: string, record: Item): ReactElement => {
        return (
          <div style={{ padding: '8px' }}>
            <small>
              <strong>{title}</strong>
            </small>
            <div>
              <small>{record.sku ? `SKU: ${record.sku}` : '-'}</small>
            </div>
          </div>
        );
      }
    };
    if (order.status !== OrderStatus.FULFILLED) {
      firstCol = {
        title: (
          <small>
            <FormattedMessage id="item" />
          </small>
        ),
        key: 'itemTitle',
        dataIndex: 'itemTitle',
        render: (title: string, record: Item): ReactElement => {
          return (
            <div style={{ padding: '8px' }}>
              <Button
                style={{ paddingLeft: 0 }}
                type="link"
                onClick={() => itemClickedHandler(record, isCustomItem)}
              >
                <small>
                  <strong>{title}</strong>
                </small>
              </Button>
              <div>
                <small>{record.sku ? `SKU: ${record.sku}` : '-'}</small>
              </div>
            </div>
          );
        }
      };
    }
    return firstCol;
  };

  const columns = [
    {
      title: (
        <small>
          <FormattedMessage id="quantity" />
        </small>
      ),
      key: 'quantity',
      dataIndex: 'quantity',
      render: (quantity: number): ReactElement => {
        return <div style={{ padding: '8px' }}>{quantity}</div>;
      }
    },
    {
      title: (
        <small>
          <FormattedMessage id="weight" />
        </small>
      ),
      key: 'totalWeight',
      dataIndex: 'totalWeight',
      render: (totalWeight: number, record: Item): ReactElement => {
        return (
          <div style={{ padding: '8px' }}>
            {`${converter(totalWeight)
              .from(record.itemWeightUnit)
              .to(packagesUnits.weightUnit)
              .toFixed(2)} ${packagesUnits.weightUnit}`}
          </div>
        );
      }
    },
    {
      title: (
        <small>
          <FormattedMessage id="value" />
        </small>
      ),
      key: 'totalValue',
      dataIndex: 'totalValue',
      render: (totalValue: number): ReactElement => {
        return <div style={{ padding: '8px' }}>${totalValue.toFixed(2)}</div>;
      }
    }
  ];

  return (
    <Card
      size="small"
      style={{ marginBottom: '25px' }}
      title={
        <strong
          style={
            isOrderInternational(order) &&
            (!order.customItems || order.customItems.length === 0)
              ? { color: 'red' }
              : {}
          }
        >
          <FormattedMessage id="items" />
        </strong>
      }
    >
      <ItemsModal
        orderId={order.id}
        show={showModal}
        item={curItem}
        isCustom={isCustom}
      />
      {order.status === OrderStatus.FULFILLED && (
        <Space
          style={{
            padding: '15px 20px',
            backgroundColor: '#f3f7fa',
            width: '100%',
            marginBottom: '10px'
          }}
        >
          <FileDoneOutlined style={{ fontSize: '28px' }} />{' '}
          <div style={{ fontSize: '14px' }}>
            <FormattedMessage id="fulfilled_order_items" />
          </div>
        </Space>
      )}
      {isOrderInternational(order) &&
        (!order.customItems || order.customItems.length === 0) && (
          <Space
            style={{
              padding: '15px 20px',
              backgroundColor: '#f3f7fa',
              width: '100%',
              marginBottom: '10px'
            }}
          >
            <FileTextOutlined style={{ fontSize: '28px' }} />{' '}
            <div style={{ fontSize: '14px' }}>
              At lease one item is required to complete the customs declaration
            </div>
          </Space>
        )}
      <Tabs
        size="small"
        defaultActiveKey={isOrderInternational(order) ? 'customs' : 'orders'}
      >
        <TabPane tab="Order" key="orders">
          {order && order.items && order.items.length > 0 ? (
            <ItemsCardTable
              isCustom={false}
              columns={[getFirstCol(false), ...columns]}
              order={order}
              addItemClicked={() => addItemClickedHandler(false)}
            />
          ) : (
            <ItemsCardEmpty
              isCustom={false}
              order={order}
              onAddItemClicked={() => addItemClickedHandler(false)}
            />
          )}
        </TabPane>
        {isOrderInternational(order) && (
          <TabPane
            tab={
              <div>
                {(!order.customItems || order.customItems.length === 0) && (
                  <ExclamationCircleTwoTone
                    style={{ marginRight: '3px' }}
                    twoToneColor="red"
                  />
                )}
                Customs
              </div>
            }
            key="customs"
          >
            {order && order.customItems && order.customItems.length > 0 ? (
              <ItemsCardTable
                isCustom
                columns={[getFirstCol(true), ...columns]}
                order={order}
                addItemClicked={() => addItemClickedHandler(true)}
              />
            ) : (
              <ItemsCardEmpty
                isCustom
                order={order}
                onAddItemClicked={() => addItemClickedHandler(true)}
              />
            )}
          </TabPane>
        )}
      </Tabs>
    </Card>
  );
};

export default ItemsCard;
