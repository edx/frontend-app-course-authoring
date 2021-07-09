import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';

import Footer from '@edx/frontend-component-footer';

import { fetchCourseDetail } from './data/thunks';
import { useModel } from './generic/model-store';
import Header from './studio-header/Header';

export default function CourseAuthoringPage({ courseId, children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCourseDetail(courseId));
  }, [courseId]);

  const courseDetail = useModel('courseDetails', courseId);

  const courseNumber = courseDetail ? courseDetail.number : null;
  const courseOrg = courseDetail ? courseDetail.org : null;
  const courseTitle = courseDetail ? courseDetail.name : courseId;

  return (
    <>
      <Header
        courseNumber={courseNumber}
        courseOrg={courseOrg}
        courseTitle={courseTitle}
        courseId={courseId}
      />
      {children}
      <Footer />
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
