import { Layout } from 'antd';
import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { selectCurUser } from '../../../redux/user/userSlice';
import { UI_ROUTES } from '../../../shared/utils/constants';
import LoginPage from '../../Users/pages/LoginPage';
import ForgotPage from '../../Users/pages/ForgotPage';
import HeaderMenu from '../components/HeaderMenu';
import Logo from '../components/Logo';
import MenuList from '../components/MenuList';
import Routes from '../components/Routes';

import './LayoutPage.css';
import ResetPage from '../../Users/pages/ResetPage';

const { Sider, Content, Footer } = Layout;

const LayoutPage = (): ReactElement => {
  const [logoText, setLogoText] = useState<string | undefined>('ParcelsElite');
  const curUser = useSelector(selectCurUser);

  const togglerLogoText = () => {
    const text = logoText ? undefined : 'ParcelsElite';
    setLogoText(text);
  };

  return (
    <>
      {curUser ? (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible breakpoint="xl" onCollapse={togglerLogoText}>
            <Logo text={logoText} isLogin={false} />
            <MenuList />
          </Sider>
          <Layout>
            <HeaderMenu />
            <Content style={{ margin: '0 16px' }}>
              <div className="site-content">
                <Routes />
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              ParcelsElite ©{new Date().getFullYear()} Created by Eksborder
            </Footer>
          </Layout>
        </Layout>
      ) : (
        <Layout style={{ minHeight: '100vh' }}>
          <HeaderMenu isLogin />
          <Content>
            <Switch>
              <Route path={UI_ROUTES.LOGIN} component={LoginPage} />
              <Route path={UI_ROUTES.FORGOT} component={ForgotPage} />
              <Route
                path={`${UI_ROUTES.RESET}/:token`}
                component={ResetPage}
                exact
              />
              <Redirect from="/" to={UI_ROUTES.LOGIN} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            ParcelsElite ©{new Date().getFullYear()} Created by Eksborder
          </Footer>
        </Layout>
      )}
    </>
  );
};

export default LayoutPage;
