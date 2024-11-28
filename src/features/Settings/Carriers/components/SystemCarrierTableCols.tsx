import { Image } from 'antd';
import React, { ReactElement } from 'react';
import { IService } from '../../../../custom_types/carrier-page';
import { getCarrierLogo } from '../../../../shared/utils/logo.helper';

const columns = [
  // {
  //   title: '',
  //   key: 'logo',
  //   dataIndex: 'carrier',
  //   render: (carrier: string): ReactElement => {
  //     return (
  //       <div
  //         style={{
  //           display: 'flex',
  //           justifyContent: 'left',
  //           alignItems: 'left'
  //         }}
  //       >
  //         <Image
  //           style={{ height: '80px', width: '130px', margin: '20px 40px' }}
  //           src={getCarrierLogo(carrier)}
  //           preview={false}
  //         />{' '}
  //         <div style={{ marginTop: '50px' }}>{carrier}</div>
  //       </div>
  //     );
  //   }
  // },
  {
    title: '账号名称',
    key: 'accountName',
    dataIndex: 'accountName'
  },
  {
    title: '账号ID',
    key: 'accountId',
    dataIndex: 'accountId'
  },
  {
    title: '授权服务',
    key: 'services',
    dataIndex: 'services',
    render: (services: IService[]): string => {
      return services.map((ele) => ele.name).join(', ');
    }
  },
  {
    title: '分拣中心',
    key: 'facilities',
    dataIndex: 'facilities',
    render: (facilities: string[]): string => {
      if (!facilities) return '-';
      return facilities.join(', ');
    }
  },
  {
    title: '备注',
    key: 'note',
    dataIndex: 'note',
    render: (note: string | undefined): string => {
      if (!note) return '';
      return note;
    }
  }
];

export default columns;
