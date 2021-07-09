import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button } from '@edx/paragon';

import messages from '../messages';

function ResourceList({ intl, resources }) {
  return (
    <div>
      <h3 className="text-info-500">{intl.formatMessage(messages['resources.subheading'])}</h3>
      <div className="row bg-light-100 text-info-500 border shadow justify-content-center align-items-center my-3 mx-1">
        <div className="col-1 font-weight-bold">{intl.formatMessage(messages['resources.custom.title'])}</div>
        <div className="col-8 my-3">
          {intl.formatMessage(messages['resources.custom.description'])}
        </div>
        <div className="col-2 text-right">
          <Button variant="outline-primary">
            {intl.formatMessage(messages['resources.newPage.button'])}
          </Button>
        </div>
      </div>
      {resources}
    </div>
  );
}

const resourcesShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  // TODO: What is the shape of a resources model?
});

ResourceList.propTypes = {
  resources: PropTypes.arrayOf(resourcesShape),
  intl: intlShape.isRequired,
};

ResourceList.defaultProps = {
  resources: [],
};

export default injectIntl(ResourceList);
