import { Empty } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';

const NoData = (): ReactElement => {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={<FormattedMessage id="no_data" />}
    />
  );
};

export default NoData;
