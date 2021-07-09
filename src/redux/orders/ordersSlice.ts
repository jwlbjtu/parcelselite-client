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
  purchasing: false,
  purchasingOrderId: undefined,
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
    setPurchasing: (state, action: PayloadAction<boolean>) => {
      state.purchasing = action.payload;
    },
    setPurchasingOrderId: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.purchasingOrderId = action.payload;
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
  setPurchasing,
  setPurchasingOrderId,
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
      .get(SERVER_ROUTES.CLIENT_SHIPMENTS, {
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
      .post(SERVER_ROUTES.CLIENT_SHIPMENTS, data, {
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
      .put(SERVER_ROUTES.CLIENT_SHIPMENTS, data, {
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
      .put(SERVER_ROUTES.CLIENT_SHIPMENTS, data, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const order = response.data;
        dispatch(updateOrder(order));
        dispatch(setSavingPackInfo(false));
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
