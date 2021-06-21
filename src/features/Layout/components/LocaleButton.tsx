import { TranslationOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import React, { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeLocale, selectLanguage } from '../../../redux/i18n/intlSlice';
import { LOCALES, LOCALE_DISPLAIES } from '../../../shared/utils/constants';

const LocaleButton = (): ReactElement => {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);

  const langMenu = (
    <Menu defaultSelectedKeys={[LOCALES.CHINESE]} selectedKeys={[language]}>
      {Object.values(LOCALES).map((locale) => {
        return (
          <Menu.Item
            key={locale}
            onClick={() => dispatch(changeLocale(locale))}
          >
            {LOCALE_DISPLAIES[locale]}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  useEffect(() => {
    dispatch(changeLocale(LOCALES.CHINESE));
  }, [dispatch]);

  return (
    <Dropdown overlay={langMenu}>
      <Button type="default" icon={<TranslationOutlined />}>
        <span style={{ minWidth: 52 }}>{LOCALE_DISPLAIES[language]}</span>
      </Button>
    </Dropdown>
  );
};

export default LocaleButton;
