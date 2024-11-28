import {
  SettingOutlined,
  ShopOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink, useLocation } from 'react-router-dom';
import { SETTING_KEYS, UI_ROUTES } from '../../../shared/utils/constants';

const MenuList = (): ReactElement => {
  const location = useLocation();

  return (
    <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
      <Menu.Item key={UI_ROUTES.ORDERS} icon={<ShoppingOutlined />}>
        <NavLink to={UI_ROUTES.ORDERS}>
          <FormattedMessage id={UI_ROUTES.ORDERS} />
        </NavLink>
      </Menu.Item>
      <Menu.Item key={UI_ROUTES.BILLING} icon={<ShopOutlined />}>
        <NavLink to={UI_ROUTES.BILLING}>
          <FormattedMessage id={UI_ROUTES.BILLING} />
        </NavLink>
      </Menu.Item>
      <SubMenu
        key={UI_ROUTES.SETTINGS}
        title={<FormattedMessage id={UI_ROUTES.SETTINGS} />}
        icon={<SettingOutlined />}
      >
        {SETTING_KEYS.map((key) => {
          return (
            <Menu.Item key={key}>
              <NavLink to={key}>
                <FormattedMessage id={key} />
              </NavLink>
            </Menu.Item>
          );
        })}
      </SubMenu>
    </Menu>
  );
};

export default MenuList;
