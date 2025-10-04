import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import {
  RateCheckState,
  RateInfo,
  RootState,
  UserShippingRateRequest
} from '../custom_types/redux-types';
import { Currency, SERVER_ROUTES } from '../shared/utils/constants';
import errorHandler from '../shared/components/errorHandler';
import axios from '../shared/utils/axios.base';

const initialState: RateCheckState = {
  loading: false,
  rates: { rate: 0, currency: Currency.USD, fee: 0, baseRate: 0 }
};

export const rateSlice = createSlice({
  name: 'rate',
  initialState,
  reducers: {
    setRates: (state, action: PayloadAction<RateInfo>) => {
      state.rates = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { setRates, setLoading } = rateSlice.actions;

export const checkRateHanlder = (request: UserShippingRateRequest) => async (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    dispatch(setLoading(true));
    try {
      const response = await axios.post(
        `${SERVER_ROUTES.CLIENT_SHIPMENTS}/rate`,
        request,
        {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        }
      );
      dispatch(setRates(response.data));
    } catch (error) {
      errorHandler(error, dispatch);
    } finally {
      dispatch(setLoading(false));
    }
  }
};

export const selectRates = (state: RootState): RateInfo => state.rate.rates;
export const selectLoading = (state: RootState): boolean => state.rate.loading;

export default rateSlice.reducer;
