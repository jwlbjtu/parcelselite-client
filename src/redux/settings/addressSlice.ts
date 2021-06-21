import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { Address, AddressCreateData } from '../../custom_types/address-page';
import {
  AddressesState,
  AppThunk,
  RootState
} from '../../custom_types/redux-types';
import axios from '../../shared/utils/axios.base';
import errorHandler from '../../shared/components/errorHandler';
import { SERVER_ROUTES } from '../../shared/utils/constants';

const initialState: AddressesState = {
  default: undefined,
  addresses: [],
  showModal: false,
  deleting: false,
  loading: false,
  pageLoading: false
};

export const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    setAddresses: (state, action: PayloadAction<Address[]>) => {
      state.default = action.payload.find(
        (item) => item.isDefaultSender === true
      );
      state.addresses = action.payload;
    },
    createAddress: (state, action: PayloadAction<Address>) => {
      const newAddress = action.payload;
      if (newAddress.isDefaultSender) {
        const oldDefault = state.addresses.find(
          (item) => item.isDefaultSender === true
        );
        if (oldDefault) oldDefault.isDefaultSender = false;
        state.default = newAddress;
      }
      state.addresses.push(newAddress);
    },
    updateAddress: (state, action: PayloadAction<Address>) => {
      const updatedAddress = action.payload;
      if (updatedAddress.isDefaultSender) {
        const oldDefault = state.addresses.find(
          (item) => item.isDefaultSender === true
        );
        if (oldDefault) oldDefault.isDefaultSender = false;
        state.default = updatedAddress;
      }
      const oldAddressIndex = state.addresses.findIndex(
        (item) => item.id === updatedAddress.id
      );
      if (oldAddressIndex >= 0) {
        state.addresses.splice(oldAddressIndex, 1, updatedAddress);
      }
    },
    deleteAddress: (state, action: PayloadAction<string>) => {
      const index = state.addresses.findIndex(
        (item) => item.id === action.payload
      );
      if (index >= 0) {
        state.addresses.splice(index, 1);
      }
    },
    setShowAddressModal: (state, action: PayloadAction<boolean>) => {
      state.showModal = action.payload;
    },
    setDeleting: (state, action: PayloadAction<boolean>) => {
      state.deleting = action.payload;
    },
    setAddressLoding: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAddressPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload;
    }
  }
});

export const {
  setAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setShowAddressModal,
  setDeleting,
  setAddressLoding,
  setAddressPageLoading
} = addressesSlice.actions;

export const fetchAddressesHandler = (): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  dispatch(setAddressPageLoading(true));
  const user = getState().currentUser.currentUser;
  if (user) {
    axios
      .get(SERVER_ROUTES.ADDRESSES, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const addresses = response.data;
        dispatch(setAddresses(addresses));
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      })
      .finally(() => dispatch(setAddressPageLoading(false)));
  } else {
    dispatch(setAddressPageLoading(false));
  }
};

export const createAddressHandler = (data: AddressCreateData): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  dispatch(setAddressLoding(true));
  const user = getState().currentUser.currentUser;
  if (user) {
    axios
      .post(SERVER_ROUTES.ADDRESSES, data, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const address = response.data;
        dispatch(createAddress(address));
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      })
      .finally(() => {
        dispatch(setAddressLoding(false));
        dispatch(setShowAddressModal(false));
      });
  } else {
    dispatch(setAddressLoding(false));
    dispatch(setShowAddressModal(false));
  }
};

export const updateAddressHandler = (data: Address): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  dispatch(setAddressLoding(true));
  const user = getState().currentUser.currentUser;
  if (user) {
    axios
      .put(SERVER_ROUTES.ADDRESSES, data, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const address = response.data;
        dispatch(updateAddress(address));
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      })
      .finally(() => {
        dispatch(setAddressLoding(false));
        dispatch(setShowAddressModal(false));
      });
  } else {
    dispatch(setAddressLoding(false));
    dispatch(setShowAddressModal(false));
  }
};

export const deleteAddressHandler = (id: string): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  dispatch(setDeleting(true));
  const user = getState().currentUser.currentUser;
  if (user) {
    axios
      .delete(`${SERVER_ROUTES.ADDRESSES}/${id}`, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then(() => {
        dispatch(deleteAddress(id));
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      })
      .finally(() => {
        dispatch(setDeleting(false));
        dispatch(setShowAddressModal(false));
      });
  } else {
    dispatch(setDeleting(false));
    dispatch(setShowAddressModal(false));
  }
};

export const selectDefaultAddress = (state: RootState): Address | undefined =>
  state.addresses.default;
export const selectAddresses = (state: RootState): Address[] =>
  state.addresses.addresses;
export const selectShowAddressModal = (state: RootState): boolean =>
  state.addresses.showModal;
export const selectDeletingAddress = (state: RootState): boolean =>
  state.addresses.deleting;
export const selectAddressLoading = (state: RootState): boolean =>
  state.addresses.loading;
export const selectPageLoading = (state: RootState): boolean =>
  state.addresses.pageLoading;

export default addressesSlice.reducer;
