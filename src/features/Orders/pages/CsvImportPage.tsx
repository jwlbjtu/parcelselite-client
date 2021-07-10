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
import {
  fetchAddressesHandler,
  selectAddresses
} from '../../../redux/settings/addressSlice';

const { Dragger } = Upload;

const CsvImportPage = (): ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const showCsvModal = useSelector(selectShowCsvModal);
  const [showError, setShowError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectCurUser);
  const address = useSelector(selectAddresses);

  useEffect(() => {
    setLoading(false);
    setShowError(undefined);
    dispatch(setCsvData(undefined));
    dispatch(fetchAddressesHandler());
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
      setShowError(
        info.file.response.message || '上传失败，请检查上传文件或联系我们.'
      );
    }
  };

  return (
    <div>
      <CsvProcessModal show={showCsvModal} />
      <PageHeader title="批量上传" />
      <Row gutter={40} style={{ padding: '10px 24px' }}>
        <Col span={12}>
          <h4>第一步 - 选择需要上传的 CSV 文件</h4>
          <p style={{ color: '#8fa1aa' }}>使用 csv 文件轻松批量上传订单</p>
          {showError && (
            <Alert
              style={{ padding: '3px 15px', marginBottom: '10px' }}
              type="error"
              showIcon
              message={showError}
            />
          )}
          {(!address || address.length <= 0) && (
            <Alert
              style={{ padding: '3px 15px', marginBottom: '10px' }}
              type="error"
              showIcon
              message="您至少需要有一个默认预存地址来使用批量上传"
            />
          )}
          <Dragger
            name="csv_file"
            multiple={false}
            accept=".csv"
            showUploadList={false}
            action={`${DEFAULT_SERVER_HOST}${SERVER_ROUTES.CLIENT_SHIPMENTS}${SERVER_ROUTES.PRELOAD}`}
            headers={{
              Authorization: `${user?.token_type} ${user?.token}`
            }}
            onChange={uploadHandler}
            disabled={!address || address.length <= 0}
          >
            <p className="ant-upload-text">拖拽文件上传</p>
            <p className="ant-upload-hint" style={{ fontStyle: 'italic' }}>
              或
            </p>
            <Button
              type="primary"
              loading={loading}
              disabled={!address || address.length <= 0}
            >
              <strong>选择文件</strong>
            </Button>
          </Dragger>
        </Col>
        <Col span={12}>
          <h4>CSV 文件需要有哪些数据?</h4>
          <p style={{ color: '#8fa1aa' }}>
            请您根据我们提供的模板填写订单信息, 您将会在下一步对数据进行核对.{' '}
            <a
              href={`${DEFAULT_SERVER_HOST}${SERVER_ROUTES.STATIC}/${CSV_SAMPLE_FILE}`}
            >
              下载 CSV 模板
            </a>
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default CsvImportPage;
