import { Button, Card, Checkbox } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { OrderAddress } from '../../../../custom_types/address-page';
import {
  COUNTRY_NAMES,
  LOCALES,
  OrderStatus
} from '../../../../shared/utils/constants';
import { Order } from '../../../../custom_types/order-page';
import { selectLanguage } from '../../../../redux/i18n/intlSlice';

interface AddressCardProps {
  order: Order;
  address: OrderAddress;
  title: string;
  showModal: (data: OrderAddress, type: string) => void;
  showSelectAddressModal?: (data: OrderAddress, type: string) => void;
  asReturn?: boolean;
  onChecked?: (e: any) => void;
}

const AddressCard = ({
  order,
  address,
  title,
  showModal,
  showSelectAddressModal,
  asReturn,
  onChecked
}: AddressCardProps): ReactElement => {
  const language = useSelector(selectLanguage);

  return (
    <Card size="small">
      <div style={{ marginBottom: '10px' }}>
        <strong>
          <FormattedMessage id={title.toLowerCase()} />
        </strong>
        {order.status !== OrderStatus.FULFILLED && (
          <Button
            style={{ float: 'right' }}
            type="link"
            onClick={() => showModal(address, title.toLowerCase())}
          >
            <strong>
              <FormattedMessage id="edit" />
              {language === LOCALES.CHINESE ? '' : ' '}
              <FormattedMessage id={title.toLowerCase()} />
            </strong>
          </Button>
        )}
        {title.toLowerCase() !== 'recipient' &&
          showSelectAddressModal &&
          order.status !== OrderStatus.FULFILLED && (
            <Button
              type="text"
              style={{ float: 'right' }}
              onClick={() =>
                showSelectAddressModal(address, title.toLowerCase())
              }
            >
              <FormattedMessage id="address_list" />
            </Button>
          )}
      </div>
      <div>
        <div>{address.company || address.name}</div>
        <div>
          <small>{`${address.street1}, ${
            address.street2 ? `${address.street2},` : ''
          } ${address.city}, ${address.state} ${address.zip}, ${
            COUNTRY_NAMES[address.country]
          }`}</small>
        </div>
        <div>
          <small>
            <a style={{ marginRight: '10px' }} href={`mailto:${address.email}`}>
              {address.email}
            </a>
            <a href={`tel:${address.phone}`}>{address.phone}</a>
          </small>
        </div>
        {title.toLowerCase() === 'sender' && (
          <Checkbox
            checked={asReturn}
            style={{ marginTop: '8px' }}
            onChange={onChecked}
            disabled={order.status === OrderStatus.FULFILLED}
          >
            <FormattedMessage id="use_as_return" />
          </Checkbox>
        )}
      </div>
    </Card>
  );
};

AddressCard.defaultProps = {
  asReturn: true,
  onChecked: undefined,
  showSelectAddressModal: undefined
};

export default AddressCard;
