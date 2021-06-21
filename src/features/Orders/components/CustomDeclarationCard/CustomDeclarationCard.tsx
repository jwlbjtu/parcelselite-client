import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Order } from '../../../../custom_types/order-page';
import {
  selectShowCustomModal,
  setShowCustomModal
} from '../../../../redux/orders/ordersSlice';
import CustomDetailModal from './CustomDetailsModal';

interface CustomElementProps {
  title: string;
  value: string | undefined;
}

interface CustomDeclarationCardProps {
  order: Order;
}

const CustomElement = ({ title, value }: CustomElementProps): ReactElement => {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div>
        <small>{title}</small>
      </div>
      <div>{value || 'None'}</div>
    </div>
  );
};

const CustomDeclarationCard = ({
  order
}: CustomDeclarationCardProps): ReactElement => {
  const dispatch = useDispatch();
  const [showFull, setShowFull] = useState(false);
  const showModal = useSelector(selectShowCustomModal);

  useEffect(() => {
    setShowFull(false);
  }, []);

  const toggleShowFull = () => setShowFull(!showFull);

  return (
    <>
      <CustomDetailModal
        show={showModal}
        order={order}
        onCancel={() => dispatch(setShowCustomModal(false))}
      />
      <Card
        size="small"
        title={
          <div>
            <strong>Customs Declaration</strong>
            <Button
              type="link"
              style={{ float: 'right' }}
              onClick={() => dispatch(setShowCustomModal(true))}
            >
              Edit Customs
            </Button>
          </div>
        }
      >
        <Row>
          <Col span={12}>
            <CustomElement
              title="Type of Content"
              value={order.customDeclaration?.typeOfContent}
            />
            {showFull && (
              <>
                <CustomElement
                  title="Exporter Reference"
                  value={order.customDeclaration?.exporterRef}
                />
                <CustomElement
                  title="Invoice"
                  value={order.customDeclaration?.invoice}
                />
                <CustomElement
                  title="License"
                  value={order.customDeclaration?.license}
                />
                <CustomElement
                  title="Signing Person"
                  value={order.customDeclaration?.signingPerson}
                />
                <CustomElement
                  title="B13A Option"
                  value={order.customDeclaration?.b13a}
                />
                <CustomElement
                  title="Notes"
                  value={order.customDeclaration?.notes}
                />
              </>
            )}
          </Col>
          <Col span={12}>
            <CustomElement
              title="Incoterm"
              value={order.customDeclaration?.incoterm}
            />
            {showFull && (
              <>
                <CustomElement
                  title="Importer Reference"
                  value={order.customDeclaration?.importerRef}
                />
                <CustomElement
                  title="Non-delivery Handling"
                  value={order.customDeclaration?.nonDeliveryHandling}
                />
                <CustomElement
                  title="Certificate"
                  value={order.customDeclaration?.certificate}
                />
                <CustomElement
                  title="EEL/PFC"
                  value={order.customDeclaration?.eelpfc}
                />
              </>
            )}
          </Col>
        </Row>
        <div style={{ textAlign: 'center' }}>
          <Button type="text" onClick={toggleShowFull}>
            {showFull ? 'Hide details' : 'Show details'}
            {showFull ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Button>
        </div>
      </Card>
    </>
  );
};

export default CustomDeclarationCard;
