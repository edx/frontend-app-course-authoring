import React from 'react';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Alert } from '@edx/paragon';

function PermissionDeniedAlert() {
  return (
    <Alert variant="danger" data-testid="permissionDeniedAlert">
      <FormattedMessage
        id="authoring.alert.error.permission"
        defaultMessage="You are not authorized to view this page. If you feel you should have access, please reach out to your course team admin to be given access."
      />
    </Alert>
  );
}

export default PermissionDeniedAlert;
