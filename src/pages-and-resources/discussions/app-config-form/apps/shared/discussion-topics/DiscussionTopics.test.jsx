import React from 'react';
import {
  queryByText,
  render,
  fireEvent,
  queryAllByTestId,
  queryByTestId,
  queryByLabelText,
  act,
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
import LegacyConfigFormProvider from '../../legacy/LegacyConfigFormProvider';
import messages from '../messages';

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

const contextValue = {
  discussionTopicErrors: [false, false],
  validDiscussionTopics: [
    { name: 'General', id: 'course' },
    { name: 'Edx', id: '13f106c6-6735-4e84-b097-0456cff55960' },
  ],
  setValidDiscussionTopics: jest.fn(),
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
          <LegacyConfigFormProvider value={contextValue}>
            <Formik initialValues={data}>
              <DiscussionTopics />
            </Formik>
          </LegacyConfigFormProvider>
        </IntlProvider>
      </AppProvider>,
    );
    container = wrapper.container;
  };

  const mockStore = async (mockResponse) => {
    axiosMock.onGet(getAppsUrl(courseId)).reply(200, mockResponse);
    await executeThunk(fetchApps(courseId), store.dispatch);
  };

  test('displays a collapsible card for each discussion topic', async () => {
    await mockStore(legacyApiResponse);
    createComponent(appConfig);

    expect(queryAllByTestId(container, 'course')).toHaveLength(1);
    expect(queryAllByTestId(container, '13f106c6-6735-4e84-b097-0456cff55960')).toHaveLength(1);
  });

  test('renders title', async () => {
    await mockStore(legacyApiResponse);
    createComponent(appConfig);

    expect(container.querySelector('h5')).toHaveTextContent(messages.discussionTopics.defaultMessage);
  });

  test('renders label text', async () => {
    await mockStore(legacyApiResponse);
    createComponent(appConfig);

    expect(container.querySelector('label')).toHaveTextContent(messages.discussionTopicsLabel.defaultMessage);
  });

  test('renders helping text', async () => {
    await mockStore(legacyApiResponse);
    createComponent(appConfig);

    expect(queryByText(container, `${messages.discussionTopicsHelp.defaultMessage}`)).toBeInTheDocument();
  });

  test('renders a Add topic button', async () => {
    await mockStore(legacyApiResponse);
    createComponent(appConfig);

    expect(queryByText(container, `${messages.addTopicButton.defaultMessage}`)).toBeInTheDocument();
  });

  test('calls "onClick" when add topic button click', async () => {
    await mockStore(legacyApiResponse);
    createComponent(appConfig);

    const addTopicButton = queryByText(container, `${messages.addTopicButton.defaultMessage}`);
    fireEvent.click(addTopicButton);

    expect(queryByText(container, `${messages.configureAdditionalTopic.defaultMessage}`)).toBeInTheDocument();
  });

  test('updates discussion topic name', async () => {
    await mockStore(legacyApiResponse);
    createComponent(appConfig);
    const topicCard = queryByTestId(container, '13f106c6-6735-4e84-b097-0456cff55960');

    userEvent.click(queryByLabelText(topicCard, 'Expand'));
    await act(async () => {
      fireEvent.change(topicCard.querySelector('input'), { target: { value: 'new name' } });
    });
    userEvent.click(queryByLabelText(topicCard, 'Collapse'));

    expect(queryByText(topicCard, 'new name')).toBeInTheDocument();
  });
});
