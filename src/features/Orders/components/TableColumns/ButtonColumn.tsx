import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Row } from 'antd';
import React, { ReactElement, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { OrderTabelColumnProps } from '../../../../custom_types/order-page';
import {
  setPurchasingOrderId,
  setShowBuyModal
} from '../../../../redux/orders/ordersSlice';
import { selectLabels } from '../../../../redux/settings/settingSlice';
import { OrderStatus, UI_ROUTES } from '../../../../shared/utils/constants';
import {
  downloadLabelsHandler,
  downloadPackSlipHandler
} from '../../../../shared/utils/pdf.helpers';

import './columns.css';

const ButtonColumn = ({ record }: OrderTabelColumnProps): ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const labelSettings = useSelector(selectLabels);
  const { id, rates, orderStatus, errors, labels, selectedRate } = record;

  const dropdownMenu = (
    <Menu>
      {(orderStatus === OrderStatus.FULFILLED || selectedRate) && (
        <Menu.Item
          onClick={() =>
            history.push(`${UI_ROUTES.ORDERS}${UI_ROUTES.DETAIL}/${id}`)
          }
        >
          {orderStatus === OrderStatus.FULFILLED ? (
            <FormattedMessage id="create_another_label" />
          ) : (
            <FormattedMessage id="viewOrder" />
          )}
        </Menu.Item>
      )}
      <Menu.Item
        onClick={() =>
          downloadPackSlipHandler(record, labelSettings.packSlipSettings.format)
        }
      >
        <FormattedMessage id="downloadPackSlip" />
      </Menu.Item>
      {false && (
        <Menu.Item>
          <FormattedMessage id="hideOrder" />
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <>
      <Row className="default-column">
        {orderStatus === OrderStatus.FULFILLED ? (
          <>
            <Button
              type="primary"
              onClick={() =>
                downloadLabelsHandler(
                  labels,
                  labelSettings.labelSettings.format
                )
              }
              style={{ minWidth: '104px' }}
            >
              <strong>
                <FormattedMessage id="download" />
              </strong>
            </Button>
            <Dropdown overlay={dropdownMenu} trigger={['click']}>
              <Button type="primary" icon={<DownOutlined />} />
            </Dropdown>
          </>
        ) : (
          <>
            {(errors && errors.length > 0) || record.rateLoading ? (
              <>
                <Button
                  style={{
                    backgroundColor: '#9fce52',
                    color: '#fff',
                    minWidth: '104px'
                  }}
                  onClick={() =>
                    history.push(`${UI_ROUTES.ORDERS}${UI_ROUTES.DETAIL}/${id}`)
                  }
                >
                  <FormattedMessage id="viewOrder" />
                </Button>
                <Dropdown overlay={dropdownMenu} trigger={['click']}>
                  <Button
                    style={{ backgroundColor: '#9fce52', color: '#fff' }}
                    icon={<DownOutlined />}
                  />
                </Dropdown>
              </>
            ) : (
              <>
                {selectedRate ? (
                  <>
                    <Button
                      style={{
                        backgroundColor: '#9fce52',
                        color: '#fff',
                        minWidth: '104px'
                      }}
                      onClick={() => {
                        dispatch(setPurchasingOrderId(record.id));
                        dispatch(setShowBuyModal(true));
                      }}
                    >
                      <FormattedMessage id="buy" />
                    </Button>
                    <Dropdown overlay={dropdownMenu} trigger={['click']}>
                      <Button
                        style={{ backgroundColor: '#9fce52', color: '#fff' }}
                        icon={<DownOutlined />}
                      />
                    </Dropdown>
                  </>
                ) : (
                  <>
                    <Button
                      style={{
                        backgroundColor: '#9fce52',
                        color: '#fff',
                        minWidth: '104px'
                      }}
                      onClick={() =>
                        history.push(
                          `${UI_ROUTES.ORDERS}${UI_ROUTES.DETAIL}/${id}`
                        )
                      }
                    >
                      <FormattedMessage id="viewOrder" />
                    </Button>
                    <Dropdown overlay={dropdownMenu} trigger={['click']}>
                      <Button
                        style={{ backgroundColor: '#9fce52', color: '#fff' }}
                        icon={<DownOutlined />}
                      />
                    </Dropdown>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Row>
    </>
  );
};

export default ButtonColumn;
