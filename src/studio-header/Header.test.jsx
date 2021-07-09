// This file was copied from edx/frontend-component-header-edx.
import React from 'react';

import {
  cleanup,
  render,
  screen,
} from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

import Header from './Header';

describe('<Header />', () => {
  function createComponent(screenWidth, component) {
    return (
      <ResponsiveContext.Provider value={{ width: screenWidth }}>
        <IntlProvider locale="en" messages={{}}>
          <AppContext.Provider value={{
            authenticatedUser: {
              userId: 'abc123',
              username: 'edX',
              roles: [],
              administrator: false,
            },
            config: {
              STUDIO_BASE_URL: process.env.STUDIO_BASE_URL,
              LMS_BASE_URL: process.env.LMS_BASE_URL,
              LOGIN_URL: process.env.LOGIN_URL,
              LOGOUT_URL: process.env.LOGOUT_URL,
            },
          }}
          >
            {component}
          </AppContext.Provider>
        </IntlProvider>
      </ResponsiveContext.Provider>
    );
  }

  it('renders desktop header correctly with API call', async () => {
    const component = createComponent(1280, (
      <Header
        courseId="course-v1:edX+DemoX+Demo_Course"
        courseNumber="DemoX"
        courseOrg="edX"
        courseTitle="Demonstration Course"
      />
    ));

    render(component);
    expect(screen.getByTestId('course-org-number').textContent).toEqual(expect.stringContaining('edX DemoX'));
    expect(screen.getByTestId('course-title').textContent).toEqual(expect.stringContaining('Demonstration Course'));
  });

  it('renders mobile header correctly with API call', async () => {
    const component = createComponent(500, (
      <Header
        courseId="course-v1:edX+DemoX+Demo_Course"
        courseNumber="DemoX"
        courseOrg="edX"
        courseTitle="Demonstration Course"
      />
    ));

    render(component);
    expect(screen.getAllByTestId('course-org-number')[0].textContent).toEqual(expect.stringContaining('edX DemoX'));
    expect(screen.getAllByTestId('course-title')[0].textContent).toEqual(expect.stringContaining('Demonstration Course'));
  });

  it('renders desktop header correctly with bad API call', async () => {
    const component = createComponent(1280, (
      <Header
        courseId="course-v1:edX+DemoX+Demo_Course"
        courseNumber={null}
        courseOrg={null}
        courseTitle="course-v1:edX+DemoX+Demo_Course"
      />
    ));

    render(component);
    expect(screen.getByTestId('course-title').textContent).toEqual(expect.stringContaining('course-v1:edX+DemoX+Demo_Course'));
  });

  it('renders mobile header correctly with bad API call', async () => {
    const component = createComponent(500, (
      <Header
        courseId="course-v1:edX+DemoX+Demo_Course"
        courseNumber={null}
        courseOrg={null}
        courseTitle="course-v1:edX+DemoX+Demo_Course"
      />
    ));

    render(component);
    expect(screen.getAllByTestId('course-title')[0].textContent).toEqual(expect.stringContaining('course-v1:edX+DemoX+Demo_Course'));
  });

  afterEach(() => {
    cleanup();
  });
});
