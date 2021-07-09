import React, { createRef } from 'react';

import { act, render } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import { initializeMockApp } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppProvider } from '@edx/frontend-platform/react';

import initializeStore from '../../../../../store';
import executeThunk from '../../../../../utils';
import { getAppsUrl } from '../../../data/api';
import { fetchApps } from '../../../data/thunks';
import {
  legacyApiResponse,
} from '../../../factories/mockApiResponses';
import LegacyConfigForm from './LegacyConfigForm';

const courseId = 'course-v1:edX+TestX+Test_Course';

const defaultAppConfig = {
  id: 'legacy',
  divideByCohorts: false,
  divideCourseTopicsByCohorts: false,
  discussionTopics: [
    { name: 'General', id: 'course' },
    { name: 'Edx', id: '13f106c6-6735-4e84-b097-0456cff55960' },
  ],
  divideDiscussionIds: [
    'course',
    '13f106c6-6735-4e84-b097-0456cff55960',
  ],
  allowAnonymousPosts: false,
  allowAnonymousPostsPeers: false,
  allowDivisionByUnit: false,
  blackoutDates: '[]',
};

describe('LegacyConfigForm', () => {
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

  const createComponent = (appConfig, onSubmit = jest.fn(), formRef = createRef()) => {
    const wrapper = render(
      <AppProvider store={store}>
        <IntlProvider locale="en">
          <LegacyConfigForm
            title="Test Legacy edX Discussions"
            appConfig={appConfig}
            onSubmit={onSubmit}
            formRef={formRef}
          />
        </IntlProvider>
      </AppProvider>,
    );
    container = wrapper.container;
    return container;
  };

  const mockStore = async (mockResponse) => {
    axiosMock.onGet(getAppsUrl(courseId)).reply(200, mockResponse);
    await executeThunk(fetchApps(courseId), store.dispatch);
  };

  test('title rendering', async () => {
    await mockStore(legacyApiResponse);
    createComponent(defaultAppConfig);

    expect(container.querySelector('h3')).toHaveTextContent('Test Legacy edX Discussions');
  });

  test('calls onSubmit when the formRef is submitted', async () => {
    const formRef = createRef();
    const handleSubmit = jest.fn();

    await mockStore(legacyApiResponse);
    createComponent({
      ...defaultAppConfig,
      divideByCohorts: true,
    }, handleSubmit, formRef);

    await act(async () => {
      formRef.current.submit();
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      // Because we use defaultAppConfig as the initialValues of the form, and we haven't changed
      // any of the form inputs, this exact object shape is returned back to us, so we're reusing
      // it here.  It's not supposed to be 'the same object', it just happens to be.
      {
        ...defaultAppConfig,
        divideByCohorts: true,
      },
    );
  });

  test('default field states are correct, including removal of folded sub-fields', async () => {
    await mockStore(legacyApiResponse);
    createComponent(defaultAppConfig);

    // DivisionByGroupFields
    expect(container.querySelector('#divideByCohorts')).toBeInTheDocument();
    expect(container.querySelector('#divideByCohorts')).not.toBeChecked();
    expect(
      container.querySelector('#divideCourseTopicsByCohorts'),
    ).not.toBeInTheDocument();

    defaultAppConfig.divideDiscussionIds.forEach(id => expect(
      container.querySelector(`#checkbox-${id}`),
    ).not.toBeInTheDocument());

    // AnonymousPostingFields
    expect(container.querySelector('#allowAnonymousPosts')).toBeInTheDocument();
    expect(container.querySelector('#allowAnonymousPosts')).not.toBeChecked();
    expect(
      container.querySelector('#allowAnonymousPostsPeers'),
    ).not.toBeInTheDocument();

    // BlackoutDatesField
    expect(container.querySelector('#blackoutDates')).toBeInTheDocument();
    expect(container.querySelector('#blackoutDates')).toHaveValue('[]');
  });

  test('folded sub-fields are in the DOM when parents are enabled', async () => {
    await mockStore(legacyApiResponse);
    createComponent({
      ...defaultAppConfig,
      divideByCohorts: true,
      allowAnonymousPosts: true,
    });

    // DivisionByGroupFields
    expect(container.querySelector('#divideByCohorts')).toBeInTheDocument();
    expect(container.querySelector('#divideByCohorts')).toBeChecked();
    expect(
      container.querySelector('#divideCourseTopicsByCohorts'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('#divideCourseTopicsByCohorts'),
    ).not.toBeChecked();

    defaultAppConfig.divideDiscussionIds.forEach(id => expect(
      container.querySelector(`#checkbox-${id}`),
    ).not.toBeInTheDocument());

    // AnonymousPostingFields
    expect(container.querySelector('#allowAnonymousPosts')).toBeInTheDocument();
    expect(container.querySelector('#allowAnonymousPosts')).toBeChecked();
    expect(
      container.querySelector('#allowAnonymousPostsPeers'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('#allowAnonymousPostsPeers'),
    ).not.toBeChecked();
  });

  test('folded discussion topics are in the DOM when divideByCohorts and divideCourseWideTopicsare enabled',
    async () => {
      await mockStore(legacyApiResponse);
      createComponent({
        ...defaultAppConfig,
        divideByCohorts: true,
        divideCourseTopicsByCohorts: true,
      });

      // DivisionByGroupFields
      expect(container.querySelector('#divideByCohorts')).toBeInTheDocument();
      expect(container.querySelector('#divideByCohorts')).toBeChecked();
      expect(container.querySelector('#divideCourseTopicsByCohorts')).toBeInTheDocument();
      expect(container.querySelector('#divideCourseTopicsByCohorts')).toBeChecked();

      defaultAppConfig.divideDiscussionIds.forEach(id => {
        expect(container.querySelector(`#checkbox-${id}`)).toBeInTheDocument();
        expect(container.querySelector(`#checkbox-${id}`)).toBeChecked();
      });
    });
});
