import React, { ReactElement, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../../redux/i18n/intlSlice';
import { LOCALES } from '../../shared/utils/constants';
import en_US from '../../locale/en_US';
import zh_CN from '../../locale/zh_CN';

interface IntlProps {
  children: ReactNode;
}

const languageMessages = {
  [LOCALES.ENGLISH]: en_US,
  [LOCALES.CHINESE]: zh_CN
};

const Intl = ({ children }: IntlProps): ReactElement => {
  const language = useSelector(selectLanguage);
  return (
    <IntlProvider
      locale={language}
      defaultLocale={LOCALES.CHINESE}
      messages={languageMessages[language]}
    >
      {children}
    </IntlProvider>
  );
};

export default Intl;
