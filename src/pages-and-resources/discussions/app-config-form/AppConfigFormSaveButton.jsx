import React, { useCallback, useContext } from 'react';

import { useSelector } from 'react-redux';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { StatefulButton } from '@edx/paragon';

import { SAVING } from '../data/slice';
import { AppConfigFormContext } from './AppConfigFormProvider';
import messages from './messages';

function AppConfigFormSaveButton({ intl }) {
  const saveStatus = useSelector(state => state.discussions.saveStatus);
  const { formRef } = useContext(AppConfigFormContext);

  const submitButtonState = saveStatus === SAVING ? 'pending' : 'default';

  // This causes the form to be submitted from a button outside the form.
  const handleSave = useCallback(() => {
    formRef.current.requestSubmit();
  }, [formRef]);

  return (
    <StatefulButton
      labels={{
        default: intl.formatMessage(messages.saveButton),
        pending: intl.formatMessage(messages.savingButton),
        complete: intl.formatMessage(messages.savedButton),
      }}
      state={submitButtonState}
      onClick={handleSave}
    />
  );
}

AppConfigFormSaveButton.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(AppConfigFormSaveButton);
