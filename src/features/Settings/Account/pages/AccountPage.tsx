import { PageHeader, Tabs } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { UI_ROUTES } from '../../../../shared/utils/constants';
import BillingPage from '../components/BillingPage';
import ProfilePage from '../components/ProfilePage';

const { TabPane } = Tabs;

const AccountPage = (): ReactElement => {
  const location = useLocation();
  return (
    <div>
      <PageHeader title={<FormattedMessage id="accountTitle" />} />
      <Tabs
        type="card"
        defaultActiveKey={`${UI_ROUTES.ACCOUNT}${UI_ROUTES.PROFILE}`}
        activeKey={location.pathname}
      >
        <TabPane
          key={`${UI_ROUTES.ACCOUNT}${UI_ROUTES.PROFILE}`}
          tab={
            <Link to={`${UI_ROUTES.ACCOUNT}${UI_ROUTES.PROFILE}`}>
              <FormattedMessage id="profile" />
            </Link>
          }
        >
          <ProfilePage />
        </TabPane>
        <TabPane
          key={`${UI_ROUTES.ACCOUNT}${UI_ROUTES.BILLING}`}
          tab={
            <Link to={`${UI_ROUTES.ACCOUNT}${UI_ROUTES.BILLING}`}>
              <FormattedMessage id="billing" />
            </Link>
          }
        >
          <BillingPage />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AccountPage;
