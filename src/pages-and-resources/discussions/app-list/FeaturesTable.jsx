import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { DataTable } from '@edx/paragon';
import { Check, Remove } from '@edx/paragon/icons';

import messages from './messages';

function FeaturesTable({ apps, features, intl }) {
  return (
    <DataTable
      itemCount={features.length}
      data={features.map(feature => {
        const appCheckmarkCells = {};
        // DataTable wants 'data' to be an array of objects where each property of an object
        // represents a cell in that row, identified by its key.
        apps.forEach(app => {
          // If our app's set of feature Ids includes this feature, return a checkmark.
          // i.e, if this app has the current feature, check it!
          appCheckmarkCells[app.id] = (
            <div
              className="text-center"
              key={`${app.id}&${feature.id}`}
              data-testid={`${app.id}-${feature.id.replaceAll('.', '-')}`}
            >
              {
                app.featureIds.includes(feature.id)
                  ? <Check id="check-icon" className="text-success-500" />
                  : <Remove id="remove-icon" className="text-light-700" />
              }
            </div>
          );
        });

        return {
          feature: intl.formatMessage(messages[`featureName-${feature.id}`]), // 'feature' is the identifier for cells in the first column.
          // This is spreading the app IDs from appCheckmarkCells into the return array, creating
          // one object with 'feature' and the app.id keys from above.  The values are the JSX
          // above with the font awesome checkmarks in 'em
          ...appCheckmarkCells,
        };
      })}
      columns={[
        {
          Header: '',
          accessor: 'feature',
        },
        // We're converting our apps array into a bunch of objects with "Header" and "accessor"
        // keys, like DataTable expects.
        ...apps.map(app => ({
          Header: intl.formatMessage(messages[`appName-${app.id}`]),
          accessor: app.id,
        })),
      ]}
    >
      <DataTable.Table />
    </DataTable>
  );
}

export default injectIntl(FeaturesTable);

FeaturesTable.propTypes = {
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
  intl: intlShape.isRequired,
};
