import JSPDF from 'jspdf';
import { PDFDocument, degrees } from 'pdf-lib';
import dayjs from 'dayjs';
import { Label, Order } from '../../custom_types/order-page';
import {
  FILE_FORMAT_SIZES,
  COUNTRY_NAMES,
  PACKING_SLIP_FOMAT_SIZES,
  FILE_FORMATS,
  FILE_FORMAT_SIZES_PDF_LIB,
  CARRIERS,
  USPS_INTL_SERVICE_IDS_LIST
} from './constants';

export const downloadPdfHandler = async (
  data: string,
  format: string
): Promise<void> => {
  const fileSize = FILE_FORMAT_SIZES_PDF_LIB[format];
  const rootDoc = await PDFDocument.create();
  const page = rootDoc.addPage([fileSize[0], fileSize[1]]);
  const pdfDoc = await PDFDocument.load(data);
  const pdfPage = await rootDoc.embedPage(pdfDoc.getPage(0));
  page.drawPage(pdfPage, {
    x: 0,
    y: 0,
    width: fileSize[0],
    height: fileSize[1]
  });
  const pdfBytes = await rootDoc.save();
  window.open(
    URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }))
  );
};

export const downloadLabelsHandler = async (
  labelsData: Label[] | undefined,
  format: string
): Promise<void> => {
  if (labelsData && labelsData.length > 0) {
    const fileSize = FILE_FORMAT_SIZES_PDF_LIB[format];
    const formatSize = PACKING_SLIP_FOMAT_SIZES[format];
    const rootDoc = await PDFDocument.create();
    for (let i = 0; i < labelsData.length; i += 1) {
      const label = labelsData[i];
      const labelFormat = label.format;

      const isUSPSIntl =
        label.carrier === CARRIERS.USPS &&
        USPS_INTL_SERVICE_IDS_LIST.indexOf(label.serviceId) >= 0;

      const page =
        label.carrier === CARRIERS.UPS || isUSPSIntl
          ? rootDoc.addPage([fileSize[1], fileSize[0]])
          : rootDoc.addPage([fileSize[0], fileSize[1]]);

      if (labelFormat === 'PDF') {
        // eslint-disable-next-line no-await-in-loop
        const pdfDoc = await PDFDocument.load(label.label);
        // eslint-disable-next-line no-await-in-loop
        const pdfPage = await rootDoc.embedPage(pdfDoc.getPage(0));
        page.drawPage(pdfPage, {
          x: 0,
          y: 0,
          width: isUSPSIntl ? fileSize[1] : fileSize[0],
          height: isUSPSIntl ? fileSize[0] : fileSize[1]
        });

        if (label.moreLabels) {
          for (let j = 0; j < label.moreLabels.length; j += 1) {
            const labelItem = label.moreLabels[j];
            if (labelItem.length > 0) {
              const newPage =
                label.carrier === CARRIERS.UPS || isUSPSIntl
                  ? rootDoc.addPage([fileSize[1], fileSize[0]])
                  : rootDoc.addPage([fileSize[0], fileSize[1]]);
              // eslint-disable-next-line no-await-in-loop
              const morePdfDoc = await PDFDocument.load(labelItem);
              // eslint-disable-next-line no-await-in-loop
              const morePdfPage = await rootDoc.embedPage(
                morePdfDoc.getPage(0)
              );
              newPage.drawPage(morePdfPage, {
                x: 0,
                y: 0,
                width: fileSize[1],
                height: fileSize[0]
              });
            }
          }
        }
      } else {
        // eslint-disable-next-line no-await-in-loop
        const image = await rootDoc.embedPng(label.label);
        if (label.carrier === CARRIERS.UPS) {
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

        if (label.moreLabels) {
          for (let j = 0; j < label.moreLabels.length; j += 1) {
            const labelItem = label.moreLabels[j];
            if (labelItem.length > 0) {
              if (label.carrier === CARRIERS.UPS) {
                try {
                  // UPS Form PDF Format 3 Pages
                  // eslint-disable-next-line no-await-in-loop
                  const upsFormSize =
                    FILE_FORMAT_SIZES_PDF_LIB[FILE_FORMATS.standard];
                  // eslint-disable-next-line no-await-in-loop
                  const morePdfDoc = await PDFDocument.load(labelItem);
                  const pageCount = morePdfDoc.getPageCount();
                  for (let k = 0; k < pageCount; k += 1) {
                    const addedPage = rootDoc.addPage([
                      upsFormSize[0],
                      upsFormSize[1]
                    ]);
                    // eslint-disable-next-line no-await-in-loop
                    const embededPage = await rootDoc.embedPage(
                      morePdfDoc.getPage(k)
                    );
                    addedPage.drawPage(embededPage, {
                      x: 0,
                      y: 0,
                      width: upsFormSize[0],
                      height: upsFormSize[1]
                    });
                  }
                } catch (error) {
                  const newPage = rootDoc.addPage([fileSize[1], fileSize[0]]);
                  // eslint-disable-next-line no-await-in-loop
                  const labelImage = await rootDoc.embedPng(labelItem);
                  newPage.drawImage(labelImage, {
                    x: 30,
                    y: 0,
                    width: fileSize[1],
                    height: fileSize[0]
                  });
                }
              }
            }
          }
        }
      }
      if (label.isTest && label.carrier !== CARRIERS.UPS) {
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

export const downloadPackSlipHandler = (order: Order, format: string): void => {
  const fileSize = FILE_FORMAT_SIZES[format];
  const doc = new JSPDF({ unit: 'in', format: fileSize });
  const formatSize = PACKING_SLIP_FOMAT_SIZES[format];
  // Header
  doc.setDrawColor(0);
  doc.setFillColor(232, 232, 232);
  // doc.rect(0.2, 0.2, 8.1, 0.21, 'F');
  doc.rect(
    formatSize.header.background.x,
    formatSize.header.background.y,
    formatSize.header.background.w,
    formatSize.header.background.h,
    'F'
  );
  doc.setFontSize(formatSize.fontSize);
  doc.text(
    `Packing Slip for Order ${order.orderId ? order.orderId : '#1000'}`,
    formatSize.header.content.x,
    formatSize.header.content.y,
    { align: 'center', baseline: 'middle' }
  );
  // Sender Address
  let level = 1;
  doc.setFont('helvetica', 'bold');
  doc.text(
    `${order.sender.company || order.sender.name}`,
    formatSize.sender.x,
    formatSize.sender.y
  );
  doc.setFont('helvetica', 'normal');
  doc.text(
    order.sender.street1,
    formatSize.sender.x,
    formatSize.sender.y + level * formatSize.sender.step
  );
  if (order.sender.street2) {
    level += 1;
    doc.text(
      order.sender.street2,
      formatSize.sender.x,
      formatSize.sender.y + level * formatSize.sender.step
    );
  }
  level += 1;
  doc.text(
    `${order.sender.city}, ${order.sender.state} ${order.sender.zip}`,
    formatSize.sender.x,
    formatSize.sender.y + level * formatSize.sender.step
  );
  level += 1;
  doc.text(
    COUNTRY_NAMES[order.sender.country],
    formatSize.sender.x,
    formatSize.sender.y + level * formatSize.sender.step
  );
  // Order Info and Shipping Info
  level = 0;
  doc.setFont('helvetica', 'bold');
  if (order.orderId) {
    doc.text(
      'Order ID:',
      formatSize.orderInfo.x,
      formatSize.orderInfo.y + level * formatSize.orderInfo.step,
      { align: 'right' }
    );
    level += 1;
  }
  doc.text(
    'Order Date:',
    formatSize.orderInfo.x,
    formatSize.orderInfo.y + level * formatSize.orderInfo.step,
    { align: 'right' }
  );
  level += 1;
  if (order.labels && order.labels.length > 0) {
    doc.text(
      'Shipped Via:',
      formatSize.orderInfo.x,
      formatSize.orderInfo.y + level * formatSize.orderInfo.step,
      { align: 'right' }
    );
    level += 1;
    doc.text(
      'Tracking Number:',
      formatSize.orderInfo.x,
      formatSize.orderInfo.y + level * formatSize.orderInfo.step,
      {
        align: 'right'
      }
    );
  }
  level = 0;
  doc.setFont('helvetica', 'normal');
  if (order.orderId) {
    doc.text(
      order.orderId,
      formatSize.orderInfo.x + formatSize.orderInfo.distance,
      formatSize.orderInfo.y + level * formatSize.orderInfo.step
    );
    level += 1;
  }
  doc.text(
    dayjs(order.orderDate).format('MM/DD/YYYY'),
    formatSize.orderInfo.x + formatSize.orderInfo.distance,
    formatSize.orderInfo.y + level * formatSize.orderInfo.step
  );
  level += 1;
  if (order.labels && order.labels.length > 0) {
    const size = order.labels.length;
    doc.text(
      order.labels[size - 1].carrier,
      formatSize.orderInfo.x + formatSize.orderInfo.distance,
      formatSize.orderInfo.y + level * formatSize.orderInfo.step
    );
    level += 1;
    doc.text(
      order.labels[size - 1].tracking,
      formatSize.orderInfo.x + formatSize.orderInfo.distance,
      formatSize.orderInfo.y + level * formatSize.orderInfo.step
    );
  }
  // Receipent Address
  level = 1;
  doc.setFont('helvetica', 'bold');
  doc.text(
    'Ship To:',
    formatSize.receipent.title.x,
    formatSize.receipent.title.y
  );
  doc.setFont('helvetica', 'normal');
  doc.text(
    `${order.recipient.company || order.recipient.name}`,
    formatSize.receipent.x,
    formatSize.receipent.y
  );
  doc.text(
    order.recipient.street1,
    formatSize.receipent.x,
    formatSize.receipent.y + level * formatSize.receipent.step
  );
  level += 1;
  if (order.recipient.street2) {
    doc.text(
      order.recipient.street2,
      formatSize.receipent.x,
      formatSize.receipent.y + level * formatSize.receipent.step
    );
    level += 1;
  }
  doc.text(
    `${order.recipient.city}, ${order.recipient.state} ${order.recipient.zip}`,
    formatSize.receipent.x,
    formatSize.receipent.y + level * formatSize.receipent.step
  );
  level += 1;
  doc.text(
    COUNTRY_NAMES[order.recipient.country],
    formatSize.receipent.x,
    formatSize.receipent.y + level * formatSize.receipent.step
  );
  // Table
  if (
    (order.items && order.items.length > 0) ||
    (order.customItems && order.customItems.length > 0)
  ) {
    let orderItems = order.items;
    if (order.customItems && order.customItems.length > 0)
      orderItems = order.customItems;
    doc.setFont('helvetica', 'bold');
    doc.text('ITEMS', formatSize.table.header.x, formatSize.table.header.y);
    doc.text('QTY', formatSize.table.header.x2, formatSize.table.header.y);
    level = 1;
    if (format === FILE_FORMATS.standard) {
      doc.text(
        'WEIGHT',
        formatSize.table.header.x2 + level * formatSize.table.header.step,
        formatSize.table.header.y
      );
      level += 1;
    }
    doc.text(
      'PRICE',
      formatSize.table.header.x2 + level * formatSize.table.header.step,
      formatSize.table.header.y
    );
    level += 1;
    doc.text(
      'TOTAL',
      formatSize.table.header.x2 + level * formatSize.table.header.step,
      formatSize.table.header.y
    );
    doc.setLineWidth(0.03);
    doc.line(
      formatSize.table.headerDivider.x1,
      formatSize.table.headerDivider.y1,
      formatSize.table.headerDivider.x2,
      formatSize.table.headerDivider.y2
    );

    let lastItemY = 0;
    doc.setFont('helvetica', 'normal');
    orderItems!.forEach((ele, index) => {
      lastItemY =
        formatSize.table.items.y + index * formatSize.table.items.y_step;
      doc.text(ele.itemTitle, formatSize.table.items.x, lastItemY);
      doc.text(ele.quantity.toFixed(0), formatSize.table.items.x2, lastItemY);
      level = 1;
      if (format === FILE_FORMATS.standard) {
        doc.text(
          `${ele.itemWeight.toFixed(2)} ${ele.itemWeightUnit}`,
          formatSize.table.items.x2 + level * formatSize.table.items.x_step,
          lastItemY
        );
        level += 1;
      }
      doc.text(
        `$ ${ele.itemValue.toFixed(2)}`,
        formatSize.table.items.x2 + level * formatSize.table.items.x_step,
        lastItemY
      );
      level += 1;
      doc.text(
        `$ ${ele.totalValue.toFixed(2)}`,
        formatSize.table.items.x2 + level * formatSize.table.items.x_step,
        lastItemY
      );
    });

    const footerLineY = lastItemY + formatSize.foorterDivider.y_step;
    doc.setLineWidth(0.01);
    doc.line(
      formatSize.foorterDivider.x1,
      footerLineY,
      formatSize.foorterDivider.x2,
      footerLineY
    );
    doc.text(
      'Subtotal',
      formatSize.subTotal.x1,
      footerLineY + formatSize.subTotal.y_step
    );
    doc.text(
      `$ ${
        order.orderAmount
          ? order.orderAmount.toFixed(2)
          : orderItems!
              .reduce(
                (acumulator, ele) => acumulator + ele.itemValue * ele.quantity,
                0
              )
              .toFixed(2)
      }`,
      formatSize.subTotal.x2,
      footerLineY + formatSize.subTotal.y_step
    );
  }

  // Output
  const link = doc.output('blob');
  window.open(URL.createObjectURL(link));
};

/*
export const downloadLabelsHandler = (
  labelsData: Label[] | undefined,
  format: string
): void => {
  if (labelsData && labelsData.length > 0) {
    const fileSize = FILE_FORMAT_SIZES[format];
    const formatSize = PACKING_SLIP_FOMAT_SIZES[format];
    const doc = new JSPDF({ unit: 'in', format: fileSize });
    let imageSrc = `data:image/${labelsData[0].format.toLowerCase()};base64,${
      labelsData[0].label
    }`;
    doc.addImage(
      imageSrc,
      labelsData[0].format,
      0,
      0,
      fileSize[0],
      fileSize[1]
    );
    if (labelsData[0].isTest) {
      doc.setFontSize(formatSize.sample.font_size);
      doc.text('Sample', formatSize.sample.x, formatSize.sample.y, {
        angle: formatSize.sample.angle,
        align: 'center'
      });
    }

    labelsData.forEach((label, index) => {
      if (index > 0) {
        imageSrc = `data:image/${label.format.toLowerCase()};base64,${
          label.label
        }`;
        doc.addPage(fileSize);
        doc.addImage(imageSrc, label.format, 0, 0, fileSize[0], fileSize[1]);
        if (label.isTest) {
          doc.setFontSize(formatSize.sample.font_size);
          doc.text('Sample', formatSize.sample.x, formatSize.sample.y, {
            angle: formatSize.sample.angle,
            align: 'center'
          });
        }
      }
    });

    const link = doc.output('blob');
    window.open(URL.createObjectURL(link));
  }
};
*/
