import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MainState {
  status: string;
  isMainLoading: boolean;
  pagiLoading: boolean;
  error?: string;
  peopleListRes?: any;
  getProfileRes?: any;
  getDashboardRes?: any;
  schedulesListRes?: any;
  schedulesCalendarRes?: any;
  schedulesByDateRes?: any;
  teamsListRes?: any;
  teamDetailsRes?: any;
  teamMembersRes?: any;
  teamMembersByIdRes?: any;
  membersOverallRes?: any;
  teamLogsRes?: any;
  toolsAssignedRes?: any;
  toolsLogsRes?: any;
  takeToolRes?: any;
  dropToolRes?: any;
  getNotificationsRes?: any;
  readNotificationRes?: any;
  readAllNotificationsRes?: any;
  updateProfileRes?: any;
  deleteAccountRes?: any;
  getInventoryCategoriesRes?: any;
  getInventoryDetailsRes?: any;
  addInventoryToolRes?: any;
  getInventoryListRes?: any;
  getToolsListRes?: any;
  inventoryLocationsRes?: any;
  getCmsRes?: any;
  respondToolStatusCheckRes?: any;
  myProfileRes?: any;
  artistDetailsRes?: any;
  toggleSongLikeRes?: any;
  toggleArtistFollowRes?: any;
  raiseHelpRes?: any;
  supportArticlesRes?: any;
}

const initialState: MainState = {
  status: '',
  isMainLoading: false,
  pagiLoading: false,
  peopleListRes: [],
  getProfileRes: {},
  myProfileRes: {},
  getDashboardRes: {},
  artistDetailsRes: {},
  toggleSongLikeRes: {},
  toggleArtistFollowRes: {},
  raiseHelpRes: {},
  supportArticlesRes: {},
};

const MainSlice = createSlice({
  name: 'Main',
  initialState,
  reducers: {
    //getProfile Setup
    peopleListRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    peopleListSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      if (action.payload?.page === 1) {
        state.peopleListRes = action.payload.data;
      } else {
        state.peopleListRes = [
          ...(state.peopleListRes || []),
          ...(action.payload.data || []),
        ];
      }
      state.status = action.type;
    },
    peopleListFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'userList failed';
      state.status = action.type;
    },

    myProfileRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    myProfileSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.myProfileRes = action.payload;
      state.status = action.type;
    },
    myProfileFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'myProfile failed';
      state.status = action.type;
    },

    updateProfileRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    updateProfileSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.updateProfileRes = action.payload;
      state.status = action.type;
    },
    updateProfileFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'updateProfile failed';
      state.status = action.type;
    },

    getDashboardRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getDashboardSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.getDashboardRes = action.payload;
      state.status = action.type;
    },
    getDashboardFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getDashboard failed';
      state.status = action.type;
    },

    getArtistDetailsRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getArtistDetailsSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.artistDetailsRes = action.payload;
      state.status = action.type;
    },
    getArtistDetailsFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getArtistDetails failed';
      state.status = action.type;
    },

    toggleSongLikeRequest(state, action: PayloadAction<any>) {
      // Do not set isMainLoading so it works smoothly in the background
      state.status = action.type;
    },
    toggleSongLikeSuccess(state, action: PayloadAction<any>) {
      state.toggleSongLikeRes = action.payload;
      state.status = action.type;
    },
    toggleSongLikeFailure(state, action: PayloadAction<any>) {
      state.error = action.payload?.error || 'toggleSongLike failed';
      state.status = action.type;
    },

    toggleArtistFollowRequest(state, action: PayloadAction<any>) {
      // Do not set isMainLoading so it works smoothly in the background
      state.status = action.type;
    },
    toggleArtistFollowSuccess(state, action: PayloadAction<any>) {
      state.toggleArtistFollowRes = action.payload;
      state.status = action.type;
    },
    toggleArtistFollowFailure(state, action: PayloadAction<any>) {
      state.error = action.payload?.error || 'toggleArtistFollow failed';
      state.status = action.type;
    },

    raiseHelpRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    raiseHelpSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.raiseHelpRes = action.payload;
      state.status = action.type;
    },
    raiseHelpFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'raiseHelp failed';
      state.status = action.type;
    },

    supportArticlesRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    supportArticlesSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.supportArticlesRes = action.payload;
      state.status = action.type;
    },
    supportArticlesFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'supportArticles failed';
      state.status = action.type;
    },

    getCmsRequest(state, action: PayloadAction<any>) {
      state.isMainLoading = true;
      state.status = action.type;
    },
    getCmsSuccess(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.getCmsRes = action.payload;
      state.status = action.type;
    },
    getCmsFailure(state, action: PayloadAction<any>) {
      state.isMainLoading = false;
      state.error = action.payload?.error || 'getCms failed';
      state.status = action.type;
    },
  },
});

export const {
  peopleListRequest,
  peopleListSuccess,
  peopleListFailure,

  myProfileRequest,
  myProfileSuccess,
  myProfileFailure,

  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,

  getDashboardRequest,
  getDashboardSuccess,
  getDashboardFailure,

  getArtistDetailsRequest,
  getArtistDetailsSuccess,
  getArtistDetailsFailure,

  toggleSongLikeRequest,
  toggleSongLikeSuccess,
  toggleSongLikeFailure,

  toggleArtistFollowRequest,
  toggleArtistFollowSuccess,
  toggleArtistFollowFailure,

  raiseHelpRequest,
  raiseHelpSuccess,
  raiseHelpFailure,

  supportArticlesRequest,
  supportArticlesSuccess,
  supportArticlesFailure,

  getCmsRequest,
  getCmsSuccess,
  getCmsFailure,
} = MainSlice.actions;

export default MainSlice.reducer;
