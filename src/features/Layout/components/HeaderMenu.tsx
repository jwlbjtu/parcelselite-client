import { Space, Statistic } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import LocaleButton from './LocaleButton';
import { selectCurUser } from '../../../redux/user/userSlice';
import './HeaderMenu.css';
import AvatarDropdown from './AvatarDropdown';

const HeaderMenu = (): ReactElement => {
  const curUser = useSelector(selectCurUser);
  const intl = useIntl();

  return (
    <Header className="site-header">
      {curUser && (
        <Space size="large" style={{ marginLeft: '24px' }}>
          <Statistic
            prefix={`${intl.formatMessage({ id: 'account_balance' })}: $`}
            value={curUser.balance}
            precision={2}
          />
        </Space>
      )}
      <Space className="right" style={{ marginRight: '24px' }}>
        <LocaleButton />
        {curUser && (
          <AvatarDropdown name={`${curUser.lastName}${curUser.firstName}`} />
        )}
      </Space>
    </Header>
  );
};

HeaderMenu.defaultProps = {
  isLogin: false
};

export default HeaderMenu;
