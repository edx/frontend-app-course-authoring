import React from 'react';

import { queryByTestId, render } from '@testing-library/react';

import { getConfig, initializeMockApp } from '@edx/frontend-platform';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { AppProvider } from '@edx/frontend-platform/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import initializeStore from './store';
import CourseAuthoringPage from './CourseAuthoringPage';
import PagesAndResources from './pages-and-resources/PagesAndResources';
import executeThunk from './utils';
import { fetchCourseApps } from './pages-and-resources/data/thunks';

const courseId = 'course-v1:edX+TestX+Test_Course';
let axiosMock;
let store;
let container;
function renderComponent() {
  const wrapper = render(
    <AppProvider store={store}>
      <IntlProvider locale="en">
        <CourseAuthoringPage courseId={courseId}>
          <PagesAndResources courseId={courseId} />
        </CourseAuthoringPage>
      </IntlProvider>
    </AppProvider>
    ,
  );
  container = wrapper.container;
}

const mockStore = async () => {
  const apiBaseUrl = getConfig().STUDIO_BASE_URL;
  const courseAppsApiUrl = `${apiBaseUrl}/api/course_apps/v1/apps`;
  axiosMock.onGet(`${courseAppsApiUrl}/${courseId}`).reply(403, {
    response: { status: 403 },
  });

  await executeThunk(fetchCourseApps(courseId), store.dispatch);
};
describe('DiscussionsSettings', () => {
  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });

    store = initializeStore();
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
  });

  test('renders permission error in case of 403', async () => {
    await mockStore();
    renderComponent();
    expect(queryByTestId(container, 'permissionDeniedAlert')).toBeInTheDocument();
  });
});
