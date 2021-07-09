import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Row } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { OrderTabelColumnProps } from '../../../../custom_types/order-page';
import { selectLabels } from '../../../../redux/settings/settingSlice';
import { OrderStatus, UI_ROUTES } from '../../../../shared/utils/constants';
import {
  downloadLabelsHandler,
  downloadPackSlipHandler
} from '../../../../shared/utils/pdf.helpers';

import './columns.css';

const ButtonColumn = ({ record }: OrderTabelColumnProps): ReactElement => {
  const history = useHistory();
  const labelSettings = useSelector(selectLabels);
  const { id, status, labels } = record;

  const dropdownMenu = (
    <Menu>
      {status === OrderStatus.FULFILLED && (
        <Menu.Item
          onClick={() =>
            history.push(`${UI_ROUTES.ORDERS}${UI_ROUTES.DETAIL}/${id}`)
          }
        >
          <FormattedMessage id="viewOrder" />
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
        {status === OrderStatus.FULFILLED ? (
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
        )}
      </Row>
    </>
  );
};

export default ButtonColumn;
