import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Col, Divider, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import converter from 'convert-units';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Item, Order } from '../../../../custom_types/order-page';
import NoData from '../../../../shared/components/NoData';
import { selectPackagesUnits } from '../../../../redux/settings/settingSlice';
import { OrderStatus } from '../../../../shared/utils/constants';

interface ItemsCardTableProps {
  isCustom: boolean;
  columns: ColumnsType<any>;
  order: Order;
  addItemClicked: () => void;
}

const ItemsCardTable = ({
  addItemClicked,
  columns,
  order,
  isCustom
}: ItemsCardTableProps): ReactElement => {
  const packagesUnits = useSelector(selectPackagesUnits);
  const [itemList, setItemList] = useState<Item[] | undefined>();

  useEffect(() => {
    setItemList(isCustom ? order.customItems : order.items);
  }, [isCustom, order]);

  return (
    <div>
      <Table<Item>
        rowKey={(record) => record.id!}
        columns={columns}
        dataSource={itemList}
        size="small"
        pagination={false}
        locale={{
          emptyText: <NoData />
        }}
      />
      {order.orderStatus !== OrderStatus.FULFILLED && (
        <>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={addItemClicked}
            >
              {isCustom ? (
                'Add item to customs'
              ) : (
                <FormattedMessage id="add_item" />
              )}
            </Button>
          </div>
          <Divider style={{ marginTop: '10px', marginBottom: '5px' }} />{' '}
        </>
      )}
      <div>
        <div>
          <Row>
            <Col span={10}>
              <div>
                <FormattedMessage id="items_summary" />
              </div>
            </Col>
            <Col span={5}>
              <div>
                {itemList
                  ? itemList.reduce(
                      (result: number, ele: Item) => result + ele.quantity,
                      0
                    )
                  : 0}{' '}
                <FormattedMessage id="item_count" />
              </div>
            </Col>
            <Col span={5}>
              <div>
                {`${converter(
                  itemList
                    ? itemList.reduce(
                        (result: number, ele: Item) => result + ele.totalWeight,
                        0
                      )
                    : 0
                )
                  .from(
                    itemList
                      ? itemList[0].itemWeightUnit
                      : packagesUnits.weightUnit
                  )
                  .to(packagesUnits.weightUnit)
                  .toFixed(2)} ${packagesUnits.weightUnit}`}
              </div>
            </Col>
            <Col span={4}>
              <div>
                $
                {itemList
                  ? itemList
                      .reduce(
                        (result: number, ele: Item) => result + ele.totalValue,
                        0
                      )
                      .toFixed(2)
                  : 0}
              </div>
            </Col>
          </Row>
        </div>
        {!isCustom && order.orderAmount && (
          <div>
            <Row>
              <Col span={20}>
                <div>
                  <FormattedMessage id="order_total" />
                </div>
              </Col>
              <Col span={4}>
                <div>${order.orderAmount.toFixed(2)}</div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsCardTable;
