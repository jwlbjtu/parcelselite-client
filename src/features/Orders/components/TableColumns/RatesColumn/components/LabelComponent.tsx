import { Col, Image, Row, Typography } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from '../../../../../../custom_types/order-page';
import { getCarrierIcon } from '../../../../../../shared/utils/logo.helper';
import { getDisplayTracking } from '../../../../../../shared/utils/rates.helper';

const { Paragraph } = Typography;

interface LabelComponentProps {
  labels: Label[];
}

const LabelComponent = ({ labels }: LabelComponentProps): ReactElement => {
  const labelData = labels[0];

  return (
    <Row className="default-column">
      <Col className="icon-col" span={4}>
        <Image
          src={getCarrierIcon(labelData.carrier)}
          preview={false}
          style={{ width: '24px', height: '24px' }}
        />
      </Col>
      <Col span={20}>
        <Row>{labelData.carrier}</Row>
        <Row>
          <Paragraph
            style={{ margin: 0 }}
            copyable={{
              text: getDisplayTracking(
                labelData.carrier,
                labelData.tracking,
                labelData.serviceId
              ),
              tooltips: [
                <FormattedMessage id="copy" />,
                <FormattedMessage id="copied" />
              ]
            }}
          >
            {getDisplayTracking(
              labelData.carrier,
              labelData.tracking,
              labelData.serviceId
            )}
          </Paragraph>
        </Row>
      </Col>
    </Row>
  );
};

export default LabelComponent;
