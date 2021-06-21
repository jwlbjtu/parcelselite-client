import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { selectClientAccounts } from '../../../redux/settings/carriersSlice';
import { CARRIERS, UI_ROUTES } from '../../../shared/utils/constants';
import CreateOrderPage from '../../Orders/pages/CreateOrderPage';
import CsvImportPage from '../../Orders/pages/CsvImportPage';
import CsvImportStepTwoPage from '../../Orders/pages/CsvImportStepTwoPage';
import OrderDetailPage from '../../Orders/pages/OrderDetailPage';
import OrdersPage from '../../Orders/pages/OrdersPage';
import AccountPage from '../../Settings/Account/pages/AccountPage';
import AddressPage from '../../Settings/Addresses/pages/AddressPage';
import CarrierPage from '../../Settings/Carriers/pages/CarrierPage';
import LabelPage from '../../Settings/Labels/pages/LabelPage';
import PackagePage from '../../Settings/Packages/pages/PackagePage';
import ManifestPage from '../../Shipments/pages/ManifestPage';
import ShipmentsPage from '../../Shipments/pages/ShipmentsPage';

const Routes = (): ReactElement => {
  const systemAccounts = useSelector(selectClientAccounts);
  return (
    <Switch>
      <Route
        path={`${UI_ROUTES.ORDERS}${UI_ROUTES.MANUAL}`}
        component={CreateOrderPage}
      />
      <Route
        path={`${UI_ROUTES.ORDERS}${UI_ROUTES.DETAIL}/:orderId`}
        component={OrderDetailPage}
      />
      <Route
        path={`${UI_ROUTES.ORDERS}${UI_ROUTES.CSV_IMPORT}${UI_ROUTES.STEP_TWO}`}
        component={CsvImportStepTwoPage}
      />
      <Route
        path={`${UI_ROUTES.ORDERS}${UI_ROUTES.CSV_IMPORT}`}
        component={CsvImportPage}
      />
      <Route path={UI_ROUTES.ORDERS} component={OrdersPage} />
      {systemAccounts.findIndex((ele) => ele.carrier === CARRIERS.DHL_ECOM) >=
        0 && (
        <Route
          path={`${UI_ROUTES.SHIPMENTS}${UI_ROUTES.MANIFESTS}`}
          component={ManifestPage}
        />
      )}
      <Route path={UI_ROUTES.SHIPMENTS} component={ShipmentsPage} />
      <Route path={UI_ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={UI_ROUTES.CARRIERS} component={CarrierPage} exact />
      <Route path={UI_ROUTES.ADDRESSES} component={AddressPage} exact />
      <Route path={UI_ROUTES.LABELS} component={LabelPage} exact />
      <Route path={UI_ROUTES.PACKAGES} component={PackagePage} exact />
      <Redirect from="/" to={UI_ROUTES.ORDERS} />
    </Switch>
  );
};

export default Routes;
