import { CheckCircleTwoTone } from '@ant-design/icons';
import { Button, Col, Divider, Image, Row } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';

import addressIcon from '../../../../assets/address-icon.svg';
import { Address } from '../../../../custom_types/address-page';
import { COUNTRY_NAMES } from '../../../../shared/utils/constants';

interface AddressRowProps {
  address: Address;
  showModal: (data: Address | undefined) => void;
}

const AddressRow = ({ address, showModal }: AddressRowProps): ReactElement => {
  return (
    <Row>
      <Col className="icon-col" span={2}>
        <Image
          src={addressIcon}
          style={{
            width: '24px',
            height: '24px'
          }}
          preview={false}
        />
      </Col>
      <Col span={15}>
        <div>
          <strong>{address.company || address.name}</strong>
        </div>
        <div>
          <div>{address.street1}</div>
          {address.street2 && <div>{address.street2}</div>}
          <div>{`${address.city}, ${address.state} ${address.zip}`}</div>
          <div>{COUNTRY_NAMES[address.country]}</div>
        </div>
      </Col>
      <Col className="icon-col" span={5}>
        <div style={{ float: 'right' }}>
          {address.isDefaultSender && (
            <div>
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ marginRight: '8px' }}
              />
              <FormattedMessage id="defaultSender" />
            </div>
          )}
        </div>
      </Col>
      <Col className="icon-col" span={2}>
        <div style={{ marginLeft: '20px', float: 'right' }}>
          <Button type="text" onClick={() => showModal(address)}>
            <FormattedMessage id="edit" />
          </Button>
        </div>
      </Col>
      <Divider />
    </Row>
  );
};

export default AddressRow;

// <div>
//   <CheckCircleTwoTone
//     twoToneColor="#52c41a"
//     style={{ marginRight: '8px' }}
//   />
//   Default return address
// </div>
