import React from 'react';
import PropTypes from 'prop-types';

import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import AppSettingsModal from '../app-settings-modal/AppSettingsModal';
import messages from './messages';

const CALCULATOR_HELP_URL = getConfig().CALCULATOR_HELP_URL
  || 'https://edx.readthedocs.io/projects/open-edx-building-and-running-a-course/en/latest/exercises_tools/calculator.html';

function CalculatorSettings({ intl, onClose }) {
  return (
    <AppSettingsModal
      appId="calculator"
      title={intl.formatMessage(messages.heading)}
      enableAppHelp={intl.formatMessage(messages.enableProgressHelp)}
      enableAppLabel={intl.formatMessage(messages.enableProgressLabel)}
      learnMoreText={intl.formatMessage(messages.enableProgressLink)}
      learnMoreURL={CALCULATOR_HELP_URL}
      onClose={onClose}
    />
  );
}

CalculatorSettings.propTypes = {
  intl: intlShape.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default injectIntl(CalculatorSettings);
