import { Alert } from 'antd';
import React from 'react';

const LoginAlert: React.FC<{ content: string }> = ({
  content
}: {
  content: string;
}) => (
  <Alert
    style={{
      marginBottom: 24
    }}
    message={content}
    type="error"
    showIcon
  />
);

export default LoginAlert;
