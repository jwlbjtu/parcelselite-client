import { CheckOutlined } from '@ant-design/icons';
import { Image, Space } from 'antd';
import React, { ReactElement } from 'react';
import addressIcon from '../../../../assets/address-icon.svg';
import { Address, OrderAddress } from '../../../../custom_types/address-page';
import { COUNTRY_NAMES } from '../../../../shared/utils/constants';

import './SelectAddressRow.css';

interface SelectAddressRowProps {
  address: Address | OrderAddress;
  selected: boolean;
  onClick: () => void;
}

const SelectAddressRow = ({
  address,
  selected,
  onClick
}: SelectAddressRowProps): ReactElement => {
  return (
    <div
      onClick={onClick}
      className={
        selected ? 'address-selection-row selected' : 'address-selection-row'
      }
    >
      <Space>
        <div>
          <Image
            preview={false}
            src={addressIcon}
            style={{
              width: '24px',
              height: '24px',
              margin: 'auto 15px'
            }}
          />
        </div>
        <div>
          <div>
            <strong>{address.company || address.name}</strong>
          </div>
          <div>{address.street1}</div>
          {address.street2 && <div>{address.street2}</div>}
          <div>{`${address.city}, ${address.state} ${address.zip}`}</div>
          <div>{COUNTRY_NAMES[address.country]}</div>
        </div>
      </Space>
      <div
        style={{
          float: 'right',
          width: '100px',
          height: '100px',
          textAlign: 'center'
        }}
      >
        <div className={selected ? 'select-text selected' : 'select-text'}>
          {selected && <CheckOutlined />} {selected ? 'Selected' : 'Select'}
        </div>
      </div>
    </div>
  );
};

export default SelectAddressRow;
