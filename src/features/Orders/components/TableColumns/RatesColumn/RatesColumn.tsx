import React, { ReactElement, useEffect, useState } from 'react';
import { OrderTabelColumnProps } from '../../../../../custom_types/order-page';
import checkOrderRateErrors from '../../../../../shared/utils/order.helper';

import '../columns.css';
import ErrorComponent from './components/ErrorComponent';
import LabelComponent from './components/LabelComponent';
import RatesComponent from './components/RateComponent';

const RatesColumn = ({ record }: OrderTabelColumnProps): ReactElement => {
  const { labels, selectedRate } = record;
  const [errors, setErrors] = useState<ReactElement[]>([]);

  useEffect(() => {
    setErrors(checkOrderRateErrors(record, true));
  }, [record]);

  return (
    <>
      {(errors && errors.length > 0) ||
      (record.errors && record.errors.length > 0) ? (
        <ErrorComponent record={record} />
      ) : (
        <>
          {!selectedRate && labels && labels.length > 0 ? (
            <LabelComponent labels={labels} />
          ) : (
            <RatesComponent record={record} />
          )}
        </>
      )}
    </>
  );
};

export default RatesColumn;
