import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { TransitionReplace } from '@edx/paragon';

import FormSwitchGroup from '../../../../../generic/FormSwitchGroup';
import AppConfigFormDivider from './AppConfigFormDivider';
import messages from './messages';

function AnonymousPostingFields({
  onBlur,
  onChange,
  intl,
  values,
}) {
  return (
    <>
      <h5 className="mt-4 text-gray-500">{intl.formatMessage(messages.anonymousPosting)}</h5>
      <FormSwitchGroup
        onChange={onChange}
        onBlur={onBlur}
        id="allowAnonymousPosts"
        checked={values.allowAnonymousPosts}
        label={intl.formatMessage(messages.allowAnonymousPostsLabel)}
        helpText={intl.formatMessage(messages.allowAnonymousPostsHelp)}
      />
      <TransitionReplace>
        {values.allowAnonymousPosts ? (
          <React.Fragment key="open">
            <AppConfigFormDivider />
            <FormSwitchGroup
              onChange={onChange}
              onBlur={onBlur}
              className="ml-4"
              id="allowAnonymousPostsPeers"
              checked={values.allowAnonymousPostsPeers}
              label={intl.formatMessage(messages.allowAnonymousPostsPeersLabel)}
              helpText={intl.formatMessage(messages.allowAnonymousPostsPeersHelp)}
            />
          </React.Fragment>
        ) : <React.Fragment key="closed" />}
      </TransitionReplace>
    </>
  );
}

AnonymousPostingFields.propTypes = {
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  values: PropTypes.shape({
    allowAnonymousPosts: PropTypes.bool,
    allowAnonymousPostsPeers: PropTypes.bool,
  }).isRequired,
};

export default injectIntl(AnonymousPostingFields);
