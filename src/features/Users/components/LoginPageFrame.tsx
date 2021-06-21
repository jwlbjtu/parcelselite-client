import React, { ReactElement } from 'react';
import Logo from '../../Layout/components/Logo';

import './LoginPageFrame.css';

interface LoginPageFrameProps {
  children: ReactElement;
}

const LoginPageFrame = ({ children }: LoginPageFrameProps): ReactElement => {
  return (
    <div className="container">
      <div className="content">
        <div className="top">
          <div className="header">
            <Logo text="ParcelsElite" isLogin />
          </div>
        </div>
        <div className="main">{children}</div>
      </div>
    </div>
  );
};

export default LoginPageFrame;
