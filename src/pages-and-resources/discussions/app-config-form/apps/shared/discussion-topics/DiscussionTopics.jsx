import React, { useContext, useEffect } from 'react';

import { FieldArray, useFormikContext } from 'formik';
import { useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button } from '@edx/paragon';
import { Add } from '@edx/paragon/icons';

import { updateValidationStatus } from '../../../../data/slice';
import { LegacyConfigFormContext } from '../../legacy/LegacyConfigFormProvider';
import messages from '../messages';
import TopicItem from './TopicItem';

const DiscussionTopics = ({ intl }) => {
  const {
    values: appConfig,
    validateForm,
  } = useFormikContext();
  const { discussionTopics } = appConfig;
  const dispatch = useDispatch();
  const {
    discussionTopicErrors,
    validDiscussionTopics,
    setValidDiscussionTopics,
  } = useContext(LegacyConfigFormContext);

  const isFormInvalid = discussionTopicErrors.some((error) => error === true);
  useEffect(() => {
    dispatch(updateValidationStatus({ hasError: isFormInvalid }));
  }, [isFormInvalid]);

  const handleTopicDelete = async (topicIndex, topicId, remove) => {
    await remove(topicIndex);
    validateForm();
    const validTopics = validDiscussionTopics.filter(topic => topic.id !== topicId);
    setValidDiscussionTopics(validTopics);
  };

  const addNewTopic = (push) => {
    const payload = { name: '', id: uuid() };
    push(payload);
  };

  return (
    <>
      <h5 className="text-gray-500 mt-4 mb-2">
        {intl.formatMessage(messages.discussionTopics)}
      </h5>
      <label className="text-primary-500 mb-2 h4">
        {intl.formatMessage(messages.discussionTopicsLabel)}
      </label>
      <div className="small mb-4 text-muted">
        {intl.formatMessage(messages.discussionTopicsHelp)}
      </div>
      <div>
        <FieldArray
          name="discussionTopics"
          render={({ push, remove }) => (
            <div>
              {discussionTopics.map((topic, index) => (
                <TopicItem
                  {...topic}
                  key={`topic-${topic.id}`}
                  index={index}
                  onDelete={() => handleTopicDelete(index, topic.id, remove)}
                  hasError={discussionTopicErrors[index]}
                />
              ))}
              <div className="mb-4">
                <Button
                  onClick={() => addNewTopic(push)}
                  variant="link"
                  iconBefore={Add}
                  className="text-primary-500 p-0"
                >
                  {intl.formatMessage(messages.addTopicButton)}
                </Button>
              </div>
            </div>
          )}
        />
      </div>
    </>
  );
};

DiscussionTopics.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(DiscussionTopics);
