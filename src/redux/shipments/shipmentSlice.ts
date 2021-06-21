import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { Label } from '../../custom_types/order-page';
import {
  AppThunk,
  Manifest,
  RootState,
  ShipmentState
} from '../../custom_types/redux-types';
import { Shipment, TrackingInfo } from '../../custom_types/shipment-page';
import errorHandler from '../../shared/components/errorHandler';
import axios from '../../shared/utils/axios.base';
import { SERVER_ROUTES } from '../../shared/utils/constants';

const initialState: ShipmentState = {
  shipments: [],
  labels: [],
  manifests: [],
  loading: false,
  manifestLoading: false,
  showTrackingModal: false,
  trackingInfo: undefined
};

const shipmentSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    setShipments: (state, action: PayloadAction<Shipment[]>) => {
      state.shipments = action.payload;
    },
    updateShipment: (state, action: PayloadAction<Shipment>) => {
      const oldShipment = state.shipments.find(
        (item) => item.id === action.payload.id
      );
      if (oldShipment) {
        Object.keys(action.payload).forEach((key) => {
          oldShipment[key] = action.payload[key];
        });
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLabels: (state, action: PayloadAction<Label[]>) => {
      state.labels = action.payload;
    },
    setManifests: (state, action: PayloadAction<Manifest[]>) => {
      state.manifests = action.payload;
    },
    updateManifest: (state, action: PayloadAction<Manifest>) => {
      const oldManifest = state.manifests.find(
        (item) => item.id === action.payload.id
      );
      if (oldManifest) {
        Object.keys(action.payload).forEach((key) => {
          oldManifest[key] = action.payload[key];
        });
      }
    },
    setManifestLoading: (state, action: PayloadAction<boolean>) => {
      state.manifestLoading = action.payload;
    },
    setShowTrackingModal: (state, action: PayloadAction<boolean>) => {
      state.showTrackingModal = action.payload;
    },
    setTrackingInfo: (
      state,
      action: PayloadAction<TrackingInfo | undefined>
    ) => {
      state.trackingInfo = action.payload;
    }
  }
});

export const {
  setShipments,
  updateShipment,
  setLoading,
  setLabels,
  setManifests,
  updateManifest,
  setManifestLoading,
  setShowTrackingModal,
  setTrackingInfo
} = shipmentSlice.actions;

export const fetchShipmentsHandler = (): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    dispatch(setLoading(true));
    axios
      .get(SERVER_ROUTES.SHIPMENTS, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const shipments = response.data;
        dispatch(setShipments(shipments));
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      })
      .finally(() => dispatch(setLoading(false)));
  }
};

export const fetchLabelsHandler = (
  carrierRef: string,
  date: string
): AppThunk => (dispatch: Dispatch, getState: () => RootState) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    dispatch(setLoading(true));
    axios
      .get(
        `${SERVER_ROUTES.SHIPMENTS}/labels?date=${date}&carrierRef=${carrierRef}`,
        {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        }
      )
      .then((response) => {
        const labels = response.data;
        dispatch(setLabels(labels));
      })
      .catch((error) => {
        dispatch(setLabels([]));
        errorHandler(error, dispatch);
      })
      .finally(() => dispatch(setLoading(false)));
  }
};

export const fetchManifestsHandler = (
  carrierRef: string,
  date: string
): AppThunk => (dispatch: Dispatch, getState: () => RootState) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    dispatch(setManifestLoading(true));
    axios
      .get(
        `${SERVER_ROUTES.SHIPMENTS}/manifests?date=${date}&carrierRef=${carrierRef}`,
        {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        }
      )
      .then((response) => {
        const manifests = response.data;
        dispatch(setManifests(manifests));
      })
      .catch((error) => {
        dispatch(setManifests([]));
        errorHandler(error, dispatch);
      })
      .finally(() => dispatch(setManifestLoading(false)));
  }
};

export const createManifestsHandler = (
  carrier: string | undefined,
  carrierRef: string | undefined,
  shippingDate: string,
  labels: Label[]
): AppThunk => (dispatch: Dispatch, getState: () => RootState) => {
  const user = getState().currentUser.currentUser;
  if (user && carrierRef && carrier) {
    dispatch(setLoading(true));
    const labelIds = labels.map((ele) => ele.id);
    axios
      .post(
        `${SERVER_ROUTES.SHIPMENTS}/manifests`,
        { carrier, carrierRef, labelIds },
        {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        }
      )
      .then(() => {
        dispatch(setLoading(false));
        dispatch(fetchLabelsHandler(carrierRef, shippingDate));
        dispatch(fetchManifestsHandler(carrierRef, shippingDate));
      })
      .catch((error) => {
        errorHandler(error, dispatch);
      })
      .finally(() => dispatch(setLoading(false)));
  }
};

export const refreshManifestHandler = (manifestId: string): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    dispatch(setManifestLoading(true));
    axios
      .get(
        `${SERVER_ROUTES.SHIPMENTS}/refresh_manifest?manifestId=${manifestId}`,
        {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        }
      )
      .then((response) => {
        const manifest = response.data;
        dispatch(updateManifest(manifest));
      })
      .catch((error) => {
        dispatch(setManifests([]));
        errorHandler(error, dispatch);
      })
      .finally(() => dispatch(setManifestLoading(false)));
  }
};

export const fetchTrackingHandler = (shipmentId: string): AppThunk => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    dispatch(setLoading(true));
    axios
      .get(`${SERVER_ROUTES.SHIPMENTS}/tracking?shipmentId=${shipmentId}`, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
      .then((response) => {
        const { tracking, shipment } = response.data;
        dispatch(updateShipment(shipment));
        dispatch(setTrackingInfo(tracking));
        dispatch(setShowTrackingModal(true));
      })
      .catch((error) => {
        dispatch(setManifests([]));
        errorHandler(error, dispatch);
      })
      .finally(() => dispatch(setLoading(false)));
  }
};

export const selectShipments = (state: RootState): Shipment[] =>
  state.shipments.shipments;
export const selectShipmentLoading = (state: RootState): boolean =>
  state.shipments.loading;
export const selectLabels = (state: RootState): Label[] =>
  state.shipments.labels;
export const selectManifests = (state: RootState): Manifest[] =>
  state.shipments.manifests;
export const selectManifestLoading = (state: RootState): boolean =>
  state.shipments.manifestLoading;
export const selectShowTrackingModal = (state: RootState): boolean =>
  state.shipments.showTrackingModal;
export const selectTrackingInfo = (state: RootState): TrackingInfo =>
  state.shipments.trackingInfo;

export default shipmentSlice.reducer;
