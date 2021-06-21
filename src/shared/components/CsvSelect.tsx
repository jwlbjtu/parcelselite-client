import React, { ReactElement } from 'react';
import { Select } from 'antd';
import { CSV_TITLE_OPTIONS } from '../utils/constants';

const { Option } = Select;

interface CsvSelectProps {
  index: number;
  onSelect: (index: number, value: string) => void;
}

const CsvSelect = ({ index, onSelect }: CsvSelectProps): ReactElement => {
  const selectedIndex =
    index >= CSV_TITLE_OPTIONS.length ? CSV_TITLE_OPTIONS.length - 1 : index;
  return (
    <Select
      style={{ width: '250px', paddingLeft: '16px' }}
      defaultValue={CSV_TITLE_OPTIONS[selectedIndex].value}
      onSelect={(value: string) => onSelect(index, value)}
    >
      {CSV_TITLE_OPTIONS.map((ele) => (
        <Option key={ele.value} value={ele.value}>
          {ele.name}
          {ele.required && <sup>*</sup>}
        </Option>
      ))}
    </Select>
  );
};

export default CsvSelect;
