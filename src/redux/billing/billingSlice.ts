import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../custom_types/billing-page';
import {
  AppThunk,
  BillingState,
  RootState
} from '../../custom_types/redux-types';
import axios from '../../shared/utils/axios.base';
import { SERVER_ROUTES } from '../../shared/utils/constants';
import errorHandler from '../../shared/components/errorHandler';

const initialState: BillingState = {
  transactions: [],
  transactionTableLoading: false
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    setTransactionTableLoading: (state, action: PayloadAction<boolean>) => {
      state.transactionTableLoading = action.payload;
    }
  }
});

export const {
  setTransactions,
  setTransactionTableLoading
} = billingSlice.actions;

export const fetchTransactions = (): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    dispatch(setTransactionTableLoading(true));
    axios
      .get(SERVER_ROUTES.BILLINGS, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const transactions = response.data;
        console.log(transactions);
        dispatch(setTransactions(transactions));
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      })
      .finally(() => dispatch(setTransactionTableLoading(false)));
  }
};

export const selectTransactions = (state: RootState): Transaction[] =>
  state.billing.transactions;
export const selectTransactionTableLoading = (state: RootState): boolean =>
  state.billing.transactionTableLoading;

export default billingSlice.reducer;
