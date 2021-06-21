import { Row, Col, Popover, Tag } from 'antd';
import React, { ReactElement } from 'react';
import convert from 'convert-units';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import {
  Item,
  OrderTabelColumnProps
} from '../../../../custom_types/order-page';
import './columns.css';

import { UI_ROUTES } from '../../../../shared/utils/constants';
import { selectPackagesUnits } from '../../../../redux/settings/settingSlice';

const ItemsColumnPopup = ({ record }: OrderTabelColumnProps): ReactElement => {
  const { items } = record;

  return (
    <>
      {items ? (
        <>
          {items.map((item) => {
            return (
              <Row style={{ minWidth: '150px' }} key={item.id}>
                <Col span={7}>
                  <Tag>{item.quantity}</Tag>
                </Col>
                <Col span={17}>
                  <Row>
                    <strong>{item.itemTitle}</strong>
                  </Row>
                  <Row>
                    <small>{item.sku}</small>
                  </Row>
                </Col>
              </Row>
            );
          })}
        </>
      ) : (
        <Row style={{ paddingTop: '11px', paddingBottom: '11px' }}>
          <FormattedMessage id="no_item" />
        </Row>
      )}
    </>
  );
};

const ItemsColumn = ({ record }: OrderTabelColumnProps): ReactElement => {
  const history = useHistory();
  const packageSetting = useSelector(selectPackagesUnits);
  const { id, items } = record;

  const computeTotalItemWeight = (itemsData: Item[]) => {
    const totalWeight = itemsData.reduce(
      (accumulator, item) => accumulator + item.quantity * item.itemWeight,
      0
    );

    const fromUnit = itemsData[0].itemWeightUnit;
    const result = convert(totalWeight)
      .from(fromUnit)
      .to(packageSetting.weightUnit)
      .toFixed(2);
    return `${result}${packageSetting.weightUnit}`;
  };

  const computeTotalValue = (itemsData: Item[]) => {
    const totalValue = itemsData.reduce(
      (accumulator, item) => accumulator + item.quantity * item.itemValue,
      0
    );

    return `$${totalValue.toFixed(2)}`;
  };

  return (
    <>
      {items && items.length > 0 ? (
        <Popover content={<ItemsColumnPopup record={record} />}>
          <Row
            className="default-column"
            onClick={() =>
              history.push(`${UI_ROUTES.ORDERS}${UI_ROUTES.DETAIL}/${id}`)
            }
          >
            <Col span={24}>
              <Row>
                <strong>
                  {items.length === 1
                    ? `${items[0].quantity}x ${items[0].itemTitle}`
                    : `${items.reduce(
                        (accumulator, item) => accumulator + item.quantity,
                        0
                      )} items`}
                </strong>
              </Row>
              <Row style={{ whiteSpace: 'pre' }}>
                {`${computeTotalItemWeight(items)}   ${computeTotalValue(
                  items
                )}`}
              </Row>
            </Col>
          </Row>
        </Popover>
      ) : (
        <Row
          className="default-column"
          style={{ paddingTop: '27px', paddingBottom: '27px' }}
          onClick={() =>
            history.push(`${UI_ROUTES.ORDERS}${UI_ROUTES.DETAIL}/${id}`)
          }
        >
          <FormattedMessage id="no_item" />
        </Row>
      )}
    </>
  );
};

export default ItemsColumn;
