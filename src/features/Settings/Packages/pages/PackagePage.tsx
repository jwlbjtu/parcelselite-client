import { Button, Card, Form, PageHeader, Select } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { PackagesUnitSettings } from '../../../../custom_types/redux-types';
import {
  savePackagesUnitsSettings,
  selectPackagesUnits,
  selectSettingsLoading
} from '../../../../redux/settings/settingSlice';
import { DistanceUnit, WeightUnit } from '../../../../shared/utils/constants';

interface FormData {
  weightUnit: string;
  distanceUnit: string;
}

const { Option } = Select;

const PackagePage = (): ReactElement => {
  const packagesUnitsSettings = useSelector(selectPackagesUnits);
  const loading = useSelector(selectSettingsLoading);
  const dispatch = useDispatch();

  const formSubmitHandler = (values: FormData) => {
    const data: PackagesUnitSettings = {
      id: packagesUnitsSettings.id,
      weightUnit: values.weightUnit as WeightUnit,
      distanceUnit: values.distanceUnit as DistanceUnit
    };
    dispatch(savePackagesUnitsSettings(data));
  };

  return (
    <div>
      <PageHeader
        title={<FormattedMessage id="packages" />}
        subTitle={<FormattedMessage id="packagesSubtitle" />}
      />
      <Card>
        <Form
          style={{ maxWidth: '375px' }}
          layout="vertical"
          onFinish={formSubmitHandler}
        >
          <Form.Item
            label={<FormattedMessage id="weightUnitSelection" />}
            name="weightUnit"
            initialValue={packagesUnitsSettings.weightUnit}
          >
            <Select>
              {Object.values(WeightUnit).map((unit) => {
                return (
                  <Option key={unit} value={unit}>
                    {unit}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="distanceUnitSelection" />}
            name="distanceUnit"
            initialValue={packagesUnitsSettings.distanceUnit}
          >
            <Select>
              {Object.values(DistanceUnit).map((unit) => {
                return (
                  <Option key={unit} value={unit}>
                    {unit}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <div>
            <Button
              style={{ width: '100px' }}
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              <strong>
                <FormattedMessage id="saveSettigns" />
              </strong>
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default PackagePage;
