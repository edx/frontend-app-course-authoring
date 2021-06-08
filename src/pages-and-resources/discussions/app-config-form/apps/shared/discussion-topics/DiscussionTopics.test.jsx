import React from 'react';
import {
  act,
  queryByLabelText,
  queryByText,
  render,
  fireEvent,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';
import { AppProvider } from '@edx/frontend-platform/react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import MockAdapter from 'axios-mock-adapter';
import { Formik } from 'formik';
import userEvent from '@testing-library/user-event';

import DiscussionTopics from './DiscussionTopics';
import initializeStore from '../../../../../../store';
import { getAppsUrl } from '../../../../data/api';
import { fetchApps } from '../../../../data/thunks';
import executeThunk from '../../../../../../utils';
import { legacyApiResponse } from '../../../../factories/mockApiResponses';

const appConfig = {
  id: 'legacy',
  divideByCohorts: false,
  divideCourseTopicsByCohorts: false,
  discussionTopics: [
    { name: 'General', id: 'course' },
    { name: 'Edx', id: '13f106c6-6735-4e84-b097-0456cff55960' },
  ],
  divideDiscussionIds: [],
  allowAnonymousPosts: false,
  allowAnonymousPostsPeers: false,
  allowDivisionByUnit: false,
  blackoutDates: '[]',
};

const courseId = 'course-v1:edX+TestX+Test_Course';

describe('DiscussionTopics', () => {
  let axiosMock;
  let store;
  let container;

  beforeEach(() => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });

    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    store = initializeStore();
  });

  afterEach(() => {
    axiosMock.reset();
  });

  const createComponent = (data) => {
    const wrapper = render(
      <AppProvider store={store}>
        <IntlProvider locale="en">
          <Formik
            initialValues={data}
          >
            <DiscussionTopics />
          </Formik>
        </IntlProvider>
      </AppProvider>,
    );
    container = wrapper.container;
  };

  const mockStore = async (mockResponse) => {
    axiosMock.onGet(getAppsUrl(courseId)).reply(200, mockResponse);
    await executeThunk(fetchApps(courseId), store.dispatch);
  };

  test('Displays a collapsible card for each discussion topic', async () => {
    await mockStore(legacyApiResponse);
    createComponent(appConfig);

    expect(container.querySelectorAll('.collapsible-card')).toHaveLength(2);

    expect(container.querySelector('[id="course"]')).toBeInTheDocument();
    expect(container.querySelector('[id="13f106c6-6735-4e84-b097-0456cff55960"]')).toBeInTheDocument();
  });

  test('Displays collapse view of general discussion topic', async () => {
    await mockStore(legacyApiResponse);
    createComponent(appConfig);

    const topicNode = container.querySelector('[id="course"]');

    expect(topicNode.querySelector('button[aria-label="Expand"]')).toBeInTheDocument();
    expect(topicNode.querySelector('button[aria-label="Collapse"]')).not.toBeInTheDocument();
    expect(queryByText(topicNode, 'General')).toBeInTheDocument();
  });

  test('Displays collapse view of additional discussion topic', async () => {
    await mockStore(legacyApiResponse);
    createComponent(appConfig);

    const topicNode = container.querySelector('[id="13f106c6-6735-4e84-b097-0456cff55960"]');

    expect(topicNode.querySelector('button[aria-label="Expand"]')).toBeInTheDocument();
    expect(topicNode.querySelector('button[aria-label="Collapse"]')).not.toBeInTheDocument();
    expect(queryByText(topicNode, 'Edx')).toBeInTheDocument();
  });

  test('Displays expand view of general discussion topic', async () => {
    await mockStore(legacyApiResponse);
    createComponent(appConfig);
    const topicNode = container.querySelector('[id="course"]');

    userEvent.click(queryByLabelText(topicNode, 'Expand'));

    expect(topicNode.querySelector('button[aria-label="Collapse"]')).toBeInTheDocument();
    expect(topicNode.querySelector('button[aria-label="Expand"]')).not.toBeInTheDocument();
    expect(topicNode.querySelector('button[aria-label="Delete Topic"]')).not.toBeInTheDocument();
    expect(topicNode.querySelector('input')).toBeInTheDocument();
  });

  test('Displays expand view of additional discussion topic', async () => {
    await mockStore(legacyApiResponse);
    createComponent(appConfig);
    const topicNode = container.querySelector('[id="13f106c6-6735-4e84-b097-0456cff55960"]');

    userEvent.click(queryByLabelText(topicNode, 'Expand'));

    expect(topicNode.querySelector('button[aria-label="Expand"]')).not.toBeInTheDocument();
    expect(topicNode.querySelector('button[aria-label="Collapse"]')).toBeInTheDocument();
    expect(topicNode.querySelector('button[aria-label="Delete Topic"]')).toBeInTheDocument();
    expect(topicNode.querySelector('input')).toBeInTheDocument();
  });

  test('Displays updated discussion topic list after delete an additional topic', async () => {
    await mockStore(legacyApiResponse);
    createComponent(appConfig);
    const topicNode = container.querySelector('[id= "13f106c6-6735-4e84-b097-0456cff55960"]');

    userEvent.click(queryByLabelText(topicNode, 'Expand'));
    userEvent.click(queryByLabelText(topicNode, 'Delete Topic'));

    expect(container.querySelector('.card')).toBeInTheDocument();

    await act(async () => {
      userEvent.click(container.querySelector('.btn-outline-brand'));
    });

    expect(container.querySelectorAll('.collapsible-card')).toHaveLength(1);
  });

  test('Updates discussion topic name', async () => {
    await mockStore(legacyApiResponse);
    createComponent(appConfig);
    const topicNode = container.querySelector('[id= "13f106c6-6735-4e84-b097-0456cff55960"]');

    userEvent.click(queryByLabelText(topicNode, 'Expand'));
    await act(async () => {
      fireEvent.change(topicNode.querySelector('input'), { target: { value: 'new name' } });
    });
    userEvent.click(queryByLabelText(topicNode, 'Collapse'));

    expect(queryByText(topicNode, 'new name')).toBeInTheDocument();
  });
});
