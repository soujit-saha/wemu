import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SongState {
  status: string;
  isSongLoading: boolean;
  error?: string;
  increasePlayCountRes?: any;
  searchSongRes?: any;
  createOrUpdatePlaylistRes?: any;
  myPlaylistsRes?: any;
  addRemovePlaylistSongRes?: any;
  playlistDetailsRes?: any;
  deletePlaylistRes?: any;
  albumsRes?: any;
  artistsRes?: any;
  songsToAddRes?: any;
  playerQueueRes?: any;
  songsByAlbumRes?: any;
}

const initialState: SongState = {
  status: '',
  isSongLoading: false,
  increasePlayCountRes: {},
  searchSongRes: {},
  createOrUpdatePlaylistRes: {},
  myPlaylistsRes: {},
  addRemovePlaylistSongRes: {},
  playlistDetailsRes: {},
  deletePlaylistRes: {},
  albumsRes: {},
  artistsRes: {},
  songsToAddRes: {},
  playerQueueRes: {},
  songsByAlbumRes: {},
};

const SongSlice = createSlice({
  name: 'Song',
  initialState,
  reducers: {
    increasePlayCountRequest(state, action: PayloadAction<any>) {
      state.isSongLoading = true;
      state.status = action.type;
    },
    increasePlayCountSuccess(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.increasePlayCountRes = action.payload;
      state.status = action.type;
    },
    increasePlayCountFailure(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.error = action.payload?.error || 'increase play count failed';
      state.status = action.type;
    },

    // Search Song
    searchSongRequest(state, action: PayloadAction<any>) {
      state.isSongLoading = true;
      state.status = action.type;
    },
    searchSongSuccess(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.searchSongRes = action.payload;
      state.status = action.type;
    },
    searchSongFailure(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.error = action.payload?.error || 'Search failed';
      state.status = action.type;
    },

    // Playlist Create or Update
    createOrUpdatePlaylistRequest(state, action: PayloadAction<any>) {
      state.isSongLoading = true;
      state.status = action.type;
    },
    createOrUpdatePlaylistSuccess(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.createOrUpdatePlaylistRes = action.payload;
      state.status = action.type;
    },
    createOrUpdatePlaylistFailure(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.error =
        action.payload?.error || 'Create or update playlist failed';
      state.status = action.type;
    },

    // My Playlists
    getMyPlaylistsRequest(state, action: PayloadAction<any>) {
      state.isSongLoading = true;
      state.status = action.type;
    },
    getMyPlaylistsSuccess(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.myPlaylistsRes = action.payload;
      state.status = action.type;
    },
    getMyPlaylistsFailure(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.error = action.payload?.error || 'Get my playlists failed';
      state.status = action.type;
    },

    // Add or Remove Song from Playlist
    addRemovePlaylistSongRequest(state, action: PayloadAction<any>) {
      state.isSongLoading = true;
      state.status = action.type;
    },
    addRemovePlaylistSongSuccess(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.addRemovePlaylistSongRes = action.payload;
      state.status = action.type;
    },
    addRemovePlaylistSongFailure(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.error =
        action.payload?.error || 'Add/remove song from playlist failed';
      state.status = action.type;
    },

    // Playlist Details
    getPlaylistDetailsRequest(state, action: PayloadAction<any>) {
      state.isSongLoading = true;
      state.status = action.type;
    },
    getPlaylistDetailsSuccess(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.playlistDetailsRes = action.payload;
      state.status = action.type;
    },
    getPlaylistDetailsFailure(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.error = action.payload?.error || 'Get playlist details failed';
      state.status = action.type;
    },

    // Delete Playlist
    deletePlaylistRequest(state, action: PayloadAction<any>) {
      state.isSongLoading = true;
      state.status = action.type;
    },
    deletePlaylistSuccess(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.deletePlaylistRes = action.payload;
      state.status = action.type;
    },
    deletePlaylistFailure(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.error = action.payload?.error || 'Delete playlist failed';
      state.status = action.type;
    },

    // Albums
    getAlbumsRequest(state, action: PayloadAction<any>) {
      state.isSongLoading = true;
      state.status = action.type;
    },
    getAlbumsSuccess(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.albumsRes = action.payload;
      state.status = action.type;
    },
    getAlbumsFailure(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.error = action.payload?.error || 'Get albums failed';
      state.status = action.type;
    },

    // Artists
    getArtistsRequest(state, action: PayloadAction<any>) {
      state.isSongLoading = true;
      state.status = action.type;
    },
    getArtistsSuccess(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.artistsRes = action.payload;
      state.status = action.type;
    },
    getArtistsFailure(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.error = action.payload?.error || 'Get artists failed';
      state.status = action.type;
    },

    // Songs to Add to Playlist
    getSongsToAddRequest(state, action: PayloadAction<any>) {
      state.isSongLoading = true;
      state.status = action.type;
    },
    getSongsToAddSuccess(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.songsToAddRes = action.payload;
      state.status = action.type;
    },
    getSongsToAddFailure(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.error = action.payload?.error || 'Get songs to add failed';
      state.status = action.type;
    },

    // Player Queue
    getPlayerQueueRequest(state, action: PayloadAction<any>) {
      state.isSongLoading = true;
      state.status = action.type;
    },
    getPlayerQueueSuccess(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.playerQueueRes = action.payload;
      state.status = action.type;
    },
    getPlayerQueueFailure(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.error = action.payload?.error || 'Get player queue failed';
      state.status = action.type;
    },

    // Songs By Album
    getSongsByAlbumRequest(state, action: PayloadAction<any>) {
      state.isSongLoading = true;
      state.status = action.type;
    },
    getSongsByAlbumSuccess(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.songsByAlbumRes = action.payload;
      state.status = action.type;
    },
    getSongsByAlbumFailure(state, action: PayloadAction<any>) {
      state.isSongLoading = false;
      state.error = action.payload?.error || 'Get songs by album failed';
      state.status = action.type;
    },
  },
});

export const {
  increasePlayCountRequest,
  increasePlayCountSuccess,
  increasePlayCountFailure,
  searchSongRequest,
  searchSongSuccess,
  searchSongFailure,
  createOrUpdatePlaylistRequest,
  createOrUpdatePlaylistSuccess,
  createOrUpdatePlaylistFailure,
  getMyPlaylistsRequest,
  getMyPlaylistsSuccess,
  getMyPlaylistsFailure,
  addRemovePlaylistSongRequest,
  addRemovePlaylistSongSuccess,
  addRemovePlaylistSongFailure,
  getPlaylistDetailsRequest,
  getPlaylistDetailsSuccess,
  getPlaylistDetailsFailure,
  deletePlaylistRequest,
  deletePlaylistSuccess,
  deletePlaylistFailure,
  getAlbumsRequest,
  getAlbumsSuccess,
  getAlbumsFailure,
  getArtistsRequest,
  getArtistsSuccess,
  getArtistsFailure,
  getSongsToAddRequest,
  getSongsToAddSuccess,
  getSongsToAddFailure,
  getPlayerQueueRequest,
  getPlayerQueueSuccess,
  getPlayerQueueFailure,
  getSongsByAlbumRequest,
  getSongsByAlbumSuccess,
  getSongsByAlbumFailure,
} = SongSlice.actions;

// Aliases for convenience
export const searchRequest = searchSongRequest;
export const searchSuccess = searchSongSuccess;
export const searchFailure = searchSongFailure;

export const createPlaylistRequest = createOrUpdatePlaylistRequest;
export const createPlaylistSuccess = createOrUpdatePlaylistSuccess;
export const createPlaylistFailure = createOrUpdatePlaylistFailure;

export const myPlaylistsRequest = getMyPlaylistsRequest;
export const myPlaylistsSuccess = getMyPlaylistsSuccess;
export const myPlaylistsFailure = getMyPlaylistsFailure;

export const addRemoveSongPlaylistRequest = addRemovePlaylistSongRequest;
export const addRemoveSongPlaylistSuccess = addRemovePlaylistSongSuccess;
export const addRemoveSongPlaylistFailure = addRemovePlaylistSongFailure;

export const playlistDetailsRequest = getPlaylistDetailsRequest;
export const playlistDetailsSuccess = getPlaylistDetailsSuccess;
export const playlistDetailsFailure = getPlaylistDetailsFailure;

export const albumsRequest = getAlbumsRequest;
export const albumsSuccess = getAlbumsSuccess;
export const albumsFailure = getAlbumsFailure;

export const artistsRequest = getArtistsRequest;
export const artistsSuccess = getArtistsSuccess;
export const artistsFailure = getArtistsFailure;

export const songsToAddRequest = getSongsToAddRequest;
export const songsToAddSuccess = getSongsToAddSuccess;
export const songsToAddFailure = getSongsToAddFailure;

export const playerQueueRequest = getPlayerQueueRequest;
export const playerQueueSuccess = getPlayerQueueSuccess;
export const playerQueueFailure = getPlayerQueueFailure;

export const songsByAlbumRequest = getSongsByAlbumRequest;
export const songsByAlbumSuccess = getSongsByAlbumSuccess;
export const songsByAlbumFailure = getSongsByAlbumFailure;

export default SongSlice.reducer;
