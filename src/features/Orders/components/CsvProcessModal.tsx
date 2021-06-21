import { Button, Modal, Space } from 'antd';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setShowCsvModal } from '../../../redux/orders/ordersSlice';
import { selectCurUser } from '../../../redux/user/userSlice';
import { UI_ROUTES } from '../../../shared/utils/constants';

interface CsvProcessModalProps {
  show: boolean;
}

const CsvProcessModal = ({ show }: CsvProcessModalProps): ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectCurUser);

  const clickedHandler = (url: string): void => {
    dispatch(setShowCsvModal(false));
    history.push(url);
  };

  return (
    <Modal
      visible={show}
      title="Upload in Progess"
      closable={false}
      footer={
        <Space>
          <Button
            type="link"
            onClick={() =>
              clickedHandler(`${UI_ROUTES.ORDERS}${UI_ROUTES.CSV_IMPORT}`)
            }
          >
            Import Another CSV File
          </Button>
          <div>|</div>
          <Button
            type="link"
            onClick={() => clickedHandler(`${UI_ROUTES.ORDERS}`)}
          >
            Go to Orders Page
          </Button>
        </Space>
      }
    >
      Your orders are being imported. You will receive an email notification at{' '}
      {user && user.email} when the import has been processed.
    </Modal>
  );
};

export default CsvProcessModal;
