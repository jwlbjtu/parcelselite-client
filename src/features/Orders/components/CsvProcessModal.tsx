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
      title="正在处理上传数据"
      closable={false}
      footer={
        <Space>
          <Button
            type="link"
            onClick={() => clickedHandler(`${UI_ROUTES.ORDERS}`)}
          >
            前往物流订单页面
          </Button>
        </Space>
      }
    >
      您的订单已上传, 后台正在处理中. 处理完成后我们将发送邮件通知到邮箱：{' '}
      {user && user.email}。数据处理过程中，暂时无法再次上传订单。
    </Modal>
  );
};

export default CsvProcessModal;
