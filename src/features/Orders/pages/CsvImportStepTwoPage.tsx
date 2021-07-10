import {
  Alert,
  Button,
  Checkbox,
  Col,
  Form,
  PageHeader,
  Row,
  Select,
  Space,
  Spin,
  Table
} from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
  CsvTableRecord,
  CsvUploadError
} from '../../../custom_types/order-page';
import {
  selectCsvData,
  setCsvData,
  setShowCsvModal
} from '../../../redux/orders/ordersSlice';
import NoData from '../../../shared/components/NoData';
import {
  CSV_TITLE_OPTIONS,
  SERVER_ROUTES,
  UI_ROUTES
} from '../../../shared/utils/constants';
import CsvSelect from '../../../shared/components/CsvSelect';
import axios from '../../../shared/utils/axios.base';
import errorHandler from '../../../shared/components/errorHandler';
import { selectCurUser } from '../../../redux/user/userSlice';

const { Option } = Select;

const CsvImportStepTwoPage = (): ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectCurUser);
  const csvData = useSelector(selectCsvData);
  const [error, setError] = useState<CsvUploadError | undefined>();
  const [csvTabelData, setCsvTableData] = useState<
    CsvTableRecord[] | undefined
  >();
  const [csvMap, setCsvMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    setAgreed(false);
    setError(undefined);
    setCsvTableData(undefined);
    setCsvMap({});
    setLoading(false);

    if (!csvData || csvData.list.length < 2) {
      history.push(`${UI_ROUTES.ORDERS}${UI_ROUTES.CSV_IMPORT}`);
    } else {
      const tabelData: CsvTableRecord[] = [];
      const map: Record<number, string> = {};
      const csvHeaderRow = csvData.list[0];
      const csvFirstData = csvData.list[1];
      for (let i = 0; i < csvHeaderRow.length; i += 1) {
        const record: CsvTableRecord = {
          header: csvHeaderRow[i],
          option: i,
          data: csvFirstData[i]
        };
        tabelData.push(record);
        if (i < CSV_TITLE_OPTIONS.length) {
          map[i] = CSV_TITLE_OPTIONS[i].value;
        } else {
          map[i] = CSV_TITLE_OPTIONS[CSV_TITLE_OPTIONS.length - 1].value;
        }
      }
      setCsvTableData(tabelData);
      setCsvMap(map);
    }
  }, [csvData, history]);

  const updateMapHandler = (index: number, value: string): void => {
    const newMap = { ...csvMap };
    newMap[index] = value;
    setCsvMap(newMap);
  };

  const checkForRequiredField = (map: Record<number, string>): boolean => {
    const requiredMap: Record<string, number> = {};
    const required = CSV_TITLE_OPTIONS.filter((ele) => ele.required);
    required.forEach((ele) => {
      requiredMap[ele.value] = 0;
    });
    Object.values(map).forEach((val) => {
      if (requiredMap[val] === 0) {
        requiredMap[val] = 1;
      }
    });
    const fields: string[] = [];
    for (let i = 0; i < Object.keys(requiredMap).length; i += 1) {
      const key = Object.keys(requiredMap)[i];
      if (requiredMap[key] === 0) {
        const field = CSV_TITLE_OPTIONS.find((ele) => ele.value === key);
        if (field) fields.push(field.name);
      }
    }

    if (fields.length > 0) {
      const newError: CsvUploadError = {
        description:
          'You did not specify some required value(s). Please choose them below or upload a new file that contains this data:',
        fields
      };
      setError(newError);
      return false;
    }
    return true;
  };

  const checkDuplication = (map: Record<number, string>): boolean => {
    const countMap: Record<string, boolean> = {};
    const fields: string[] = [];
    Object.values(map).forEach((val) => {
      if (!countMap[val]) {
        countMap[val] = true;
      } else if (val !== 'ignore') {
        const field = CSV_TITLE_OPTIONS.find((ele) => ele.value === val);
        if (field) fields.push(field.name);
      }
    });
    if (fields.length > 0) {
      const newError: CsvUploadError = {
        description:
          'You selected the same value more than once in the dopr down menus. Please check your drop down menu selections and ensure that you are only using the headings once each. The duplicates are:',
        fields
      };
      setError(newError);
      return false;
    }
    return true;
  };

  const validateMap = (map: Record<number, string>): boolean => {
    return checkDuplication(map) && checkForRequiredField(map);
  };

  const uploadHandler = () => {
    if (validateMap(csvMap) && csvData && user) {
      const finalMap: Record<string, number> = {};
      setLoading(true);
      for (let i = 0; i < Object.keys(csvMap).length; i += 1) {
        const key = Object.keys(csvMap)[i];
        const val = csvMap[parseInt(key, 10)];
        if (val !== 'ignore') {
          finalMap[val] = parseInt(key, 10);
        }
      }
      axios
        .post(
          `${SERVER_ROUTES.CLIENT_SHIPMENTS}${SERVER_ROUTES.CSV}`,
          {
            map: finalMap,
            name: csvData.name
          },
          {
            headers: {
              Authorization: `${user.token_type} ${user.token}`
            }
          }
        )
        .then(() => {
          dispatch(setCsvData(undefined));
          dispatch(setShowCsvModal(true));
        })
        .catch((err) => {
          errorHandler(err, dispatch);
          const newError: CsvUploadError = {
            description: '上传失败，请检查上传文件或联系我们.',
            fields: []
          };
          setError(newError);
        })
        .finally(() => setLoading(false));
    }
  };

  const columns = [
    {
      title: '上传文件表头',
      key: 'csv_column_title',
      dataIndex: 'header',
      render: (header: string): ReactElement => {
        return <div style={{ padding: '16px' }}>{header}</div>;
      }
    },
    {
      title: '匹配数据',
      key: 'parcelselite_option',
      dataIndex: 'option',
      render: (index: number): ReactElement => {
        return <CsvSelect index={index} onSelect={updateMapHandler} />;
      }
    },
    {
      title: '上传文件第一列数据',
      key: 'csv_first_data',
      dataIndex: 'data',
      render: (data: string): ReactElement => {
        return <div style={{ padding: '16px' }}>{data}</div>;
      }
    }
  ];

  return (
    <div>
      <PageHeader title="批量上传" />
      <div style={{ padding: '10px 24px' }}>
        {error && (
          <Alert
            style={{ padding: '5px 15px', marginBottom: '10px' }}
            message={error.description}
            type="error"
            description={
              <ul>
                {error.fields.map((ele) => (
                  <li key={ele}>{ele}</li>
                ))}
              </ul>
            }
          />
        )}
        <h4>第二步 - 请核对和匹配您上传的数据</h4>
        <p style={{ color: '#8fa1aa' }}>
          如果上传文件有误,{' '}
          <Link to={`${UI_ROUTES.ORDERS}${UI_ROUTES.CSV_IMPORT}`}>
            请返回并再次上传.
          </Link>
        </p>
        <Spin spinning={loading}>
          <Row>
            <Col span={12}>
              <Form.Item style={{ width: '300px' }} label="CSV 模板">
                <Select defaultValue="default">
                  <Option key="default" value="default">
                    默认
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Space size="large">
                <Alert
                  style={{
                    padding: '3px 15px',
                    marginBottom: '10px',
                    width: '380px'
                  }}
                  type="warning"
                  showIcon
                  message="请仔细核对上传数据, 批量上传将直接生成面单并产生邮寄费用. 面单生成后，邮寄费用将不予退还。"
                />
                <Checkbox
                  onChange={() => setAgreed(!agreed)}
                  style={{ width: '150px' }}
                >
                  我已阅读并同意
                </Checkbox>
                <Button
                  style={{ float: 'right' }}
                  type="primary"
                  loading={loading}
                  onClick={uploadHandler}
                  disabled={!agreed}
                >
                  上传数据
                </Button>
              </Space>
            </Col>
          </Row>
          <Table<CsvTableRecord>
            rowKey={(record) => record.option}
            columns={columns}
            dataSource={csvTabelData}
            locale={{
              emptyText: <NoData />
            }}
            pagination={false}
          />
        </Spin>
      </div>
    </div>
  );
};

export default CsvImportStepTwoPage;
