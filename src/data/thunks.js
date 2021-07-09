import { addModel } from '../generic/model-store';
import { getCourseDetail } from './api';
import {
  FAILED,
  LOADED,
  LOADING,
  updateStatus,
} from './slice';

/* eslint-disable import/prefer-default-export */
export function fetchCourseDetail(courseId) {
  return async (dispatch) => {
    dispatch(updateStatus({ courseId, status: LOADING }));

    try {
      const courseDetail = await getCourseDetail(courseId);
      dispatch(updateStatus({ courseId, status: LOADED }));

      dispatch(addModel({ modelType: 'courseDetails', model: courseDetail }));
    } catch (error) {
      dispatch(updateStatus({ courseId, status: FAILED }));
    }
  };
}
