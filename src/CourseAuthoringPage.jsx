import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Footer from '@edx/frontend-component-footer';
import { useDispatch, useSelector } from 'react-redux';

import Header from './studio-header/Header';
import { fetchCourseDetail } from './data/thunks';
import { useModel } from './generic/model-store';
import PermissionDeniedAlert from './generic/PermissionDeniedAlert';
import { getCourseAppsApiStatus, getLoadingStatus } from './pages-and-resources/data/selectors';
import { RequestStatus } from './data/constants';
import Loading from './generic/Loading';

export default function CourseAuthoringPage({ courseId, children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCourseDetail(courseId));
  }, [courseId]);

  const courseDetail = useModel('courseDetails', courseId);

  const courseNumber = courseDetail ? courseDetail.number : null;
  const courseOrg = courseDetail ? courseDetail.org : null;
  const courseTitle = courseDetail ? courseDetail.name : courseId;
  const courseAppsApiStatus = useSelector(getCourseAppsApiStatus);
  const inProgress = useSelector(getLoadingStatus) === RequestStatus.IN_PROGRESS;
  if (courseAppsApiStatus === RequestStatus.DENIED) {
    return (
      <PermissionDeniedAlert />
    );
  }

  const AppHeader = () => (
    <Header
      courseNumber={courseNumber}
      courseOrg={courseOrg}
      courseTitle={courseTitle}
      courseId={courseId}
    />
  );

  return (
    <>
      {inProgress ? <Loading /> : AppHeader()}
      {children}
      {!inProgress && <Footer />}
    </>
  );
}

CourseAuthoringPage.propTypes = {
  children: PropTypes.node,
  courseId: PropTypes.string.isRequired,
};

CourseAuthoringPage.defaultProps = {
  children: null,
};
