import { PageHeader, Tabs } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import SystemAccountPage from '../components/SystemAccountPage';

const { TabPane } = Tabs;

const CarrierPage = (): ReactElement => {
  return (
    <div>
      <PageHeader
        title={<FormattedMessage id="carriers" />}
        subTitle={<FormattedMessage id="carriersSubtitle" />}
      />
      <Tabs type="card">
        <TabPane
          key="parcelselite"
          tab={
            <>
              ParcelsElite <FormattedMessage id="account" />
            </>
          }
        >
          <SystemAccountPage />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CarrierPage;
