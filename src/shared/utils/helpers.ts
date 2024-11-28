import { PDFDocument, degrees } from 'pdf-lib';
import { IService } from '../../custom_types/carrier-page';
import { Order } from '../../custom_types/order-page';
import { ShippingRecord } from '../../features/Orders/components/TableColumns/columns';
import {
  CARRIERS,
  Country,
  DHL_ECOMMERCE_INTL_SERVICES,
  DHL_ECOMMERCE_SERVICES,
  FEDEX_INTL_SERVICES,
  FEDEX_SERVICES,
  FILE_FORMAT_SIZES_PDF_LIB,
  FILE_FORMATS,
  PACKING_SLIP_FOMAT_SIZES,
  UPS_INTL_SERVICES,
  UPS_SERVICES,
  USPS_INTL_SERVICE_IDS_LIST,
  USPS_INTL_SERVICES,
  USPS_SERVICES
} from './constants';

export const isOrderInternational = (order: Order): boolean => {
  const sender = order.sender;
  const toAddress = order.toAddress;
  const isInternational = sender.country !== toAddress.country;
  return isInternational;
};

export const isOrderChinaImport = (order: Order): boolean => {
  const sender = order.sender;
  const toAddress = order.toAddress;
  const isInternational = sender.country !== toAddress.country;
  const isChinaImport = isInternational && toAddress.country === Country.CHINA;
  return isChinaImport;
};

export const getCarrierServices = (
  carrier: string,
  isInternational: boolean
): IService[] => {
  switch (carrier) {
    case CARRIERS.DHL_ECOM:
      return isInternational
        ? DHL_ECOMMERCE_INTL_SERVICES
        : DHL_ECOMMERCE_SERVICES;
    case CARRIERS.UPS:
      return isInternational ? UPS_INTL_SERVICES : UPS_SERVICES;
    case CARRIERS.USPS:
      return isInternational ? USPS_INTL_SERVICES : USPS_SERVICES;
    case CARRIERS.FEDEX:
      return isInternational ? FEDEX_INTL_SERVICES : FEDEX_SERVICES;
    default:
      return [];
  }
};

export const opentLabelUrlHandler = (shipment: ShippingRecord): void => {
  if (shipment.labelUrlList) {
    shipment.labelUrlList.forEach((url) => window.open(url.labelUrl));
  }
};

export const downloadLabelsHandler = async (
  shipment: ShippingRecord
): Promise<void> => {
  const labels = shipment.labels;
  if (labels && labels.length > 0) {
    const fileSize = FILE_FORMAT_SIZES_PDF_LIB[FILE_FORMATS.thermal];
    const formatSize = PACKING_SLIP_FOMAT_SIZES[FILE_FORMATS.thermal];
    const rootDoc = await PDFDocument.create();
    for (let i = 0; i < labels.length; i += 1) {
      const label = labels[i];
      const labelFormat = label.format;

      const isUSPSIntl =
        shipment.carrier === CARRIERS.USPS &&
        USPS_INTL_SERVICE_IDS_LIST.indexOf(
          shipment.service.id || shipment.service.key
        ) >= 0;

      const verticalLabel = label.carrier === CARRIERS.UPS || isUSPSIntl;

      const page = verticalLabel
        ? rootDoc.addPage([fileSize[1], fileSize[0]])
        : rootDoc.addPage([fileSize[0], fileSize[1]]);

      if (labelFormat === 'PDF') {
        // eslint-disable-next-line no-await-in-loop
        const pdfDoc = await PDFDocument.load(label.data);
        // eslint-disable-next-line no-await-in-loop
        const pdfPage = await rootDoc.embedPage(pdfDoc.getPage(0));
        page.drawPage(pdfPage, {
          x: 0,
          y: 0,
          width: verticalLabel ? fileSize[1] : fileSize[0],
          height: verticalLabel ? fileSize[0] : fileSize[1]
        });
      } else if (labelFormat === 'PNG') {
        // eslint-disable-next-line no-await-in-loop
        const image = await rootDoc.embedPng(label.data);
        if (verticalLabel) {
          page.drawImage(image, {
            x: 30,
            y: 0,
            width: fileSize[1],
            height: fileSize[0]
          });
        } else {
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: fileSize[0],
            height: fileSize[1]
          });
        }
      }
      if (label.isTest && label.carrier === CARRIERS.DHL_ECOM) {
        page.drawText('Sample', {
          x: formatSize.sample.x,
          y: formatSize.sample.y,
          size: formatSize.sample.font_size,
          rotate: degrees(formatSize.sample.angle)
        });
      }
    }
    const pdfBytes = await rootDoc.save();
    window.open(
      URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }))
    );
  }
};

export const downloadShipmentForms = async (
  shipment: ShippingRecord
): Promise<void> => {
  const forms = shipment.forms;
  if (forms && forms.length > 0) {
    const fileSize = FILE_FORMAT_SIZES_PDF_LIB[FILE_FORMATS.standard];
    const rootDoc = await PDFDocument.create();
    for (let i = 0; i < forms.length; i += 1) {
      const form = forms[i];
      // eslint-disable-next-line no-await-in-loop
      const pdfDoc = await PDFDocument.load(form.data);
      const pageCount = pdfDoc.getPageCount();
      for (let k = 0; k < pageCount; k += 1) {
        const page = rootDoc.addPage([fileSize[0], fileSize[1]]);
        // eslint-disable-next-line no-await-in-loop
        const embededPage = await rootDoc.embedPage(pdfDoc.getPage(k));
        page.drawPage(embededPage, {
          x: 0,
          y: 0,
          width: fileSize[0],
          height: fileSize[1]
        });
      }
    }
    const pdfBytes = await rootDoc.save();
    window.open(
      URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }))
    );
  }
};
