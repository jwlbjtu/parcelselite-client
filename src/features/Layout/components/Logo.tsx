import { Space } from 'antd';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';

import './Logo.css';

interface LogoProps {
  text: string | undefined;
  isLogin: boolean;
}

const Logo = ({ text, isLogin }: LogoProps): ReactElement => {
  return (
    <div>
      <Link to="/">
        <Space>
          <img
            className={isLogin ? 'login-logo' : 'logo'}
            src={logo}
            alt="ParcelsElite"
          />
          <div className={isLogin ? 'login-logo-text' : 'logo-text'}>
            <strong>{text}</strong>
          </div>
        </Space>
      </Link>
    </div>
  );
};

export default Logo;
