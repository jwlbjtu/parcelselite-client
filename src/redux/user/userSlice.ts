import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import axios from '../../shared/utils/axios.base';
import {
  UpdateUserResponse,
  User,
  UserUpdateData
} from '../../custom_types/profile-page';
import {
  AppThunk,
  CurrentUserState,
  RootState
} from '../../custom_types/redux-types';
import { SERVER_ROUTES } from '../../shared/utils/constants';
import errorHandler from '../../shared/components/errorHandler';
import { setLabelSettings, setPackagesUnits } from '../settings/settingSlice';
import {
  fetchsClientAccountsHandler,
  setClientAccounts
} from '../settings/carriersSlice';
import convertUserResponse from '../../features/Users/user.helps';
import { setAddresses } from '../settings/addressSlice';
import {
  setOrderFilter,
  setOrdersData,
  updateOrder
} from '../orders/ordersSlice';
import { Order } from '../../custom_types/order-page';
import { checkOrderLabelErrors } from '../../shared/utils/order.helper';

const initialState: CurrentUserState = {
  currentUser: undefined,
  profilePageLoading: false,
  loginLoading: false,
  loginError: false,
  resetEmailSent: false,
  registerError: undefined,
  resetError: undefined,
  resetLoading: false,
  userTimeout: undefined
};

export const userSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | undefined>) => {
      state.currentUser = action.payload;
    },
    updateCurrentUser: (state, action: PayloadAction<UpdateUserResponse>) => {
      if (state.currentUser) {
        state.currentUser.firstName = action.payload.firstName;
        state.currentUser.lastName = action.payload.lastName;
        state.currentUser.companyName = action.payload.companyName;
        state.currentUser.countryCode = action.payload.countryCode;
        state.currentUser.phone = action.payload.phone;
      }
    },
    updateCurrentUserBalance: (state, action: PayloadAction<number>) => {
      if (state.currentUser) {
        state.currentUser.balance = action.payload;
      }
    },
    setProfilePageLoading: (state, action: PayloadAction<boolean>) => {
      state.profilePageLoading = action.payload;
    },
    setLoginLoading: (state, action: PayloadAction<boolean>) => {
      state.loginLoading = action.payload;
    },
    setLoginError: (state, action: PayloadAction<boolean>) => {
      state.loginError = action.payload;
    },
    setResetEmailSent: (state, action: PayloadAction<boolean>) => {
      state.resetEmailSent = action.payload;
    },
    setRegisterError: (state, action: PayloadAction<string | undefined>) => {
      state.registerError = action.payload;
    },
    setResetError: (state, action: PayloadAction<string | undefined>) => {
      state.resetError = action.payload;
    },
    setResetLoading: (state, action: PayloadAction<boolean>) => {
      state.resetLoading = action.payload;
    },
    setUserTimeout: (
      state,
      action: PayloadAction<NodeJS.Timeout | undefined>
    ) => {
      state.userTimeout = action.payload;
    }
  }
});

export const {
  setCurrentUser,
  updateCurrentUser,
  updateCurrentUserBalance,
  setProfilePageLoading,
  setLoginLoading,
  setLoginError,
  setResetEmailSent,
  setRegisterError,
  setResetError,
  setResetLoading,
  setUserTimeout
} = userSlice.actions;

export const loginUserHandler = (info: {
  email: string;
  password: string;
}): AppThunk => (dispatch: Dispatch) => {
  dispatch(setLoginLoading(true));
  axios
    .post(`${SERVER_ROUTES.CLIENTS}/client_login`, info)
    .then((response) => {
      const userData = response.data;
      const {
        user,
        labelpageData,
        packagesUnitSettings,
        carrierSettings,
        addresses
      } = convertUserResponse(userData);
      dispatch(setCurrentUser(user));
      // dispatch(setLabelSettings(labelpageData));
      // dispatch(setPackagesUnits(packagesUnitSettings));
      dispatch(setClientAccounts(carrierSettings));
      // dispatch(setAddresses(addresses));
      const remaintingTime = user.tokenExpire - Date.now();
      const logoutTimer = setTimeout(() => {
        dispatch(setCurrentUser(undefined));
        dispatch(setClientAccounts([]));
        // dispatch(setAddresses([]));
        dispatch(setOrdersData([]));
      }, remaintingTime);
      dispatch(setUserTimeout(logoutTimer));
      dispatch(fetchsClientAccountsHandler());
    })
    .catch((error) => {
      console.log(error);
      dispatch(setLoginError(true));
    })
    .finally(() => dispatch(setLoginLoading(false)));
};

export const resetUserPasswordEmail = (data: { email: string }): AppThunk => (
  dispatch: Dispatch
) => {
  dispatch(setLoginLoading(true));
  axios
    .post(`${SERVER_ROUTES.USERS}/reset_email`, data)
    .then(() => {
      dispatch(setResetEmailSent(true));
      dispatch(setResetError(undefined));
    })
    .catch((error) => {
      if (error.response && error.response.status === 400) {
        dispatch(setResetError(`${data.email} not found`));
      } else {
        dispatch(
          setResetError('Failed to send email, please try again later.')
        );
      }
    })
    .finally(() => {
      dispatch(setLoginLoading(false));
    });
};

export const logoutUserHandler = (): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    axios.get(`${SERVER_ROUTES.USERS}/logout`, {
      headers: {
        Authorization: `${user.token_type} ${user.token}`
      }
    });
  }

  dispatch(setCurrentUser(undefined));
  dispatch(setClientAccounts([]));
  dispatch(setAddresses([]));
  dispatch(setOrdersData([]));
  dispatch(setOrderFilter({ filter: undefined }));
  const timer = getState().currentUser.userTimeout;
  if (timer) clearTimeout(timer);
};

export const updateUserHandler = (data: UserUpdateData): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  dispatch(setProfilePageLoading(true));
  const user = getState().currentUser.currentUser;
  if (user) {
    axios
      .put(`${SERVER_ROUTES.CLIENTS}`, data, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const userData: UpdateUserResponse = response.data;
        dispatch(updateCurrentUser(userData));
      })
      .catch((error) => {
        // TODO: handle password invalid error
        errorHandler(error, dispatch);
      })
      .finally(() => dispatch(setProfilePageLoading(false)));
  } else {
    dispatch(setProfilePageLoading(false));
  }
};

export const refreshUserHandler = (): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    axios
      .get(`${SERVER_ROUTES.CLIENTS}/refresh`, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const data = response.data;
        const newUser: User = {
          ...user,
          balance: data.balance,
          deposit: data.deposit
        };
        dispatch(setCurrentUser(newUser));
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      });
  }
};

// export const purchaseOrderHandler = (
//   order: Order,
//   isTest: boolean
// ): AppThunk => (dispatch: Dispatch, getState: () => RootState) => {
//   const user = getState().currentUser.currentUser;
//   if (user && order.packageInfo) {
//     // Check Errors
//     const result = checkOrderLabelErrors(order);
//     if (result.length > 0) {
//       const newOrder: Order = {
//         ...order,
//         errors: result,
//         labelLoading: false
//       };
//       dispatch(updateOrder(newOrder));
//     } else {
//       dispatch(updateOrder({ ...order, labelLoading: true }));
//       axios
//         .post(
//           `${SERVER_ROUTES.CLIENT_SHIPMENTS}/label`,
//           { id: order.id, isTest },
//           {
//             headers: {
//               Authorization: `${user.token_type} ${user.token}`
//             }
//           }
//         )
//         .then((response) => {
//           const resData = response.data;
//           const newOrder: Order = {
//             ...resData.order,
//             errors: resData.errors || [],
//             labelLoading: false
//           };
//           dispatch(updateCurrentUserBalance(resData.balance));
//           dispatch(updateOrder(newOrder));
//         })
//         .catch((error) => {
//           const newOrder: Order = {
//             ...order,
//             errors: [error.response.data.message],
//             labelLoading: false
//           };
//           dispatch(updateOrder(newOrder));
//           errorHandler(error, dispatch);
//         });
//     }
//   }
// };

export const selectCurUser = (state: RootState): User | undefined =>
  state.currentUser.currentUser;
export const selectProfilePageLoading = (state: RootState): boolean =>
  state.currentUser.profilePageLoading;
export const selectLoginLoading = (state: RootState): boolean =>
  state.currentUser.loginLoading;
export const selectLoginError = (state: RootState): boolean =>
  state.currentUser.loginError;
export const selectResetEmailSent = (state: RootState): boolean =>
  state.currentUser.resetEmailSent;
export const selectRegisterError = (state: RootState): string | undefined =>
  state.currentUser.registerError;
export const selectResetError = (state: RootState): string | undefined =>
  state.currentUser.resetError;
export const selectResetLoading = (state: RootState): boolean =>
  state.currentUser.resetLoading;

export default userSlice.reducer;
