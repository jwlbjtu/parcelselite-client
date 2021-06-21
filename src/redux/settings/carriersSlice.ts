import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import axios from '../../shared/utils/axios.base';
import { ClientAccount } from '../../custom_types/carrier-page';
import {
  AppThunk,
  CarriersState,
  RootState
} from '../../custom_types/redux-types';
import errorHandler from '../../shared/components/errorHandler';
import { SERVER_ROUTES } from '../../shared/utils/constants';

const initialState: CarriersState = {
  systemAccounts: [],
  loading: false,
  carrierModalLoading: false,
  showCarrierModal: false
};

export const carriersSlice = createSlice({
  name: 'carriers',
  initialState,
  reducers: {
    setClientAccounts: (state, action: PayloadAction<ClientAccount[]>) => {
      state.systemAccounts = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { setClientAccounts, setLoading } = carriersSlice.actions;

export const fetchsClientAccountsHandler = (): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    dispatch(setLoading(true));
    axios
      .get(SERVER_ROUTES.CLIENT_ACCOUNT, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const carriers = response.data;
        dispatch(setClientAccounts(carriers));
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }
};

export const selectClientAccounts = (state: RootState): ClientAccount[] =>
  state.carriers.systemAccounts;
export const selectCarriersLoading = (state: RootState): boolean =>
  state.carriers.loading;

export default carriersSlice.reducer;
