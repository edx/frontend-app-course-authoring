import React, { createRef } from 'react';
import {
  act,
  render,
  getByText,
  waitForElementToBeRemoved,
  queryByText,
  getByLabelText, queryByAttribute, getByRole,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';
import { AppProvider } from '@edx/frontend-platform/react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import MockAdapter from 'axios-mock-adapter';
import userEvent from '@testing-library/user-event';

import { getAppsUrl } from '../../../data/api';
import { fetchApps } from '../../../data/thunks';
import initializeStore from '../../../../../store';
import executeThunk from '../../../../../utils';
import {
  legacyApiResponse,
} from '../../../factories/mockApiResponses';
import LegacyConfigForm from './LegacyConfigForm';

const getById = queryByAttribute.bind(null, 'id');
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
    defaultAppConfig.discussionTopics = [{ name: 'General', id: 'course' },
      { name: 'Edx', id: '13f106c6-6735-4e84-b097-0456cff55960' }];
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

  test('folded discussion topics are in the DOM when divideByCohorts and divideCourseWideTopics are enabled',
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

  const createNewTopic = (topicName) => {
    const topicIndex = defaultAppConfig.discussionTopics.length; // #2
    const button = getByText(container, 'Add topic');
    userEvent.click(button);
    const elTopic = getById(container, `discussionTopics.${topicIndex}.name`);
    if (topicName) {
      userEvent.type(elTopic, topicName);
      defaultAppConfig.discussionTopics.push({ name: topicName, id: `topic-${defaultAppConfig.discussionTopics.length}` });
    }
    elTopic.focus();
    return elTopic;
  };
  const assertTopicNameRequiredValidation = (topicCard, expectExists = true) => {
    const error = queryByText(topicCard, 'Topic name is a required field');
    if (expectExists) { expect(error).toBeInTheDocument(); } else { expect(error).not.toBeInTheDocument(); }
  };
  const assertDuplicateTopicNameValidation = async (topicCard, waitForBlur = true, expectExists = true) => {
    if (waitForBlur) { await waitForElementToBeRemoved(queryByText(topicCard, 'Choose a unique name for your topic')); }
    const error = queryByText(topicCard, 'It looks like this name is already in use');
    if (expectExists) { expect(error).toBeInTheDocument(); } else { expect(error).not.toBeInTheDocument(); }
  };

  test('Show help text on field focus', async () => {
    await mockStore(legacyApiResponse);
    createComponent(defaultAppConfig);
    const topicInput = createNewTopic();
    const topicCard = topicInput.closest('.collapsible-card');
    expect(queryByText(topicCard, 'Choose a unique name for your topic')).toBeInTheDocument();
  });

  test('Show required errors on field when leaving empty topic name/removed when a valid topic is passed ', async () => {
    await mockStore(legacyApiResponse);
    createComponent(defaultAppConfig);
    const topicInput = createNewTopic();
    const topicCard = topicInput.closest('.collapsible-card');
    topicInput.blur();
    await waitForElementToBeRemoved(queryByText(topicCard, 'Choose a unique name for your topic'));
    assertTopicNameRequiredValidation(topicCard);
    userEvent.type(topicInput, 'valid topic name');
    assertTopicNameRequiredValidation(topicCard, false);
  });

  test('Check Field is not collapsible in case of error', async () => {
    await mockStore(legacyApiResponse);
    createComponent(defaultAppConfig);
    const topicInput = createNewTopic('');
    const topicCard = topicInput.closest('.collapsible-card');
    topicInput.blur();
    const collapseButton = getByLabelText(topicCard, 'Collapse');
    userEvent.click(collapseButton);
    expect(collapseButton).toBeInTheDocument();
  });

  test('No errors on field when passing valid topic name', async () => {
    await mockStore(legacyApiResponse);
    createComponent(defaultAppConfig);
    const topicInput = createNewTopic('valid topic name');
    const topicCard = topicInput.closest('.collapsible-card');
    topicInput.blur();
    await assertDuplicateTopicNameValidation(topicCard, true, false);
    assertTopicNameRequiredValidation(topicCard, false);
  });

  describe('Duplicate Validation test cases', () => {
    let topicInput;
    let topic;
    let duplicateTopicInput;
    let duplicateTopic;

    const createDuplicateTopics = async () => {
      await mockStore(legacyApiResponse);
      createComponent(defaultAppConfig);
      topicInput = createNewTopic('duplicate');
      topic = topicInput.closest('.collapsible-card');
      topicInput.blur();
      duplicateTopicInput = createNewTopic('duplicate');
      duplicateTopic = duplicateTopicInput.closest('.collapsible-card');
      duplicateTopicInput.blur();
    };
    const deleteTopic = (topicCard) => {
      const deleteTopicButton = getByLabelText(topicCard, 'Delete Topic');
      userEvent.click(deleteTopicButton);
      expect(topicCard).not.toBeInTheDocument();
      const delConfirmButton = getByText(container, 'Delete');
      userEvent.click(delConfirmButton);
    };
    beforeEach(async () => {
      await createDuplicateTopics();
    });

    test('Show duplicate errors on fields when passing duplicate topic name', async () => {
      await assertDuplicateTopicNameValidation(topic);
      await assertDuplicateTopicNameValidation(duplicateTopic);
    });

    test('check duplicate errors on fields when passing case insensitive duplicate topic name', async () => {
      topicInput.focus();
      topicInput.setSelectionRange(0, topicInput.value.length);
      userEvent.type(topicInput, 'DUPLICATE');
      topicInput.blur();
      await assertDuplicateTopicNameValidation(topic);
      await assertDuplicateTopicNameValidation(duplicateTopic, false);
    });

    test('check duplicate error is removed on fields when name is fixed', async () => {
      await assertDuplicateTopicNameValidation(topic);
      await assertDuplicateTopicNameValidation(duplicateTopic, false);
      topicInput.focus();
      topicInput.setSelectionRange(0, topicInput.value.length);
      userEvent.type(topicInput, 'valid');
      topicInput.blur();
      await waitForElementToBeRemoved(queryByText(topic, 'It looks like this name is already in use'));
      await assertDuplicateTopicNameValidation(duplicateTopic, false, false);
    });

    test('check duplicate error is removed on deleting duplicate topic', async () => {
      await assertDuplicateTopicNameValidation(topic);
      await assertDuplicateTopicNameValidation(duplicateTopic, false);
      deleteTopic(duplicateTopic);
      await waitForElementToBeRemoved(queryByText(topic, 'It looks like this name is already in use'));
      expect(queryByText(topic, 'It looks like this name is already in use')).not.toBeInTheDocument();
    });
  });

  const cases = [['', 2], ['edx', 2], ['valid', 3]];
  test.each(cases)(
    'Check only valid topics are rendered',
    async (topicName, expectedTotalTopics) => {
      await mockStore(legacyApiResponse);
      createComponent(defaultAppConfig);
      userEvent.click(queryByText(container, 'Divide discussions by cohorts'));
      userEvent.click(queryByText(container, 'Divide course-wide discussion topics'));
      const topicList = getByRole(container, 'group');
      const topicInput = createNewTopic(topicName);
      const topicCard = topicInput.closest('.collapsible-card');
      topicInput.blur();
      await waitForElementToBeRemoved(queryByText(topicCard, 'Choose a unique name for your topic'));
      expect(topicList.getElementsByClassName('pgn__form-checkbox')).toHaveLength(expectedTotalTopics);
    },
  );
});
