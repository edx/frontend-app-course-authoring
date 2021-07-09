import React from 'react';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Spinner } from '@edx/paragon';

export default function Loading() {
  return (
    <div
      className="d-flex justify-content-center align-items-center flex-column"
      style={{
        height: '50vh',
      }}
    >
      <Spinner className animation="border" role="status" variant="primary">
        <span className="sr-only">
          <FormattedMessage
            id="authoring.loading"
            defaultMessage="Loading..."
            description="Screen-reader message for when a page is loading."
          />
        </span>
      </Spinner>
    </div>
  );
}
