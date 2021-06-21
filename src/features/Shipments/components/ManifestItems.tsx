import {
  EllipsisOutlined,
  ExclamationCircleTwoTone,
  ReloadOutlined,
  setTwoToneColor
} from '@ant-design/icons';
import { Button, Divider, Popover, Space } from 'antd';
import dayjs from 'dayjs';
import React, { ReactElement } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Manifest } from '../../../custom_types/redux-types';
import { refreshManifestHandler } from '../../../redux/shipments/shipmentSlice';
import { FILE_FORMATS } from '../../../shared/utils/constants';
import { downloadPdfHandler } from '../../../shared/utils/pdf.helpers';

interface ManifestItemsProp {
  manifests: Manifest[];
}

const ManifestItems = ({ manifests }: ManifestItemsProp): ReactElement => {
  const dispatch = useDispatch();

  const generateTimeEle = (ele: Manifest) => (
    <strong>
      <FormattedDate
        value={dayjs(ele.timestamp).toISOString()}
        year="numeric"
        month="2-digit"
        day="2-digit"
      />{' '}
      <FormattedTime value={dayjs(ele.timestamp).toISOString()} />
    </strong>
  );

  const generateErrorEle = (manifestErrors: string[]) => (
    <Popover
      title="Errors"
      content={
        <ul>
          {manifestErrors.map((ele) => (
            <li>{ele}</li>
          ))}
        </ul>
      }
    >
      <ExclamationCircleTwoTone
        style={{ cursor: 'pointer' }}
        twoToneColor="#faad14"
      />
    </Popover>
  );

  const generateManifestItem = (
    index: string | undefined,
    ele: ReactElement,
    manifest: Manifest
  ): ReactElement => {
    return (
      <div key={`${manifest.id}-${index || '1'}`}>
        <Divider />
        {generateTimeEle(manifest)} {ele}{' '}
        {manifest.manifestErrors.length > 0
          ? generateErrorEle(manifest.manifestErrors)
          : null}
      </div>
    );
  };

  const result: ReactElement[] = [];
  for (let i = 0; i < manifests.length; i += 1) {
    const manifest = manifests[i];
    if (manifest.status && manifest.status === 'COMPLETED') {
      if (manifest.manifests.length === 0) {
        result.push(
          generateManifestItem(
            '0',
            <Button type="text">No manifest created</Button>,
            manifest
          )
        );
      } else {
        const list = manifest.manifests;
        list.forEach((ele, index) => {
          result.push(
            generateManifestItem(
              index.toString(),
              <Button
                type="link"
                onClick={() =>
                  downloadPdfHandler(ele.manifestData, FILE_FORMATS.standard)
                }
              >
                View Manifest
              </Button>,
              manifest
            )
          );
        });
      }
    } else {
      result.push(
        generateManifestItem(
          '0',
          <Space size="large" style={{ marginLeft: '20px' }}>
            <div>Processing manifest</div>
            <Button
              type="link"
              icon={<ReloadOutlined />}
              onClick={() => dispatch(refreshManifestHandler(manifest.id))}
            >
              Refresh
            </Button>
          </Space>,
          manifest
        )
      );
    }
  }

  return <>{result}</>;
};

export default ManifestItems;
