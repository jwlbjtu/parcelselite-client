import { Button, Card, Form, PageHeader, Select } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { LabelsPageData } from '../../../../custom_types/redux-types';
import {
  selectLabels,
  saveLabelSettings,
  selectSettingsLoading
} from '../../../../redux/settings/settingSlice';
import { FILE_FORMATS, FILE_TYPES } from '../../../../shared/utils/constants';

interface FormData {
  labelSettings: string;
  packSettings: string;
}

const { Option } = Select;

const LabelPage = (): ReactElement => {
  const labels = useSelector(selectLabels);
  const loading = useSelector(selectSettingsLoading);
  const dispatch = useDispatch();

  const formSubmitHandler = (values: FormData) => {
    const labelData = values.labelSettings.split('_');
    const packData = values.packSettings.split('_');
    const data: LabelsPageData = {
      id: labels.id,
      labelSettings: { format: labelData[0], type: labelData[1] },
      packSlipSettings: { format: packData[0], type: packData[1] }
    };
    dispatch(saveLabelSettings(data));
  };

  return (
    <div>
      <PageHeader
        title={<FormattedMessage id="labels" />}
        subTitle={<FormattedMessage id="labelsSubtitle" />}
      />
      <Form layout="vertical" onFinish={formSubmitHandler}>
        <Card
          title={<FormattedMessage id="labelsSettingTitle" />}
          headStyle={{ backgroundColor: '#fbfbfb', textAlign: 'left' }}
        >
          <div style={{ maxWidth: '375px' }}>
            <Form.Item
              label={<FormattedMessage id="labelFormat" />}
              name="labelSettings"
              initialValue={`${labels.labelSettings.format}_${labels.labelSettings.type}`}
            >
              <Select placeholder={<FormattedMessage id="labelFormat" />}>
                <Option value={`${FILE_FORMATS.thermal}_${FILE_TYPES.pdf}`}>
                  4x6in PDF (Thermal Label Printer)
                </Option>
                <Option value={`${FILE_FORMATS.standard}_${FILE_TYPES.pdf}`}>
                  8.5x11in PDF (Standard Printer)
                </Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={<FormattedMessage id="packFormat" />}
              name="packSettings"
              initialValue={`${labels.packSlipSettings.format}_${labels.packSlipSettings.type}`}
            >
              <Select placeholder={<FormattedMessage id="packFormat" />}>
                <Option value={`${FILE_FORMATS.standard}_${FILE_TYPES.pdf}`}>
                  8.5x11in PDF (Standard Printer)
                </Option>
                <Option value={`${FILE_FORMATS.thermal}_${FILE_TYPES.pdf}`}>
                  4x6in PDF (Thermal Label Printer)
                </Option>
              </Select>
            </Form.Item>
          </div>
        </Card>
        <div style={{ textAlign: 'left', marginTop: '20px' }}>
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
    </div>
  );
};

export default LabelPage;
