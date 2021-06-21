import { Button, Image, Modal, Space, Timeline } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { TrackingInfo } from '../../../custom_types/shipment-page';
import {
  setShowTrackingModal,
  setTrackingInfo
} from '../../../redux/shipments/shipmentSlice';
import NoData from '../../../shared/components/NoData';
import { getCarrierLogo } from '../../../shared/utils/logo.helper';

interface TrackingModalProps {
  trackingInfo: TrackingInfo | undefined;
  show: boolean;
}

const TrackingModal = ({
  trackingInfo,
  show
}: TrackingModalProps): ReactElement => {
  const dispatch = useDispatch();

  const onCloseHandler = () => {
    dispatch(setShowTrackingModal(false));
    dispatch(setTrackingInfo(undefined));
  };

  return (
    <Modal
      title={
        trackingInfo ? (
          <Space size="large">
            <Image
              style={{ width: '80px', height: '60px' }}
              preview={false}
              src={getCarrierLogo(trackingInfo.carrier)}
            />
            <div style={{ fontSize: '18px' }}>{trackingInfo.tracking}</div>
          </Space>
        ) : (
          <div style={{ fontSize: '18px' }}>Tracking Info</div>
        )
      }
      visible={show}
      closable={false}
      footer={
        <Button onClick={onCloseHandler}>
          <FormattedMessage id="ok" />
        </Button>
      }
    >
      {trackingInfo && trackingInfo.events.length > 0 ? (
        <Timeline>
          {trackingInfo.events.map((ele) => (
            <Timeline.Item key={ele.timestamp}>
              <div>
                <strong>{ele.event}</strong>
              </div>
              <div>{ele.timestamp}</div>
              <div>{ele.location}</div>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <NoData />
      )}
    </Modal>
  );
};

export default TrackingModal;
