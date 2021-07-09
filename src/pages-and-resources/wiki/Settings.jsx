import React from 'react';
import PropTypes from 'prop-types';

import * as Yup from 'yup';

import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import FormSwitchGroup from '../../generic/FormSwitchGroup';
import AppSettingsModal from '../app-settings-modal/AppSettingsModal';
import messages from './messages';

const WIKI_HELP_URL = getConfig().WIKI_HELP_URL
  || 'https://edx.readthedocs.io/projects/open-edx-building-and-running-a-course/en/latest/exercises_tools/calculator.html';

function WikiSettings({ intl, onClose }) {
  // TODO: Save settings using APIs here
  const handleSettingsSave = () => null;
  return (
    <AppSettingsModal
      appId="wiki"
      title={intl.formatMessage(messages.heading)}
      enableAppHelp={intl.formatMessage(messages.enableWikiHelp)}
      enableAppLabel={intl.formatMessage(messages.enableWikiLabel)}
      learnMoreText={intl.formatMessage(messages.enableWikiLink)}
      learnMoreURL={WIKI_HELP_URL}
      onClose={onClose}
      // TODO: fetch these values from the redux store, via APIs
      initialValues={{ enablePublicWiki: false }}
      validationSchema={{ enablePublicWiki: Yup.boolean() }}
      onSettingsSave={handleSettingsSave}
    >
      {
        ({ values, handleChange, handleBlur }) => (
          <FormSwitchGroup
            id="enable-public-wiki"
            name="enablePublicWiki"
            label={intl.formatMessage(messages.enablePublicWikiLabel)}
            helpText={intl.formatMessage(messages.enablePublicWikiHelp)}
            onChange={handleChange}
            onBlue={handleBlur}
            checked={values.enablePublicWiki}
          />
        )
      }
    </AppSettingsModal>
  );
}

WikiSettings.propTypes = {
  intl: intlShape.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default injectIntl(WikiSettings);
