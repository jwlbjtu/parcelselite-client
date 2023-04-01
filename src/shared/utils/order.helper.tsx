import React, { ReactElement } from 'react';
import dayjs from 'dayjs';
import { FormattedMessage } from 'react-intl';
import convertlib from 'convert-units';
import { Order } from '../../custom_types/order-page';
import {
  Country,
  COUNTRY_PHONE_LENGTH,
  OrderStatus,
  WeightUnit,
  STATES,
  CARRIERS,
  COUNTRY_NAMES
} from './constants';
import { getCarrierServices, isOrderInternational } from './helpers';

const checkOrderRateErrors = (
  order: Order,
  onOrderPage: boolean
): ReactElement[] => {
  const results = [];
  if (!order.carrierAccount || !order.accountName || !order.service) {
    results.push(<div>请选择物流账号和服务</div>);
  }

  if (order.carrier === CARRIERS.DHL_ECOM && !order.facility) {
    results.push(<div>请选择分拣中心</div>);
  }

  if (!order.packageInfo) {
    results.push(
      <>
        <FormattedMessage id="package_info_missing" />{' '}
      </>
    );
  }

  if (
    dayjs(order.shipmentOptions.shipmentDate).isBefore(dayjs(), 'day') &&
    (!onOrderPage || order.status !== OrderStatus.FULFILLED)
  ) {
    results.push(
      <>
        <FormattedMessage id="shipment_date_wrong" />
      </>
    );
  }

  // Recipient Phone
  if (!order.toAddress.phone) {
    results.push(<div>Recipient phone is required.</div>);
  } else {
    const phone = order.toAddress.phone;
    const length = COUNTRY_PHONE_LENGTH[order.toAddress.country];
    const message = `收件人所在地区手机号码应为${length}位数字`;
    if (/\D/.test(phone) || phone.length !== length) {
      results.push(<div>{message}</div>);
    }
  }

  // State Code
  if (order.toAddress.country === Country.USA) {
    if (!order.toAddress.state) {
      results.push(<div>收件人省份信息缺失</div>);
    } else if (
      !Object.keys(STATES[Country.USA]).includes(order.toAddress.state)
    ) {
      results.push(<div>收件人省份应为双字母缩写，例如: MA</div>);
    }
  }

  if (order.sender.country === Country.USA) {
    if (!order.sender.state) {
      results.push(<div>寄件人省份信息缺失</div>);
    } else if (!Object.keys(STATES[Country.USA]).includes(order.sender.state)) {
      results.push(<div>寄件人省份应为双字母缩写，例如: MA</div>);
    }
  }

  // Check Package Numbers
  if (
    order.carrier === CARRIERS.DHL_ECOM ||
    order.carrier === CARRIERS.USPS ||
    (order.carrier === CARRIERS.UPS &&
      (order.service!.id === '92' || order.service!.id === '93'))
  ) {
    if (order.morePackages && order.morePackages.length > 0) {
      results.push(<div>所选物流账号或服务不支持多个包裹</div>);
    }
  }

  // Check Package Weight
  if (
    (order.carrier === CARRIERS.DHL_ECOM && order.service?.key === 'FLAT') ||
    (order.carrier === CARRIERS.UPS && order.service?.id === '92')
  ) {
    const packageInfo = order.packageInfo!;
    const weightLB = convertlib(packageInfo.weight.value)
      .from(packageInfo.weight.unitOfMeasure)
      .to(WeightUnit.LB);
    if (weightLB > 1) results.push(<div>所选服务包裹重量不得超过 1LB</div>);
  }

  if (
    !isOrderInternational(order) &&
    order.service &&
    order.service.key !== 'CUSTOM' &&
    order.carrier
  ) {
    const intlServices = getCarrierServices(order.carrier, false);
    if (!intlServices.map((ele) => ele.key).includes(order.service.key)) {
      results.push(
        <div>{`服务${order.service.name}不支持${
          COUNTRY_NAMES[order.toAddress.country]
        }区域`}</div>
      );
    }
  }

  // International Checks
  if (isOrderInternational(order)) {
    // Service Check
    if (order.service && order.service.key !== 'CUSTOM' && order.carrier) {
      const intlServices = getCarrierServices(order.carrier, true);
      if (!intlServices.map((ele) => ele.key).includes(order.service.key)) {
        results.push(
          <div>{`服务${order.service.name}不支持${
            COUNTRY_NAMES[order.toAddress.country]
          }区域`}</div>
        );
      }
    }

    // Sender Phone
    if (!order.sender.phone) {
      results.push(<div>寄件人电话缺失</div>);
    } else {
      const phone = order.sender.phone;
      const length = COUNTRY_PHONE_LENGTH[order.sender.country];
      const message = `寄件人所在地区手机号码应为${length}位数字`;
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
      results.push(<div>海关申报信息不完整</div>);
    }

    // Custom Items
    if (!order.customItems || order.customItems.length === 0) {
      results.push(<div>请填写至少一个海关申报物品信息</div>);
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

      let packageWeight = convertlib(order.packageInfo.weight.value)
        .from(order.packageInfo.weight.unitOfMeasure)
        .to(WeightUnit.LB);
      if (order.morePackages) {
        const morePackageWeight = order.morePackages.reduce(
          (acumulator, ele) =>
            acumulator +
            convertlib(ele.weight.value)
              .from(ele.weight.unitOfMeasure)
              .to(WeightUnit.LB),
          0
        );
        packageWeight += morePackageWeight;
      }

      if (itemWeight > packageWeight) {
        results.push(<div>报关物品总重量不得大于包裹信息的总重量</div>);
      }
    }
  }

  return results;
};

export const checkOrderLabelErrors = (order: Order): string[] => {
  const results = [];
  if (isOrderInternational(order) && order.carrier === CARRIERS.USPS) {
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
