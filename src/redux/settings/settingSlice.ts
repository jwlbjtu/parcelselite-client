import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import {
  SettingsState,
  RootState,
  AppThunk,
  LabelsPageData,
  PackagesUnitSettings
} from '../../custom_types/redux-types';
import {
  DistanceUnit,
  FILE_FORMATS,
  FILE_TYPES,
  SERVER_ROUTES,
  WeightUnit
} from '../../shared/utils/constants';
import axios from '../../shared/utils/axios.base';
import errorHandler from '../../shared/components/errorHandler';

const initialState: SettingsState = {
  labels: {
    id: '',
    labelSettings: { format: FILE_FORMATS.thermal, type: FILE_TYPES.pdf },
    packSlipSettings: { format: FILE_FORMATS.standard, type: FILE_TYPES.pdf }
  },
  packages: {
    packagesUnits: {
      id: '',
      weightUnit: WeightUnit.LB,
      distanceUnit: DistanceUnit.IN
    }
  },
  loading: false
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<SettingsState>) => {
      state = action.payload;
    },
    setLabelSettings: (state, action: PayloadAction<LabelsPageData>) => {
      state.labels = action.payload;
    },
    setPackagesUnits: (state, action: PayloadAction<PackagesUnitSettings>) => {
      state.packages.packagesUnits = action.payload;
    },
    setSettingsLoding: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const {
  setSettings,
  setLabelSettings,
  setPackagesUnits,
  setSettingsLoding
} = settingsSlice.actions;

export const saveLabelSettings = (data: LabelsPageData): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  dispatch(setSettingsLoding(true));
  const user = getState().currentUser.currentUser;
  if (user) {
    axios
      .put(`${SERVER_ROUTES.PRINT_FORMAT}/update`, data, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const printFormatData = response.data;
        const newData: LabelsPageData = {
          id: printFormatData._id,
          labelSettings: printFormatData.labelFormat,
          packSlipSettings: printFormatData.packSlipFormat
        };
        dispatch(setLabelSettings(newData));
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      })
      .finally(() => dispatch(setSettingsLoding(false)));
  } else {
    dispatch(setSettingsLoding(false));
  }
};

export const savePackagesUnitsSettings = (
  data: PackagesUnitSettings
): AppThunk => (dispatch: Dispatch, getState: () => RootState) => {
  dispatch(setSettingsLoding(true));
  const user = getState().currentUser.currentUser;
  if (user) {
    axios
      .put(`${SERVER_ROUTES.PACKAGE}/update`, data, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const packageSettingsData = response.data;
        const newData: PackagesUnitSettings = {
          id: packageSettingsData._id,
          weightUnit: packageSettingsData.weightUnit,
          distanceUnit: packageSettingsData.distanceUnit
        };
        dispatch(setPackagesUnits(newData));
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      })
      .finally(() => dispatch(setSettingsLoding(false)));
  } else {
    dispatch(setSettingsLoding(false));
  }
};

export const selectLabels = (state: RootState): LabelsPageData =>
  state.settings.labels;
export const selectPackagesUnits = (state: RootState): PackagesUnitSettings =>
  state.settings.packages.packagesUnits;
export const selectSettingsLoading = (state: RootState): boolean =>
  state.settings.loading;

export default settingsSlice.reducer;
