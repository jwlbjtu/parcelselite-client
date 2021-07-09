import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { Label, Order } from '../../custom_types/order-page';
import {
  AppThunk,
  Manifest,
  RootState,
  ShipmentState
} from '../../custom_types/redux-types';
import { TrackingInfo } from '../../custom_types/shipment-page';
import errorHandler from '../../shared/components/errorHandler';
import axios from '../../shared/utils/axios.base';
import { SERVER_ROUTES } from '../../shared/utils/constants';

const initialState: ShipmentState = {
  shipments: [],
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
    setShipments: (state, action: PayloadAction<Order[]>) => {
      state.shipments = action.payload;
    },
    updateShipment: (state, action: PayloadAction<Order>) => {
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
  setManifests,
  updateManifest,
  setManifestLoading,
  setShowTrackingModal,
  setTrackingInfo
} = shipmentSlice.actions;

export const fetchManifestShipmentHandler = (
  carrierAccount: string,
  date: string
): AppThunk => (dispatch: Dispatch, getState: () => RootState) => {
  const user = getState().currentUser.currentUser;
  if (user) {
    dispatch(setLoading(true));
    axios
      .get(
        `${SERVER_ROUTES.MANIFEST}/shipments?date=${date}&carrierAccount=${carrierAccount}`,
        {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        }
      )
      .then((response) => {
        const shipments = response.data;
        dispatch(setShipments(shipments));
      })
      .catch((error) => {
        dispatch(setShipments([]));
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
      .get(`${SERVER_ROUTES.MANIFEST}?date=${date}&carrierRef=${carrierRef}`, {
        headers: {
          Authorization: `${user.token_type} ${user.token}`
        }
      })
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
  carrierRef: string | undefined,
  carrierAccount: string | undefined,
  shippingDate: string,
  shipments: Order[]
): AppThunk => (dispatch: Dispatch, getState: () => RootState) => {
  const user = getState().currentUser.currentUser;
  if (user && carrierAccount && carrierRef) {
    dispatch(setLoading(true));
    const shipmentIds = shipments.map((ele) => ele.id);
    axios
      .post(
        `${SERVER_ROUTES.MANIFEST}`,
        { carrierAccount, shipmentIds },
        {
          headers: {
            Authorization: `${user.token_type} ${user.token}`
          }
        }
      )
      .then(() => {
        dispatch(setLoading(false));
        dispatch(fetchManifestShipmentHandler(carrierAccount, shippingDate));
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
        `${SERVER_ROUTES.MANIFEST}/refresh_manifest?manifestId=${manifestId}`,
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
      .get(`${SERVER_ROUTES.MANIFEST}/tracking?shipmentId=${shipmentId}`, {
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

export const selectShipments = (state: RootState): Order[] =>
  state.shipments.shipments;
export const selectShipmentLoading = (state: RootState): boolean =>
  state.shipments.loading;
export const selectManifests = (state: RootState): Manifest[] =>
  state.shipments.manifests;
export const selectManifestLoading = (state: RootState): boolean =>
  state.shipments.manifestLoading;
export const selectShowTrackingModal = (state: RootState): boolean =>
  state.shipments.showTrackingModal;
export const selectTrackingInfo = (state: RootState): TrackingInfo =>
  state.shipments.trackingInfo;

export default shipmentSlice.reducer;
