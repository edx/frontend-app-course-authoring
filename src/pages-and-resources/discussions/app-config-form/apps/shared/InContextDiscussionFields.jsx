import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { TransitionReplace } from '@edx/paragon';

import FormSwitchGroup from '../../../../../generic/FormSwitchGroup';
import AppConfigFormDivider from './AppConfigFormDivider';
import messages from './messages';

function InContextDiscussionFields({
  onBlur,
  onChange,
  intl,
  values,
}) {
  return (
    <>
      <h5 className="text-gray-500 mt-4">{intl.formatMessage(messages.visibilityInContext)}</h5>
      <FormSwitchGroup
        onChange={onChange}
        onBlur={onBlur}
        id="inContextDiscussion"
        checked={values.inContextDiscussion}
        label={intl.formatMessage(messages.inContextDiscussionLabel)}
        helpText={intl.formatMessage(messages.inContextDiscussionHelp)}
      />
      <TransitionReplace>
        {values.inContextDiscussion ? (
          <React.Fragment key="open">
            <AppConfigFormDivider />
            <FormSwitchGroup
              onChange={onChange}
              onBlur={onBlur}
              className="ml-4"
              id="gradedUnitPages"
              checked={values.gradedUnitPages}
              label={intl.formatMessage(messages.gradedUnitPagesLabel)}
              helpText={intl.formatMessage(messages.gradedUnitPagesHelp)}
            />
            <AppConfigFormDivider />
            <FormSwitchGroup
              onChange={onChange}
              onBlur={onBlur}
              className="ml-4"
              id="groupInContextSubsection"
              checked={values.groupInContextSubsection}
              label={intl.formatMessage(messages.groupInContextSubsectionLabel)}
              helpText={intl.formatMessage(messages.groupInContextSubsectionHelp)}
            />
            <AppConfigFormDivider />
            <FormSwitchGroup
              onChange={onChange}
              onBlur={onBlur}
              className="ml-4"
              id="allowUnitLevelVisibility"
              checked={values.allowUnitLevelVisibility}
              label={intl.formatMessage(messages.allowUnitLevelVisibilityLabel)}
              helpText={intl.formatMessage(messages.allowUnitLevelVisibilityHelp)}
            />
          </React.Fragment>
        ) : <React.Fragment key="closed" />}

      </TransitionReplace>
    </>
  );
}

InContextDiscussionFields.propTypes = {
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  values: PropTypes.shape({
    inContextDiscussion: PropTypes.bool,
    gradedUnitPages: PropTypes.bool,
    groupInContextSubsection: PropTypes.bool,
    allowUnitLevelVisibility: PropTypes.bool,
  }).isRequired,
};

export default injectIntl(InContextDiscussionFields);
