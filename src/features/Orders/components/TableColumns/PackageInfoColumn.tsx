import {
  CaretDownFilled,
  CaretUpFilled,
  PlusOutlined
} from '@ant-design/icons';
import { Button, Col, Popover, Row } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import convert from 'convert-units';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { OrderTabelColumnProps } from '../../../../custom_types/order-page';
import { PACKAGE_TYPE_NAMES } from '../../../../shared/utils/constants';

import { selectPackagesUnits } from '../../../../redux/settings/settingSlice';

import './columns.css';
import PackageInfoForm from '../PackageInfoForm';

const PackageInfoColumn = ({ record }: OrderTabelColumnProps): ReactElement => {
  const { packageInfo, morePackages } = record;
  const packageSetting = useSelector(selectPackagesUnits);
  const [showIcon, setShowIcon] = useState(<CaretDownFilled />);
  const [popVisible, setPopVisible] = useState(false);

  useEffect(() => {
    setShowIcon(<CaretDownFilled />);
  }, [record]);

  const closePopover = () => {
    setPopVisible(false);
    setShowIcon(<CaretDownFilled />);
  };

  return (
    <Popover
      title={
        <h3 style={{ padding: '4px 10px' }}>
          <FormattedMessage id="packageInfo" />
        </h3>
      }
      trigger={['click']}
      content={
        <PackageInfoForm
          order={record}
          onCancel={closePopover}
          onOk={closePopover}
          onOrderPage
        />
      }
      visible={popVisible}
      onVisibleChange={(visible) => {
        if (visible) {
          setShowIcon(<CaretUpFilled />);
        } else {
          setShowIcon(<CaretDownFilled />);
        }
        setPopVisible(visible);
      }}
    >
      <Row className="default-column">
        {packageInfo ? (
          <>
            {morePackages && morePackages.length > 0 ? (
              <>
                <Col span={20}>
                  <Row>
                    <strong>{`${morePackages.length + 1} packages`}</strong>
                  </Row>
                </Col>
                <Col span={4}>{showIcon}</Col>
              </>
            ) : (
              <>
                <Col span={20}>
                  <Row>
                    <strong>
                      {PACKAGE_TYPE_NAMES[packageInfo.packageType]}
                    </strong>
                  </Row>
                  <Row style={{ whiteSpace: 'pre' }}>
                    {`${convert(packageInfo.weight.value)
                      .from(packageInfo.weight.unitOfMeasure)
                      .to(packageSetting.weightUnit)
                      .toFixed(2)}${packageSetting.weightUnit}   ${convert(
                      packageInfo.dimentions.length
                    )
                      .from(packageInfo.dimentions.unitOfMeasure)
                      .to(packageSetting.distanceUnit)
                      .toFixed(2)} x ${convert(packageInfo.dimentions.width)
                      .from(packageInfo.dimentions.unitOfMeasure)
                      .to(packageSetting.distanceUnit)
                      .toFixed(2)} x ${convert(packageInfo.dimentions.height)
                      .from(packageInfo.dimentions.unitOfMeasure)
                      .to(packageSetting.distanceUnit)
                      .toFixed(2)} ${packageSetting.distanceUnit}`}
                  </Row>
                </Col>
                <Col span={4}>{showIcon}</Col>
              </>
            )}
          </>
        ) : (
          <Button
            type="link"
            icon={<PlusOutlined />}
            style={{ marginTop: '2px', marginBottom: '2px' }}
          >
            {' '}
            <FormattedMessage id="add_package_info" />
          </Button>
        )}
      </Row>
    </Popover>
  );
};

export default PackageInfoColumn;
