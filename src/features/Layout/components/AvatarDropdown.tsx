import {
  LogoutOutlined,
  ProfileOutlined,
  SyncOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  logoutUserHandler,
  refreshUserHandler
} from '../../../redux/user/userSlice';
import { UI_ROUTES } from '../../../shared/utils/constants';

interface AvatarDropdownProps {
  name: string;
}

const AvatarDropdown = ({ name }: AvatarDropdownProps): ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();

  const menuHeaderDropdown = (
    <Menu>
      <Menu.Item
        key="refresh"
        onClick={() => dispatch(refreshUserHandler())}
        icon={<SyncOutlined />}
      >
        <FormattedMessage id="refresh" />
      </Menu.Item>
      <Menu.Item
        key="profile"
        onClick={() => history.push(`${UI_ROUTES.ACCOUNT}${UI_ROUTES.PROFILE}`)}
        icon={<ProfileOutlined />}
      >
        <FormattedMessage id="profile" />
      </Menu.Item>
      <Menu.Item
        key="logout"
        onClick={() => dispatch(logoutUserHandler())}
        icon={<LogoutOutlined />}
      >
        <FormattedMessage id="log_out" />
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menuHeaderDropdown}>
      <Button type="text" icon={<UserOutlined />}>
        {name}
      </Button>
    </Dropdown>
  );
};

export default AvatarDropdown;
