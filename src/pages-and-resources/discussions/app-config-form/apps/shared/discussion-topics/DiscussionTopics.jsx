import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Add } from '@edx/paragon/icons';
import { Button } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { FieldArray, useFormikContext } from 'formik';
import { v4 as uuid } from 'uuid';

import messages from '../messages';
import TopicItem from './TopicItem';
import { removeModel, updateModels } from '../../../../../../generic/model-store';
import { updateDiscussionTopicIds } from '../../../../data/slice';

const DiscussionTopics = ({ intl }) => {
  const dispatch = useDispatch();
  const { values: appConfig, setFieldValue } = useFormikContext();
  const { discussionTopics, dividedCourseWideDiscussionsIds } = appConfig;
  const [topics, setTopics] = useState(discussionTopics);

  useEffect(() => {
    const updatedDiscussionTopicIds = discussionTopics.map(topic => topic.id);

    setTopics(discussionTopics);
    dispatch(updateDiscussionTopicIds(updatedDiscussionTopicIds));
    dispatch(updateModels({ modelType: 'discussionTopics', models: discussionTopics }));
  }, [discussionTopics]);

  const handleTopicDelete = (topicIndex, topicId, remove) => {
    remove(topicIndex);
    dispatch(removeModel({ modelType: 'discussionTopics', id: topicId }));
    const updatedDividedCourseWideDiscussionsIds = dividedCourseWideDiscussionsIds.filter(
      (id) => id !== topicId,
    );
    setFieldValue('dividedCourseWideDiscussionsIds', updatedDividedCourseWideDiscussionsIds);
  };

  const addNewTopic = (push) => {
    const payload = { name: '', id: uuid() };
    push(payload);
    setFieldValue('dividedCourseWideDiscussionsIds', [...dividedCourseWideDiscussionsIds, payload.id]);
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
              {
                topics.map((topic, index) => (
                  <TopicItem
                    {...topic}
                    key={`topic-${topic.id}`}
                    index={index}
                    onDelete={() => handleTopicDelete(index, topic.id, remove)}
                  />
                ))

              }
              <div className="mb-4">
                <Add />
                <Button
                  onClick={() => addNewTopic(push)}
                  variant="link"
                  size="inline"
                  className="mr-1 text-primary-500"
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
