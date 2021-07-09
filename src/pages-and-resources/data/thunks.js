import { RequestStatus } from '../../data/constants';
import { addModels, updateModel } from '../../generic/model-store';
import {
  getCourseApps,
  updateCourseApp,
} from './api';
import {
  fetchCourseAppsSuccess,
  updateLoadingStatus,
  updateSavingStatus,
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
      // TODO: We need generic error handling in the app for when a request just fails... in other
      // parts of the app (proctored exam settings) we show a nice message and ask the user to
      // reload/try again later.
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
