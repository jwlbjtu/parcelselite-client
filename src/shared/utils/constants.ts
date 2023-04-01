export const LOCALES = {
  ENGLISH: 'en',
  CHINESE: 'zh-CN'
};

export const LOCALE_DISPLAIES = {
  [LOCALES.ENGLISH]: 'English',
  [LOCALES.CHINESE]: '简体中文'
};

export const UI_ROUTES = {
  LOGIN: '/login',
  FORGOT: '/forgot',
  RESET: '/reset',
  ORDERS: '/orders',
  MANUAL: '/manual',
  CSV_IMPORT: '/csv-import',
  STEP_TWO: '/step-two',
  DETAIL: '/detail',
  SHIPMENTS: '/shipments',
  MANIFESTS: '/manifests',
  SETTINGS: '/settings',
  ACCOUNT: '/account',
  PROFILE: '/profile',
  BILLING: '/billing',
  // TODO STORES: '/stores',
  CARRIERS: '/carriers',
  ADDRESSES: '/addresses',
  LABELS: '/labels',
  PACKAGES: '/packages'
};

export const SETTING_KEYS = [
  `${UI_ROUTES.ACCOUNT}${UI_ROUTES.PROFILE}`,
  // TODO UI_ROUTES.STORES,
  UI_ROUTES.CARRIERS,
  UI_ROUTES.ADDRESSES,
  UI_ROUTES.LABELS,
  UI_ROUTES.PACKAGES
];

export const CARRIERS = {
  USPS: 'USPS',
  DHL_ECOM: 'DHL eCommerce',
  UPS: 'UPS',
  FEDEX: 'FedEx'
};

export const USPS_INTL_SERVICE_IDS = {
  EXPRESS_INTL: '1',
  PRIORITY_INTL: '2'
};

export const USPS_INTL_SERVICE_IDS_LIST = [
  USPS_INTL_SERVICE_IDS.EXPRESS_INTL,
  USPS_INTL_SERVICE_IDS.PRIORITY_INTL
];

export enum Currency {
  USD = 'USD'
}

export enum Country {
  USA = 'US',
  CHINA = 'CN'
}

export const COUNTRY_NAMES = {
  [Country.USA]: 'United States',
  [Country.CHINA]: 'China'
};

export const COUNTRY_PHONE_LENGTH = {
  [Country.USA]: 10,
  [Country.CHINA]: 11
};

export enum Store {
  PARCELSELITE = 'parcelselite',
  AMAZON = 'amazon',
  EBAY = 'ebay',
  SHOPIFY = 'shopify',
  CSV_IMPORT = 'CSV_Import'
}

export enum WeightUnit {
  G = 'g',
  KG = 'kg',
  OZ = 'oz',
  LB = 'lb'
}

export enum DistanceUnit {
  IN = 'in',
  CM = 'cm'
}

export enum OrderStatus {
  PENDING = 'Pending',
  FULFILLED = 'Shipped'
}

export const COUNTRIES = {
  [Country.USA]: 'United States',
  [Country.CHINA]: 'China'
};

export const STATES: Record<string, Record<string, string>> = {
  [Country.USA]: {
    AL: 'Alabama',
    AK: 'Alaska',
    AZ: 'Arizona',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Delaware',
    DC: 'DISTRICT OF COLUMBIA',
    FL: 'Florida',
    GA: 'Georgia',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    PR: 'Puerto Rico',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming'
  }
};

export const FILE_FORMATS = {
  standard: 'standard',
  thermal: 'thermal'
};

export const FILE_TYPES = {
  pdf: 'PDF',
  png: 'PNG',
  csv: 'CSV'
};

export const FILE_FORMAT_SIZES = {
  [FILE_FORMATS.standard]: [8.5, 11], // A4
  [FILE_FORMATS.thermal]: [4, 6]
};

export const FILE_FORMAT_SIZES_PDF_LIB = {
  [FILE_FORMATS.standard]: [595.28, 841.89], // A4
  [FILE_FORMATS.thermal]: [288, 432]
};

export const FILE_FORMAT_TEXTS = {
  [FILE_FORMATS.standard]: '8.5x11in',
  [FILE_FORMATS.thermal]: '4x6in'
};

export enum PackageTypes {
  PKG = 'PKG'
}

export const PACKAGE_TYPE_NAMES: Record<string, string> = {
  [PackageTypes.PKG]: 'Custom Dimensions'
};

export const PACKING_SLIP_FOMAT_SIZES = {
  [FILE_FORMATS.standard]: {
    fontSize: 10,
    header: {
      background: { x: 0.2, y: 0.2, w: 8.1, h: 0.21 },
      content: { x: 4.25, y: 0.3 }
    },
    sender: { x: 0.3, y: 0.6, step: 0.17 },
    orderInfo: { x: 6, y: 0.6, step: 0.17, distance: 0.1 },
    receipent: { title: { x: 2.5, y: 1.6 }, x: 3.2, y: 1.6, step: 0.17 },
    table: {
      header: { x: 0.3, y: 2.6, x2: 4.5, step: 1 },
      headerDivider: { x1: 0.3, y1: 2.7, x2: 8, y2: 2.7 },
      items: { x: 0.3, y: 3, x2: 4.5, x_step: 1, y_step: 0.2 }
    },
    foorterDivider: { x1: 0.3, x2: 8, y_step: 0.3 },
    subTotal: { x1: 6.5, x2: 7.5, y_step: 0.2 },
    sample: { x: 50, y: 10, angle: 30, font_size: 180 }
  },
  [FILE_FORMATS.thermal]: {
    fontSize: 8,
    header: {
      background: { x: 0, y: 0.1, w: 4, h: 0.21 },
      content: { x: 2, y: 0.2 }
    },
    sender: { x: 0.2, y: 1.2, step: 0.14 },
    orderInfo: { x: 1.1, y: 0.5, step: 0.14, distance: 0.05 },
    receipent: { title: { x: 1.9, y: 1.2 }, x: 2.2, y: 1.2, step: 0.14 },
    table: {
      header: { x: 0.1, y: 2.1, x2: 2.5, step: 0.5 },
      headerDivider: { x1: 0, y1: 2.2, x2: 4, y2: 2.2 },
      items: { x: 0.1, y: 2.4, x2: 2.5, x_step: 0.5, y_step: 0.2 }
    },
    foorterDivider: { x1: 0, x2: 4, y_step: 0.2 },
    subTotal: { x1: 2.5, x2: 3.5, y_step: 0.2 },
    sample: { x: 30, y: 10, angle: 30, font_size: 80 }
  }
};

export const CARRIER_REGIONS = {
  US_DOMESTIC: 'US_DOMESTIC',
  US_INTERNATIONAL: 'US_INTERNATIONAL',
  CN_IMPORT: 'CN_IMPORT'
};

export const CARRIER_REGIONS_TEXTS = {
  [CARRIER_REGIONS.US_DOMESTIC]: 'US Domestic',
  [CARRIER_REGIONS.US_INTERNATIONAL]: 'US International',
  [CARRIER_REGIONS.CN_IMPORT]: 'China Import'
};

export const CARRIER_REGIONS_KEYS = {
  [CARRIER_REGIONS.US_DOMESTIC]: 'usDomestic',
  [CARRIER_REGIONS.US_INTERNATIONAL]: 'usInternational',
  [CARRIER_REGIONS.CN_IMPORT]: 'cnImport'
};

export enum BillTypes {
  LABEL_PAYMENT = 'Label payment',
  LABEL_REFUND = 'Label refund',
  ADD_FUND = 'Add Fund'
}

export enum TransactionStatus {
  PAID = 'Paid',
  CREDITED = 'Credited',
  PENDING = 'Pending'
}

export const TRANSACTION_STATUS_COLORS: Record<string, string> = {
  [TransactionStatus.PAID]: '#2b7d2f',
  [TransactionStatus.CREDITED]: '#5eb761'
};

export const LABEL_STATUS = {
  SUCCESSFUL: 'Successful',
  REFUND_REQUESTED: 'Refund Requested',
  REFUND_PENDING: 'Refund Pending',
  REFUNDED: 'Refunded',
  ERROR: 'Error'
};

export const SERVER_ROUTES = {
  CARRIER: '/carriers',
  CLIENT_ACCOUNT: '/clientAccounts',
  USERS: '/users',
  CLIENTS: '/clients',
  BILLINGS: '/clientBillings',
  CLIENT_SHIPMENTS: '/clientShipment',
  PRINT_FORMAT: '/printFormat',
  PACKAGE: '/packageUnit',
  ADDRESSES: '/clientAddress',
  ORDERS: '/orders',
  ORDER_ITEMS: '/items',
  SHIPMENTS: '/shipments',
  MANIFEST: '/manifest',
  PRELOAD: '/preload',
  CSV: '/csv',
  STATIC: '/static'
};

export const DEFAULT_SERVER_HOST =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_URL
    : 'http://localhost:8000';

export const CSV_SAMPLE_FILE = 'parcelselite_sample_csv.csv';

export const CSV_TITLE_OPTIONS = [
  { name: 'Recipient Name', value: 'recipientName', required: true },
  { name: 'Company', value: 'company', required: false },
  { name: 'Email', value: 'email', required: false },
  { name: 'Phone', value: 'phone', required: false },
  { name: 'Street Line 1', value: 'street1', required: true },
  { name: 'Street Line 2', value: 'street2', required: false },
  { name: 'City', value: 'city', required: true },
  { name: 'State/Province', value: 'state', required: true },
  { name: 'Zip/Postal Code', value: 'zip', required: true },
  { name: 'Country', value: 'country', required: true },
  { name: 'Account Number', value: 'accountId', required: false },
  { name: 'Service', value: 'service', required: false },
  { name: 'Facility', value: 'facility', required: false },
  { name: 'Package Type', value: 'packageType', required: false },
  { name: 'Length', value: 'length', required: false },
  { name: 'Width', value: 'width', required: false },
  { name: 'Height', value: 'height', required: false },
  { name: 'Dimention Unit', value: 'dimentionUnit', required: false },
  { name: 'Weight', value: 'weight', required: false },
  { name: 'Weight Unit', value: 'weightUnit', required: false },
  { name: 'Ignore', value: 'ignore', required: false }
];

export const HTTP_ERROR_CODE_MESSAGE: { [key: number]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
};

export const REST_ERROR_CODE: Record<string, string> = {
  EMAIL_IN_USE: 'Email already in use',
  PASSWORD_MISMATCH: 'Password mismatch',
  INVALID_TOKEN: 'Failed to reset the password',
  EMAIL_NOT_FOUND: 'Email is not found'
};

// Custom Constents
export const TYPE_OF_CONTENT: Record<string, string> = {
  DOCUMENTS: 'Documents',
  GIFT: 'Gift',
  SAMPLE: 'Sample',
  MERCHANDISE: 'Merchandise',
  RETURN: 'Return merchandise',
  DONATION: 'Humanitarian donation',
  OTHER: 'Other'
};

export const INCOTERM: Record<string, Record<string, string>> = {
  DDU: {
    name: 'DDU(bill recipient)',
    value: 'DDU'
  },
  DDP: {
    name: 'DDP(bill sender)',
    value: 'DDP'
  }
};

export const NON_DELIVERY_HANDLING: Record<string, string> = {
  RETURN: 'Return',
  ABANDON: 'Abandon'
};

export const TAX_ID_TYPE: Record<string, string> = {
  VAT: 'VAT',
  EIN: 'EIN'
};

export const EEL_PFC: Record<string, string> = {
  N37A: 'NOEEI 30 37(a)',
  N37F: 'NOEEI 30 37(f)',
  N37H: 'NOEEI 30 37(h)',
  N36: 'NOEEI 30 36',
  AES: 'AES/ITN'
};

export const B13A_OPTION: Record<string, string> = {
  FILED_ELECTRONICALLY: 'Filed electronically',
  SUMMARY_REPORTING: 'Summary reporting',
  NOT_REQUIRED: 'Not Required'
};

export const DHL_ECOMMERCE_SERVICES = [
  { key: 'FLAT', name: 'DHL Smartmail Flats' },
  { key: 'EXP', name: 'DHL Parcel Expedited' },
  { key: 'MAX', name: 'DHL Parcel Expedited Max' },
  { key: 'GND', name: 'DHL Parcel Ground' }
];

export const DHL_ECOMMERCE_INTL_SERVICES = [
  { key: 'PLT', name: 'DHL Parcel International Direct' },
  { key: 'PLY', name: 'DHL Parcel International Standard' },
  { key: 'PKY', name: 'DHL Packet International' }
];

export const UPS_SERVICES = [
  { key: '2nd Day Air', id: '02', name: 'UPS 2nd Day Air' },
  { key: '2nd Day Air A.M.', id: '59', name: 'UPS 2nd Day Air A.M.' },
  { key: '3 Day Select', id: '12', name: 'UPS 3 Day Select' },
  { key: 'Ground', id: '03', name: 'UPS Ground' },
  { key: 'Next Day Air', id: '01', name: 'UPS Next Day Air' },
  { key: 'Next Day Air Early', id: '14', name: 'UPS Next Day Air Early' },
  { key: 'Next Day Air Saver', id: '13', name: 'UPS Next Day Air Saver' },
  { key: 'Surepost Light', id: '92', name: 'UPS Surepost Light' },
  { key: 'Surepost', id: '93', name: 'UPS Surepost' }
];

export const UPS_INTL_SERVICES = [
  { key: 'Express', id: '07', name: 'UPS Worldwide Express' },
  { key: 'Expedited', id: '08', name: 'UPS Worldwide Expedited' },
  { key: 'Saver', id: '65', name: 'UPS Worldwide Saver' }
];

export const USPS_SERVICES = [
  { key: 'PMExpress', id: '3', name: 'Priority Mail Express' },
  { key: 'PM', id: '1', name: 'Priority Mail' },
  { key: 'FCM', id: '61', name: 'First Class Mail' }
];

export const USPS_INTL_SERVICES = [
  {
    key: 'PMExpress International',
    id: '1',
    name: 'Priority Mail Express International'
  },
  { key: 'PM International', id: '2', name: 'Priority Mail International' }
];

export const FEDEX_SERVICES = [
  { key: 'FEDEX_GROUND', name: 'FedEx Ground' },
  { key: 'GROUND_HOME_DELIVERY', name: 'FedEx Gound Home Delivery' },
  { key: 'SMART_POST', name: 'FedEx Ground Economy' }
];

export const FEDEX_INTL_SERVICES = [
  { key: 'INTERNATIONAL_ECONOMY', name: 'FedEx International Economy' },
  { key: 'INTERNATIONAL_PRIORITY', name: 'FedEx International PRIORITY' }
];
