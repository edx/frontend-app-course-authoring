import React from 'react';
import {
  queryByLabelText,
  queryAllByText,
  render,
  queryAllByTestId,
  queryByTestId,
  queryByText,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';
import { AppProvider } from '@edx/frontend-platform/react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import MockAdapter from 'axios-mock-adapter';
import { Formik } from 'formik';
import userEvent from '@testing-library/user-event';

import TopicItem from './TopicItem';
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

const generalTopic = {
  index: 0,
  name: 'General',
  onDelete: jest.fn(),
  id: 'course',
  hasError: false,
};

const additionalTopic = {
  index: 1,
  name: 'Edx',
  onDelete: jest.fn(),
  id: '13f106c6-6735-4e84-b097-0456cff55960',
  hasError: false,
};

const contextValue = {
  validDiscussionTopics: [
    { name: 'General', id: 'course' },
    { name: 'Edx', id: '13f106c6-6735-4e84-b097-0456cff55960' },
  ],
  setValidDiscussionTopics: jest.fn(),
  discussionTopicErrors: [false, false],
};

const courseId = 'course-v1:edX+TestX+Test_Course';

describe('TopicItem', () => {
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

  const createComponent = (props) => {
    const wrapper = render(
      <AppProvider store={store}>
        <IntlProvider locale="en">
          <LegacyConfigFormProvider value={contextValue}>
            <Formik initialValues={appConfig}>
              <TopicItem {...props} />
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

  test('displays a collapsible card for discussion topic', async () => {
    await mockStore(legacyApiResponse);
    createComponent(generalTopic);

    expect(queryAllByTestId(container, 'course')).toHaveLength(1);
  });

  test('displays collapse view of general discussion topic', async () => {
    await mockStore(legacyApiResponse);
    createComponent(generalTopic);

    const generalTopicNode = queryByTestId(container, 'course');

    expect(generalTopicNode.querySelector('button[aria-label="Expand"]')).toBeInTheDocument();
    expect(generalTopicNode.querySelector('button[aria-label="Collapse"]')).not.toBeInTheDocument();
    expect(queryByText(generalTopicNode, 'General')).toBeInTheDocument();
  });

  test('displays expand view of general discussion topic', async () => {
    await mockStore(legacyApiResponse);
    createComponent(generalTopic);

    const generalTopicNode = queryByTestId(container, 'course');
    userEvent.click(queryByLabelText(generalTopicNode, 'Expand'));

    expect(generalTopicNode.querySelector('button[aria-label="Collapse"]')).toBeInTheDocument();
    expect(generalTopicNode.querySelector('button[aria-label="Expand"]')).not.toBeInTheDocument();
    expect(generalTopicNode.querySelector('button[aria-label="Delete Topic"]')).not.toBeInTheDocument();
    expect(generalTopicNode.querySelector('input')).toBeInTheDocument();
  });

  test('displays expand view of additional discussion topic', async () => {
    await mockStore(legacyApiResponse);
    createComponent(additionalTopic);

    const topicCard = queryByTestId(container, '13f106c6-6735-4e84-b097-0456cff55960');
    userEvent.click(queryByLabelText(topicCard, 'Expand'));

    expect(topicCard.querySelector('button[aria-label="Expand"]')).not.toBeInTheDocument();
    expect(topicCard.querySelector('button[aria-label="Collapse"]')).toBeInTheDocument();
    expect(topicCard.querySelector('button[aria-label="Delete Topic"]')).toBeInTheDocument();
    expect(topicCard.querySelector('input')).toBeInTheDocument();
  });

  describe('renders delete topic popup', () => {
    beforeEach(async () => {
      await mockStore(legacyApiResponse);
      createComponent(additionalTopic);

      const topicCard = queryByTestId(container, '13f106c6-6735-4e84-b097-0456cff55960');
      userEvent.click(queryByLabelText(topicCard, 'Expand'));
      userEvent.click(queryByLabelText(topicCard, 'Delete Topic'));
    });

    test('when click on Delete topic button', async () => {
      expect(queryAllByText(container, `${messages.discussionTopicDeletionLabel.defaultMessage}`)).toHaveLength(1);
    });

    test('with title text', async () => {
      expect(queryByText(container, `${messages.discussionTopicDeletionLabel.defaultMessage}`)).toBeInTheDocument();
    });

    test('with helping text', async () => {
      expect(queryByText(container, `${messages.discussionTopicDeletionHelp.defaultMessage}`)).toBeInTheDocument();
    });

    test('with a delete button', async () => {
      expect(queryByText(container, `${messages.deleteButton.defaultMessage}`)).toBeInTheDocument();
    });

    test('with a cancel button', async () => {
      expect(queryByText(container, `${messages.cancelButton.defaultMessage}`)).toBeInTheDocument();
    });
  });

  test('shows help text on field focus', async () => {
    await mockStore(legacyApiResponse);
    createComponent(additionalTopic);

    const topicCard = queryByTestId(container, '13f106c6-6735-4e84-b097-0456cff55960');
    userEvent.click(queryByLabelText(topicCard, 'Expand'));
    topicCard.querySelector('input').focus();

    expect(queryByText(topicCard, 'Choose a unique name for your topic')).toBeInTheDocument();
  });

  test('No errors on field when passing valid topic name', async () => {
    await mockStore(legacyApiResponse);
    createComponent(additionalTopic);

    const topicCard = queryByTestId(container, '13f106c6-6735-4e84-b097-0456cff55960');
    userEvent.click(queryByLabelText(topicCard, 'Expand'));
    const topicInput = topicCard.querySelector('input');
    topicInput.focus();
    topicInput.blur();
    await waitForElementToBeRemoved(queryByText(topicCard, 'Choose a unique name for your topic'));
    const duplicateError = queryByText(topicCard, 'It looks like this name is already in use');
    const Requirederror = queryByText(topicCard, 'Topic name is a required field');

    expect(Requirederror).not.toBeInTheDocument();
    expect(duplicateError).not.toBeInTheDocument();
  });
});
