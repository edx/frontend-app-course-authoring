import React from 'react';
import PropTypes from 'prop-types';

import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import AppSettingsModal from '../app-settings-modal/AppSettingsModal';
import messages from './messages';

const EDXNOTES_HELP_URL = getConfig().EDXNOTES_HELP_URL
  || 'https://edx.readthedocs.io/projects/open-edx-building-and-running-a-course/en/latest/exercises_tools/notes.html';

function NotesSettings({ intl, onClose }) {
  return (
    <AppSettingsModal
      appId="edxnotes"
      title={intl.formatMessage(messages.heading)}
      enableAppHelp={intl.formatMessage(messages.enableNotesHelp)}
      enableAppLabel={intl.formatMessage(messages.enableNotesLabel)}
      learnMoreText={intl.formatMessage(messages.enableNotesLink)}
      learnMoreURL={EDXNOTES_HELP_URL}
      onClose={onClose}
    />
  );
}

NotesSettings.propTypes = {
  intl: intlShape.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default injectIntl(NotesSettings);
