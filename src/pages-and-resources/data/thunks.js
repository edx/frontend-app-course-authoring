import { RequestStatus } from '../../data/constants';
import {
  getCourseApps,
  updateCourseApp,
} from './api';
import { addModels, updateModel } from '../../generic/model-store';
import {
  fetchCourseAppsSuccess,
  updateLoadingStatus,
  updateSavingStatus,
  updateCourseAppsApiStatus,
} from './slice';

/* eslint-disable import/prefer-default-export */
export function fetchCourseApps(courseId) {
  return async (dispatch) => {
    dispatch(updateLoadingStatus({ courseId, status: RequestStatus.IN_PROGRESS }));

    try {
      const courseApps = await getCourseApps(courseId);

      dispatch(addModels({ modelType: 'courseApps', models: courseApps }));
      dispatch(fetchCourseAppsSuccess({
        courseAppIds: courseApps.map(courseApp => courseApp.id),
      }));
      dispatch(updateLoadingStatus({ courseId, status: RequestStatus.SUCCESSFUL }));
    } catch (error) {
      if (error.response && error.response.status === 403) {
        dispatch(updateCourseAppsApiStatus({ status: RequestStatus.DENIED }));
      }

      dispatch(updateLoadingStatus({ courseId, status: RequestStatus.FAILED }));
    }
  };
}

export function updateAppStatus(courseId, appId, state) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      await updateCourseApp(courseId, appId, state);
      dispatch(updateModel({ modelType: 'courseApps', model: { id: appId, enabled: state } }));
      dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
    } catch (error) {
      dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
    }
  };
}
