import {
  CaretDownOutlined,
  CaretUpOutlined,
  InfoCircleTwoTone,
  ReloadOutlined
} from '@ant-design/icons';
import { Alert, Button, Card, Divider, Space, Spin } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import uniqid from 'uniqid';
import { Order } from '../../../../custom_types/order-page';
import { fetchRatesForOrderHandler } from '../../../../redux/orders/ordersSlice';
import checkOrderRateErrors from '../../../../shared/utils/order.helper';
import RateList from './RateList';

interface RatesCardProps {
  order: Order;
}

const RatesCard = ({ order }: RatesCardProps): ReactElement => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<ReactElement[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    setErrors(checkOrderRateErrors(order, false));
    setShowErrors(false);
  }, [dispatch, order]);

  const fetchRatesHandler = () => {
    dispatch(fetchRatesForOrderHandler(order.id));
  };

  return (
    <Card
      size="small"
      title={
        <strong>
          <FormattedMessage id="rates" />
        </strong>
      }
      bodyStyle={{
        minHeight: '141px',
        maxHeight: '900px',
        overflowX: 'hidden',
        overflowY: 'auto'
      }}
      extra={
        order.rates &&
        order.rates.length > 0 && (
          <Button
            type="link"
            icon={<ReloadOutlined />}
            onClick={fetchRatesHandler}
          >
            {' '}
            <FormattedMessage id="refresh" />
          </Button>
        )
      }
    >
      {order.rateLoading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin style={{ marginTop: '40px' }} />
        </div>
      ) : (
        <>
          {errors.length > 0 ? (
            <Alert
              message={<FormattedMessage id="rate_unavailable" />}
              description={
                <div>
                  <strong>
                    <FormattedMessage id="fix_following" />:
                  </strong>
                  <ul>
                    {errors.map((ele, index) => (
                      <li key={`${uniqid(index.toString())}`}>{ele}</li>
                    ))}
                  </ul>
                </div>
              }
              type="warning"
              showIcon
            />
          ) : (
            <>
              {!order.rates || order.rates.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '35px' }}>
                  <Button
                    size="large"
                    type="link"
                    icon={<ReloadOutlined />}
                    onClick={fetchRatesHandler}
                  >
                    {' '}
                    <FormattedMessage id="refresh" />
                  </Button>
                </div>
              ) : (
                <RateList order={order} onOrderPage={false} />
              )}
              {order.errors && order.errors.length > 0 && (
                <>
                  <Divider />
                  <Space>
                    <Button
                      icon={<InfoCircleTwoTone twoToneColor="#eb2f96" />}
                      type="link"
                      onClick={() => setShowErrors(!showErrors)}
                      danger
                    >
                      View error messages
                    </Button>
                    {showErrors ? <CaretUpOutlined /> : <CaretDownOutlined />}
                  </Space>
                  {showErrors && (
                    <Alert
                      message=""
                      description={
                        <ul>
                          {order.errors.map((ele, index) => (
                            <li key={`${uniqid(index.toString())}`}>{ele}</li>
                          ))}
                        </ul>
                      }
                      type="warning"
                    />
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </Card>
  );
};

export default RatesCard;
