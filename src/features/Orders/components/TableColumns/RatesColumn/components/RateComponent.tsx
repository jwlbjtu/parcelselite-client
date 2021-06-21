import {
  CaretDownFilled,
  CaretUpFilled,
  ReloadOutlined
} from '@ant-design/icons';
import { Col, Row, Image, Button, Space, Popover, Spin } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { OrderTabelColumnProps } from '../../../../../../custom_types/order-page';
import { fetchRatesForOrderHandler } from '../../../../../../redux/orders/ordersSlice';
import { getCarrierIcon } from '../../../../../../shared/utils/logo.helper';
import RateList from '../../../RatesCard/RateList';

import '../../columns.css';

const RatesComponent = ({ record }: OrderTabelColumnProps): ReactElement => {
  const { selectedRate, rateLoading, id } = record;
  const disptach = useDispatch();
  const [showIcon, setShowIcon] = useState(<CaretDownFilled />);

  useEffect(() => {
    setShowIcon(<CaretDownFilled />);
  }, [record]);

  const fetchRatesHandler = () => {
    disptach(fetchRatesForOrderHandler(id));
    setShowIcon(<CaretDownFilled />);
  };

  if (rateLoading) {
    return (
      <Row className="default-column">
        <div style={{ textAlign: 'center' }}>
          <Spin style={{ marginTop: '10px', marginLeft: '10px' }} />
        </div>
      </Row>
    );
  }

  return (
    <>
      {!selectedRate ? (
        <Row className="default-column">
          <Button
            type="link"
            icon={<ReloadOutlined />}
            onClick={fetchRatesHandler}
          >
            {' '}
            <FormattedMessage id="refresh" />
          </Button>
        </Row>
      ) : (
        <Popover
          style={{ minWidth: '390px' }}
          title={
            <Row>
              <Col span={17} style={{ padding: '4px 10px' }}>
                <FormattedMessage id="rates" />
              </Col>
              <Col span={7}>
                {' '}
                <Button
                  type="link"
                  icon={<ReloadOutlined />}
                  onClick={fetchRatesHandler}
                >
                  {' '}
                  <FormattedMessage id="refresh" />
                </Button>
              </Col>
            </Row>
          }
          trigger={['click']}
          content={<RateList order={record} onOrderPage />}
          onVisibleChange={(visible) =>
            visible
              ? setShowIcon(<CaretUpFilled />)
              : setShowIcon(<CaretDownFilled />)
          }
        >
          <Row className="default-column">
            <Col className="icon-col" span={4}>
              <Image
                src={getCarrierIcon(selectedRate.carrier)}
                preview={false}
                style={{ width: '24px', height: '24px' }}
              />
            </Col>
            <Col span={18}>
              <Row>
                <strong>
                  {selectedRate.carrier} {selectedRate.service}
                </strong>
              </Row>
              <Row>
                <Space size="large">
                  <div>${selectedRate.rate?.toFixed(2)}</div>
                  {selectedRate.eta}
                </Space>
              </Row>
            </Col>
            <Col span={2}>{showIcon}</Col>
          </Row>
        </Popover>
      )}
    </>
  );
};

export default RatesComponent;
