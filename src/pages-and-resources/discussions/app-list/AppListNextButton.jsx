import React, { useCallback, useContext } from 'react';

import { useSelector } from 'react-redux';

import { history } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button } from '@edx/paragon';

import { DiscussionsContext } from '../DiscussionsProvider';
import messages from './messages';

function AppListNextButton({ intl }) {
  const { selectedAppId } = useSelector(state => state.discussions);
  const { path: discussionsPath } = useContext(DiscussionsContext);

  const handleStartConfig = useCallback(() => {
    history.push(`${discussionsPath}/configure/${selectedAppId}`);
  }, [discussionsPath, selectedAppId]);

  return (
    <Button
      variant="primary"
      onClick={handleStartConfig}
    >
      {intl.formatMessage(messages.nextButton)}
    </Button>
  );
}

AppListNextButton.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(AppListNextButton);
