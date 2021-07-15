import { history } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Button, Card, Icon, IconButton, Hyperlink,
} from '@edx/paragon';
import { ForwardArrow, Settings } from '@edx/paragon/icons';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import StatusBadge from '../../generic/status-badge/StatusBadge';
import messages from '../messages';
import { PagesAndResourcesContext } from '../PagesAndResourcesProvider';

const CoursePageShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  allowedOperations: PropTypes.shape({
    enable: PropTypes.bool.isRequired,
    configure: PropTypes.bool.isRequired,
  }).isRequired,
});

export { CoursePageShape };

function PageCard({
  intl,
  page,
}) {
  const { path: pagesAndResourcesPath } = useContext(PagesAndResourcesContext);

  const handleClick = () => {
    history.push(`${pagesAndResourcesPath}/${page.id}`);
  };

  const settingsButton = () => {
    if (page.legacyLink) {
      return (
        <Hyperlink destination={page.legacyLink}>
          <Icon
            className="mb-0 mr-1"
            src={ForwardArrow}
            size="inline"
            screenReaderText={intl.formatMessage(messages.settings)}
          />
        </Hyperlink>
      );
    }
    return (
      <IconButton
        className="mb-0 mr-1"
        src={Settings}
        iconAs={Icon}
        size="inline"
        alt={intl.formatMessage(messages.settings)}
        onClick={() => history.push(`${pagesAndResourcesPath}/${page.id}/settings`)}
      />
    );
  };

  return (
    <Card
      className="shadow card"
      style={{
        width: '19rem',
        height: '14rem',
      }}
    >
      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex mb-0 align-items-center justify-content-between">
          <h4 className="m-0 p-0">{page.name}</h4>
          {(page.allowedOperations.configure || page.allowedOperations.enable)
          && settingsButton()}
        </Card.Title>

        <div className="mb-2"><StatusBadge status={page.enabled} /></div>

        <Card.Text className="flex-grow-1 m-0">
          {page.description}
        </Card.Text>

        {(page.allowedOperations.enable && !page.enabled) && (
          <Button variant="outline-primary" size="sm" onClick={handleClick} className="align-self-end">
            {intl.formatMessage(messages['enable.button'])}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

PageCard.propTypes = {
  intl: intlShape.isRequired,
  page: CoursePageShape.isRequired,
};

export default injectIntl(PageCard);
