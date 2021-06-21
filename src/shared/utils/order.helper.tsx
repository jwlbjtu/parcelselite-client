import React, { ReactElement } from 'react';
import dayjs from 'dayjs';
import { FormattedMessage } from 'react-intl';
import convertlib from 'convert-units';
import { Order, Rate } from '../../custom_types/order-page';
import {
  Country,
  COUNTRY_PHONE_LENGTH,
  OrderStatus,
  WeightUnit,
  STATES,
  CARRIERS
} from './constants';
import { isOrderInternational } from './helpers';

const checkOrderRateErrors = (
  order: Order,
  onOrderPage: boolean
): ReactElement[] => {
  const results = [];
  if (!order.packageInfo) {
    results.push(
      <>
        <FormattedMessage id="package_info_missing" />{' '}
        {!onOrderPage && (
          <a href="#package-info">
            <FormattedMessage id="jump_to_error" />
          </a>
        )}
      </>
    );
  }

  if (
    dayjs(order.shipmentOptions.shipmentDate).isBefore(dayjs(), 'day') &&
    (!onOrderPage || order.orderStatus !== OrderStatus.FULFILLED)
  ) {
    results.push(
      <>
        <FormattedMessage id="shipment_date_wrong" />
      </>
    );
  }

  // Recipient Phone
  if (!order.recipient.phone) {
    results.push(<div>Recipient phone is required.</div>);
  } else {
    const phone = order.recipient.phone;
    const length = COUNTRY_PHONE_LENGTH[order.recipient.country];
    const message = `Recipient phone should be ${length} numeric charactors`;
    if (/\D/.test(phone) || phone.length !== length) {
      results.push(<div>{message}</div>);
    }
  }

  // State Code
  if (order.recipient.country === Country.USA) {
    if (!order.recipient.state) {
      results.push(<div>Recipient state is required</div>);
    } else if (
      !Object.keys(STATES[Country.USA]).includes(order.recipient.state)
    ) {
      results.push(
        <div>Recipient state should be a valid two letters code. e.g. MA</div>
      );
    }
  }

  if (order.sender.country === Country.USA) {
    if (!order.sender.state) {
      results.push(<div>Sender state is required</div>);
    } else if (!Object.keys(STATES[Country.USA]).includes(order.sender.state)) {
      results.push(
        <div>Sender state should be a valid two letters code. e.g. MA</div>
      );
    }
  }

  // International Checks
  if (isOrderInternational(order)) {
    // Sender Phone
    if (!order.sender.phone) {
      results.push(<div>Sender phone is required.</div>);
    } else {
      const phone = order.sender.phone;
      const length = COUNTRY_PHONE_LENGTH[order.sender.country];
      const message = `Sender phone should be ${length} numeric charactors`;
      if (/\D/.test(phone) || phone.length !== length) {
        results.push(<div>{message}</div>);
      }
    }

    // Custom Declaration
    if (
      !order.customDeclaration ||
      !order.customDeclaration.typeOfContent ||
      !order.customDeclaration.incoterm ||
      !order.customDeclaration.signingPerson
    ) {
      results.push(<div>Custom Declaratio is not completed</div>);
    }

    // Custom Items
    if (!order.customItems || order.customItems.length === 0) {
      results.push(
        <div>
          At lease one item is required to complete the customs declaration
        </div>
      );
    }

    // Custom Items Weight vs Package Weight
    if (
      order.customItems &&
      order.customItems.length > 0 &&
      order.packageInfo
    ) {
      const itemWeight = order.customItems.reduce(
        (accumulator, ele) =>
          accumulator +
          convertlib(ele.quantity * ele.itemWeight)
            .from(ele.itemWeightUnit)
            .to(WeightUnit.LB),
        0
      );

      const packageWeight = convertlib(order.packageInfo.weight.value)
        .from(order.packageInfo.weight.weightUnit)
        .to(WeightUnit.LB);
      if (itemWeight > packageWeight) {
        results.push(
          <div>
            We cannot generate rates because the total order item weight is
            heavier than the total package weight. Please check your order
            items, and then update your{' '}
            {!onOrderPage && <a href="#package-info">package info</a>}
          </div>
        );
      }
    }
  }

  return results;
};

export const checkOrderLabelErrors = (order: Order, rate: Rate): string[] => {
  const results = [];
  if (isOrderInternational(order) && rate.carrier === CARRIERS.USPS) {
    if (order.customItems && order.customItems.length > 0) {
      for (let i = 0; i < order.customItems.length; i += 1) {
        const item = order.customItems[i];
        if (!item.hsTariffNumber) {
          results.push('Custom Item Tariff Number is required for USPS');
          break;
        }
      }
    }
  }
  return results;
};

export default checkOrderRateErrors;
