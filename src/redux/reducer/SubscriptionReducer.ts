import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SubscriptionState {
  status: string;
  isLoading: boolean;
  error?: string;
  purchaseSubscriptionRes?: any;
  myCurrentSubscriptionRes?: any;
  subscriptionsRes?: any;
  sectionDetailsRes?: any;
  cancelSubscriptionRes?: any;
  isSkipPremission?: boolean;
}

const initialState: SubscriptionState = {
  status: '',
  isLoading: false,
  purchaseSubscriptionRes: {},
  myCurrentSubscriptionRes: {},
  subscriptionsRes: [],
  sectionDetailsRes: {},
  cancelSubscriptionRes: {},
  isSkipPremission: true,
};

const SubscriptionSlice = createSlice({
  name: 'Subscription',
  initialState,
  reducers: {
    purchaseSubscriptionRequest(state, action: PayloadAction<any>) {
      state.isLoading = true;
      state.status = action.type;
    },
    purchaseSubscriptionSuccess(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.purchaseSubscriptionRes = action.payload;
      state.status = action.type;
    },
    purchaseSubscriptionFailure(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload?.error || 'purchase subscription failed';
      state.status = action.type;
    },

    myCurrentSubscriptionRequest(state, action: PayloadAction<any>) {
      state.isLoading = true;
      state.status = action.type;
    },
    myCurrentSubscriptionSuccess(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.myCurrentSubscriptionRes = action.payload;
      state.status = action.type;
    },
    myCurrentSubscriptionFailure(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload?.error || 'my current subscription failed';
      state.status = action.type;
    },

    subscriptionsRequest(state, action: PayloadAction<any>) {
      state.isLoading = true;
      state.status = action.type;
    },
    subscriptionsSuccess(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.subscriptionsRes = action.payload;
      state.status = action.type;
    },
    subscriptionsFailure(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload?.error || 'subscriptions failed';
      state.status = action.type;
    },

    getSectionDetailsRequest(state, action: PayloadAction<any>) {
      state.isLoading = true;
      state.status = action.type;
    },
    getSectionDetailsSuccess(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.sectionDetailsRes = action.payload;
      state.status = action.type;
    },
    getSectionDetailsFailure(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload?.error || 'get section details failed';
      state.status = action.type;
    },

    cancelSubscriptionRequest(state, action: PayloadAction<any>) {
      state.isLoading = true;
      state.status = action.type;
    },
    cancelSubscriptionSuccess(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.cancelSubscriptionRes = action.payload;
      state.status = action.type;
    },
    cancelSubscriptionFailure(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload?.error || 'cancel subscription failed';
      state.status = action.type;
    },
    isSkipPremission(state, action: PayloadAction<boolean>) {
      state.isSkipPremission = action.payload;
    },
  },
});

export const {
  purchaseSubscriptionRequest,
  purchaseSubscriptionSuccess,
  purchaseSubscriptionFailure,
  myCurrentSubscriptionRequest,
  myCurrentSubscriptionSuccess,
  myCurrentSubscriptionFailure,
  subscriptionsRequest,
  subscriptionsSuccess,
  subscriptionsFailure,
  getSectionDetailsRequest,
  getSectionDetailsSuccess,
  getSectionDetailsFailure,
  cancelSubscriptionRequest,
  cancelSubscriptionSuccess,
  cancelSubscriptionFailure,
  isSkipPremission,
} = SubscriptionSlice.actions;

export default SubscriptionSlice.reducer;
