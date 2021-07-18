/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'pagesAndResources',
  initialState: {
    courseAppIds: [],
    loadingStatus: RequestStatus.IN_PROGRESS,
    savingStatus: RequestStatus.SUCCESSFUL,
    courseAppsApiStatus: {},
  },
  reducers: {
    fetchCourseAppsSuccess: (state, { payload }) => {
      state.courseAppIds = payload.courseAppIds;
    },
    updateLoadingStatus: (state, { payload }) => {
      state.loadingStatus = payload.status;
    },
    updateSavingStatus: (state, { payload }) => {
      state.savingStatus = payload.status;
    },
    updateCourseAppsApiStatus: (state, { payload }) => {
      state.courseAppsApiStatus = payload.status;
    },
  },
});

export const {
  fetchCourseAppsSuccess,
  updateLoadingStatus,
  updateSavingStatus,
  updateCourseAppsApiStatus,
} = slice.actions;

export const {
  reducer,
} = slice;
