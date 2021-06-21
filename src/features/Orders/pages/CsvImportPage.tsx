import { Alert, Button, Col, PageHeader, Row, Upload } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  CSV_SAMPLE_FILE,
  DEFAULT_SERVER_HOST,
  SERVER_ROUTES,
  UI_ROUTES
} from '../../../shared/utils/constants';
import {
  selectShowCsvModal,
  setCsvData
} from '../../../redux/orders/ordersSlice';
import CsvProcessModal from '../components/CsvProcessModal';
import { selectCurUser } from '../../../redux/user/userSlice';

const { Dragger } = Upload;

const CsvImportPage = (): ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const showCsvModal = useSelector(selectShowCsvModal);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectCurUser);

  useEffect(() => {
    setLoading(false);
    setShowError(false);
    dispatch(setCsvData(undefined));
  }, [dispatch]);

  const uploadHandler = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
    }
    if (info.file.status === 'done') {
      setLoading(false);
      dispatch(setCsvData(info.file.response));
      history.push(
        `${UI_ROUTES.ORDERS}${UI_ROUTES.CSV_IMPORT}${UI_ROUTES.STEP_TWO}`
      );
    } else if (info.file.status === 'error') {
      setLoading(false);
      setShowError(true);
    }
  };

  return (
    <div>
      <CsvProcessModal show={showCsvModal} />
      <PageHeader title="Import CSV file" />
      <Row gutter={40} style={{ padding: '10px 24px' }}>
        <Col span={12}>
          <h4>Step 1 - Select CSV file to upload</h4>
          <p style={{ color: '#8fa1aa' }}>
            Upload all your orders easily by import a csv file with all
            information
          </p>
          {showError && (
            <Alert
              style={{ padding: '3px 15px', marginBottom: '10px' }}
              type="error"
              showIcon
              message="Failed to upload. Please try another file or contact us for support."
            />
          )}
          <Dragger
            name="csv_file"
            multiple={false}
            accept=".csv"
            showUploadList={false}
            action={`${DEFAULT_SERVER_HOST}${SERVER_ROUTES.ORDERS}${SERVER_ROUTES.PRELOAD}`}
            headers={{
              Authorization: `${user?.token_type} ${user?.token}`
            }}
            onChange={uploadHandler}
          >
            <p className="ant-upload-text">Drag a file here</p>
            <p className="ant-upload-hint" style={{ fontStyle: 'italic' }}>
              or
            </p>
            <Button type="primary" loading={loading}>
              <strong>Select file</strong>
            </Button>
          </Dragger>
        </Col>
        <Col span={12}>
          <h4>Which columns does my csv file need to have?</h4>
          <p style={{ color: '#8fa1aa' }}>
            You can order and name your columns any way you like, you will be
            able to map them later on in the process.{' '}
            <a
              href={`${DEFAULT_SERVER_HOST}${SERVER_ROUTES.STATIC}/${CSV_SAMPLE_FILE}`}
            >
              Download a sample CSV
            </a>
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default CsvImportPage;
