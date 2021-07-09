import React from 'react';
import PropTypes from 'prop-types';

import * as Yup from 'yup';

import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import FormSwitchGroup from '../../generic/FormSwitchGroup';
import AppSettingsModal from '../app-settings-modal/AppSettingsModal';
import messages from './messages';

const PROGRESS_HELP_URL = getConfig().PROGRESS_HELP_URL
  || 'https://edx.readthedocs.io/projects/open-edx-building-and-running-a-course/en/latest/student_progress/index.html';

function ProgressSettings({ intl, onClose }) {
  // TODO: Save settings using APIs here
  const handleSettingsSave = () => null;
  return (
    <AppSettingsModal
      appId="progress"
      title={intl.formatMessage(messages.heading)}
      enableAppHelp={intl.formatMessage(messages.enableProgressHelp)}
      enableAppLabel={intl.formatMessage(messages.enableProgressLabel)}
      learnMoreText={intl.formatMessage(messages.enableProgressLink)}
      learnMoreURL={PROGRESS_HELP_URL}
      onClose={onClose}
      // TODO: fetch these values from the redux store, via APIs
      initialValues={{ enableProgressGraph: false }}
      validationSchema={{ enableProgressGraph: Yup.boolean() }}
      onSettingsSave={handleSettingsSave}
    >
      {
        ({ handleChange, handleBlur, values }) => (
          <FormSwitchGroup
            id="enable-progress-graph"
            name="enableProgressGraph"
            label={intl.formatMessage(messages.enableGraphLabel)}
            helpText={intl.formatMessage(messages.enableGraphHelp)}
            onChange={handleChange}
            onBlur={handleBlur}
            checked={values.enableProgressGraph}
          />
        )
      }
    </AppSettingsModal>
  );
}

ProgressSettings.propTypes = {
  intl: intlShape.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default injectIntl(ProgressSettings);
