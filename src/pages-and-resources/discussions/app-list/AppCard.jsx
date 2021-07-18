import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import Responsive from 'react-responsive';
import {
  Card, CheckboxControl, breakpoints,
} from '@edx/paragon';
import messages from './messages';
import FeaturesList from './FeaturesList';

function AppCard({
  app, disabled, onClick, intl, selected, features,
}) {
  const supportText = app.hasFullSupport
    ? intl.formatMessage(messages.appFullSupport)
    : intl.formatMessage(messages.appPartialSupport);

  const handleCardSelect = () => {
    if (!disabled) {
      onClick(app.id);
    }
  };

  return (
    <Card
      key={app.id}
      tabIndex="-1"
      onClick={handleCardSelect}
      onKeyPress={handleCardSelect}
      role="radio"
      aria-checked={selected}
      style={{
        cursor: 'pointer',
      }}
      className={classNames({
        'border-primary': selected,
      }, 'w-100')}
    >
      <div
        className="position-absolute mt-3 mr-3"
        style={{
          top: '0.75rem',
          right: '0.75rem',
        }}
      >
        <CheckboxControl
          checked={selected}
          disabled={disabled}
          readOnly
          aria-label={intl.formatMessage(messages.selectApp, {
            appName: intl.formatMessage(messages[`appName-${app.id}`]),
          })}
        />
      </div>
      <Card.Body className="m-2">
        <div className="h4 card-title">
          {intl.formatMessage(messages[`appName-${app.id}`])}
        </div>
        <Card.Subtitle className="mb-3 text-muted">{supportText}</Card.Subtitle>
        <Card.Text>{intl.formatMessage(messages[`appDescription-${app.id}`])}</Card.Text>
        <Responsive maxWidth={breakpoints.extraSmall.maxWidth}>
          <FeaturesList
            features={features}
            app={app}
          />
        </Responsive>
      </Card.Body>
    </Card>
  );
}

AppCard.propTypes = {
  app: PropTypes.shape({
    id: PropTypes.string.isRequired,
    featureIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    hasFullSupport: PropTypes.bool.isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
};

AppCard.defaultProps = {
  disabled: false,
};

export default injectIntl(AppCard);
