import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Hyperlink, MailtoLink,
} from '@edx/paragon';

import messages from '../lti/messages';
import AppConfigFormDivider from './AppConfigFormDivider';

function AppExternalLinks({
  externalLinks,
  intl,
  title,
}) {
  const { contactEmail, ...links } = externalLinks;
  const linkTypes = Object.keys(links).filter(key => links[key]);
  return (
    <div className="pt-4">
      {linkTypes.length
        ? (
          <>
            <AppConfigFormDivider />
            <h4 className="pt-4">{intl.formatMessage(messages.linkTextHeading)}</h4>
            {linkTypes.map((type) => (
              <div key={type} className="small text-muted">
                <Hyperlink
                  destination={externalLinks[type]}
                  target="_blank"
                  rel="noopener noreferrer"
                  showLaunchIcon={false}
                >
                  { intl.formatMessage(messages[type], { title }) }
                </Hyperlink>
              </div>
            ))}
          </>
        ) : null}
      {contactEmail && (
        <div className="small text-muted">
          <hr />
          <FormattedMessage
            {...messages.contact}
            values={{
              link: (
                <MailtoLink
                  to={contactEmail}
                  rel="noopener noreferrer"
                >
                  { contactEmail }
                </MailtoLink>
              ),
            }}
          />
        </div>
      )}
    </div>
  );
}

AppExternalLinks.propTypes = {
  externalLinks: PropTypes.shape({
    learnMore: PropTypes.string,
    configuration: PropTypes.string,
    general: PropTypes.string,
    accessibility: PropTypes.string,
    contactEmail: PropTypes.string,
  }).isRequired,
  title: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(AppExternalLinks);
