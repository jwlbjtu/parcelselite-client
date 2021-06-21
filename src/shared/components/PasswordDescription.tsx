import React from 'react';
import { FormattedMessage } from 'react-intl';

const PasswordDescription = () => {
  return (
    <div>
      <ul>
        <li>
          <FormattedMessage id="min8Chars" />
        </li>
        <li>
          <FormattedMessage id="upperLowerNum" />
        </li>
        <li>
          <FormattedMessage id="specialChars" />
        </li>
      </ul>
    </div>
  );
};

export default PasswordDescription;
