import { Divider } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Order, Rate } from '../../../../custom_types/order-page';
import { updateOrder } from '../../../../redux/orders/ordersSlice';
import {
  findCheapestRate,
  findFastestRate,
  matchRate
} from '../../../../shared/utils/rates.helper';
import RateItem from './RateItem';

interface RateListProps {
  order: Order;
  onOrderPage: boolean;
}

const RateList = ({ order, onOrderPage }: RateListProps): ReactElement => {
  const dispatch = useDispatch();
  const [curRate, setCurRate] = useState<Rate | undefined>(order.selectedRate);
  const [cheapRate, setCheapRate] = useState<Rate | undefined>();
  const [fastRate, setFastRate] = useState<Rate | undefined>();

  useEffect(() => {
    setCheapRate(undefined);
    setFastRate(undefined);
    setCurRate(order.selectedRate);
    if (order.rates && order.rates.length > 0) {
      setCheapRate(findCheapestRate(order.rates));
      if (order.rates.length > 1) {
        setFastRate(
          findFastestRate(order.rates, findCheapestRate(order.rates))
        );
      }
    }
  }, [order]);

  const rateItemClickedHandler = (rate: Rate | undefined) => {
    if (!rate) return;
    setCurRate(rate);
    const newOrder = { ...order, selectedRate: rate };
    dispatch(updateOrder(newOrder));
  };

  return (
    <div style={onOrderPage ? { maxHeight: '356px', overflowY: 'auto' } : {}}>
      {cheapRate && (
        <>
          <Divider style={{ marginTop: '0' }} orientation="left" plain>
            <sub>
              <FormattedMessage id="cheapest" />
            </sub>
          </Divider>
          <RateItem
            rate={cheapRate}
            selected={matchRate(cheapRate, curRate)}
            onClick={() => rateItemClickedHandler(cheapRate)}
          />
        </>
      )}
      {fastRate && (
        <>
          <Divider orientation="left" plain>
            <sub>
              <FormattedMessage id="fastest" />
            </sub>
          </Divider>
          <RateItem
            rate={fastRate}
            selected={matchRate(fastRate, curRate)}
            onClick={() => rateItemClickedHandler(fastRate)}
          />
        </>
      )}
      <Divider orientation="left" plain>
        <sub>
          <FormattedMessage id="more_rates" />
        </sub>
      </Divider>
      {order.rates &&
        order.rates.map((rateItem) => {
          if (
            !matchRate(cheapRate, rateItem) &&
            !matchRate(fastRate, rateItem)
          ) {
            return (
              <RateItem
                key={rateItem.service}
                rate={rateItem}
                selected={matchRate(rateItem, curRate)}
                onClick={() => rateItemClickedHandler(rateItem)}
              />
            );
          }
          return null;
        })}
    </div>
  );
};

export default RateList;
