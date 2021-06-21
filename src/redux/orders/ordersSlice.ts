import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import { UpdateData } from '../../custom_types/common';
import {
  CreateOrderData,
  ItemUpdateData,
  Order
} from '../../custom_types/order-page';
import {
  AppThunk,
  OrdersState,
  RootState
} from '../../custom_types/redux-types';
import { SERVER_ROUTES } from '../../shared/utils/constants';
import axios from '../../shared/utils/axios.base';
import errorHandler from '../../shared/components/errorHandler';
import { findCheapestRate } from '../../shared/utils/rates.helper';
import checkOrderRateErrors from '../../shared/utils/order.helper';

const initialState: OrdersState = {
  orders: [],
  filters: {},
  loading: false,
  redirectOrderId: undefined,
  showItemsModal: false,
  deletingItem: false,
  savingPackInfo: false,
  showOrderAddressModal: false,
  showSelectAddressModal: false,
  showBuyModal: false,
  purchasing: false,
  purchasingOrderId: undefined,
  showPurchasedModal: false,
  redirectOrders: false,
  showCsvModal: false,
  csvData: undefined,
  showCustomModal: false,
  orderFilter: {}
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrdersData: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    createOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const oldOrder = state.orders.find(
        (item) => item.id === action.payload.id
      );
      if (oldOrder) {
        Object.keys(action.payload).forEach((key) => {
          oldOrder[key] = action.payload[key];
        });
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setRedirectOrderId: (state, action: PayloadAction<string | undefined>) => {
      state.redirectOrderId = action.payload;
    },
    setShowItemsModal: (state, action: PayloadAction<boolean>) => {
      state.showItemsModal = action.payload;
    },
    setDeletingItem: (state, action: PayloadAction<boolean>) => {
      state.deletingItem = action.payload;
    },
    setSavingPackInfo: (state, action: PayloadAction<boolean>) => {
      state.savingPackInfo = action.payload;
    },
    setShowOrderAddressModal: (state, action: PayloadAction<boolean>) => {
      state.showOrderAddressModal = action.payload;
    },
    setShowSelectAddressModal: (state, action: PayloadAction<boolean>) => {
      state.showSelectAddressModal = action.payload;
    },
    setShowBuyModal: (state, action: PayloadAction<boolean>) => {
      state.showBuyModal = action.payload;
    },
    setPurchasing: (state, action: PayloadAction<boolean>) => {
      state.purchasing = action.payload;
    },
    setPurchasingOrderId: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.purchasingOrderId = action.payload;
    },
    setShowPurchasedModal: (state, action: PayloadAction<boolean>) => {
      state.showPurchasedModal = action.payload;
    },
    setRedirectOrders: (state, action: PayloadAction<boolean>) => {
      state.redirectOrders = action.payload;
    },
    setShowCsvModal: (state, action: PayloadAction<boolean>) => {
      state.showCsvModal = action.payload;
    },
    setCsvData: (
      state,
      action: PayloadAction<{ name: string; list: string[][] } | undefined>
    ) => {
      state.csvData = action.payload;
    },
    setShowCustomModal: (state, action: PayloadAction<boolean>) => {
      state.showCustomModal = action.payload;
    },
    setOrderFilter: (
      state,
      action: PayloadAction<Record<string, string | undefined>>
    ) => {
      state.orderFilter = action.payload;
    }
  }
});

export const {
  setOrdersData,
  createOrder,
  updateOrder,
  setLoading,
  setRedirectOrderId,
  setShowItemsModal,
  setDeletingItem,
  setSavingPackInfo,
  setShowOrderAddressModal,
  setShowSelectAddressModal,
  setShowBuyModal,
  setPurchasing,
  setPurchasingOrderId,
  setShowPurchasedModal,
  setRedirectOrders,
  setShowCsvModal,
  setCsvData,
  setShowCustomModal,
  setOrderFilter
} = ordersSlice.actions;

export const fetchOrdersHandler = (): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    dispatch(setLoading(true));
    axios
      .get(SERVER_ROUTES.ORDERS, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        },
        params: getState().orders.orderFilter
      })
      .then((response) => {
        const orders = response.data;
        dispatch(setOrdersData(orders));
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      })
      .finally(() => dispatch(setLoading(false)));
  }
};

export const createOrderHandler = (data: CreateOrderData): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    dispatch(setLoading(true));
    axios
      .post(SERVER_ROUTES.ORDERS, data, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const order = response.data;
        dispatch(createOrder(order));
        dispatch(setRedirectOrderId(order.id));
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      })
      .finally(() => dispatch(setLoading(false)));
  }
};

export const fetchRatesForOrderHandler = (id: string): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const user = getState().currentUser.currentUser;
  const curOrder = getState().orders.orders.find((ele) => ele.id === id);
  if (user && curOrder && checkOrderRateErrors(curOrder, false).length === 0) {
    dispatch(updateOrder({ ...curOrder, rateLoading: true }));
    axios
      .get(`${SERVER_ROUTES.ORDERS}/rates/${id}`, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const ratesData = response.data;
        const newOrder: Order = {
          ...curOrder,
          rates: ratesData.rates,
          errors: ratesData.errors,
          selectedRate: findCheapestRate(ratesData.rates),
          rateLoading: false
        };
        dispatch(updateOrder(newOrder));
      })
      .catch((error) => {
        const newOrder: Order = {
          ...curOrder,
          selectedRate: undefined,
          rates: [],
          errors: [error.response.data.message],
          rateLoading: false
        };
        dispatch(updateOrder(newOrder));
        errorHandler(error, dispatch);
      });
  }
};

export const updateOrderItemHandler = (data: ItemUpdateData): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    dispatch(setLoading(true));
    if (data.id) {
      // update Item
      axios
        .put(SERVER_ROUTES.ORDER_ITEMS, data, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then((response) => {
          const order = response.data;
          dispatch(updateOrder(order));
        })
        .catch((error) => {
          errorHandler(error, dispatch);
        })
        .finally(() => {
          dispatch(setLoading(false));
          dispatch(setShowItemsModal(false));
        });
    } else {
      // create new Item
      axios
        .post(SERVER_ROUTES.ORDER_ITEMS, data, {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        })
        .then((response) => {
          const order = response.data;
          dispatch(updateOrder(order));
        })
        .catch((error) => {
          errorHandler(error, dispatch);
        })
        .finally(() => {
          dispatch(setLoading(false));
          dispatch(setShowItemsModal(false));
        });
    }
  }
};

export const deleteOrderItemHandler = (
  id: string | undefined,
  isCustom: boolean
): AppThunk => (dispatch: Dispatch, getState: () => RootState) => {
  const user = getState().currentUser.currentUser;
  if (id && user) {
    dispatch(setDeletingItem(true));
    axios
      .delete(`${SERVER_ROUTES.ORDER_ITEMS}/${id}/${isCustom}`, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const order = response.data;
        dispatch(updateOrder(order));
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      })
      .finally(() => {
        dispatch(setDeletingItem(false));
        dispatch(setShowItemsModal(false));
      });
  }
};

export const updateOrderHanlder = (data: UpdateData): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    dispatch(setLoading(true));
    axios
      .put(SERVER_ROUTES.ORDERS, data, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const order = response.data;
        dispatch(updateOrder(order));
        if (order.packageInfo && !data.shipmentOptions) {
          dispatch(fetchRatesForOrderHandler(order.id));
        }
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      })
      .finally(() => {
        dispatch(setLoading(false));
        dispatch(setShowOrderAddressModal(false));
        dispatch(setShowSelectAddressModal(false));
        dispatch(setShowCustomModal(false));
      });
  }
};

export const saveOrderPackageInfo = (data: UpdateData): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    dispatch(setSavingPackInfo(true));
    axios
      .put(SERVER_ROUTES.ORDERS, data, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const order = response.data;
        dispatch(updateOrder(order));
        dispatch(setSavingPackInfo(false));
        dispatch(fetchRatesForOrderHandler(order.id));
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      })
      .finally(() => {
        dispatch(setSavingPackInfo(false));
      });
  }
};

export const selectOrders = (state: RootState): Order[] => state.orders.orders;
export const selectLoading = (state: RootState): boolean =>
  state.orders.loading;
export const selectRedirectOrderId = (state: RootState): string | undefined =>
  state.orders.redirectOrderId;
export const selectShowItemsModal = (state: RootState): boolean =>
  state.orders.showItemsModal;
export const selectDeletingItem = (state: RootState): boolean =>
  state.orders.deletingItem;
export const selectSavingPackInfo = (state: RootState): boolean =>
  state.orders.savingPackInfo;
export const selectShowOrderAddressModal = (state: RootState): boolean =>
  state.orders.showOrderAddressModal;
export const selectShowSelectAddressModal = (state: RootState): boolean =>
  state.orders.showSelectAddressModal;
export const selectShowBuyModal = (state: RootState): boolean =>
  state.orders.showBuyModal;
export const selectShowPurchasedModal = (state: RootState): boolean =>
  state.orders.showPurchasedModal;
export const selectPurchasing = (state: RootState): boolean =>
  state.orders.purchasing;
export const selectPurchasingOrderId = (state: RootState): string | undefined =>
  state.orders.purchasingOrderId;
export const selectShowCsvModal = (state: RootState): boolean =>
  state.orders.showCsvModal;
export const selectCsvData = (
  state: RootState
): { name: string; list: string[][] } | undefined => state.orders.csvData;
export const selectShowCustomModal = (state: RootState): boolean =>
  state.orders.showCustomModal;
export const selectOrderFilter = (
  state: RootState
): Record<string, string | undefined> => state.orders.orderFilter;

export default ordersSlice.reducer;
