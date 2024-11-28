import { Button } from 'antd';
import React, { useState } from 'react';

interface DownloadCSEButtonProps {
  label: string;
  data: any;
  fileName: string;
}

const DownloadCSEButton = ({
  label,
  data,
  fileName
}: DownloadCSEButtonProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const convertToCSV = (objArray: any) => {
    const array = typeof objArray !== 'object' ? JSON.parse(data) : data;
    let str = '';

    for (let i = 0; i < array.length; i += 1) {
      let line = '';
      Object.keys(array[i]).forEach((key, index) => {
        if (line !== '') line += ',';

        line += array[i][key];
      });
      str += `${line}\r\n`;
    }
    return str;
  };

  const downloadCSV = () => {
    setLoading(true);
    const csvData = new Blob([convertToCSV(data)], {
      type: 'text/csv'
    });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.href = csvURL;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoading(false);
  };

  return (
    <Button
      loading={loading}
      type="primary"
      onClick={downloadCSV}
      disabled={!data || data.length === 0}
    >
      {label}
    </Button>
  );
};

export default DownloadCSEButton;
