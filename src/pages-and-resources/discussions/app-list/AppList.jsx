import React, { useCallback, useEffect } from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { CardGrid, Container, breakpoints } from '@edx/paragon';
import { useDispatch, useSelector } from 'react-redux';
import Responsive from 'react-responsive';
import PropTypes from 'prop-types';
import { useModels } from '../../../generic/model-store';
import {
  selectApp, LOADED, LOADING,
  updateValidationStatus,
} from '../data/slice';
import AppCard from './AppCard';
import messages from './messages';
import FeaturesTable from './FeaturesTable';
import AppListNextButton from './AppListNextButton';
import Loading from '../../../generic/Loading';

function AppList({ disabled, intl }) {
  const dispatch = useDispatch();

  const {
    appIds, featureIds, status, activeAppId, selectedAppId,
  } = useSelector(state => state.discussions);
  const apps = useModels('apps', appIds);
  const features = useModels('features', featureIds);

  // This could be a bit confusing.  activeAppId is the ID of the app that is currently configured
  // according to the server.  selectedAppId is the ID of the app that we _want_ to configure here
  // in the UI.  The two don't always agree, and a selectedAppId may not yet be set when the app is
  // loaded.  This effect is responsible for setting a selected app based on the active app -
  // effectively defaulting to it - if a selected app hasn't been set yet.
  useEffect(() => {
    // If selectedAppId is not set, use activeAppId
    if (!selectedAppId) {
      dispatch(selectApp({ appId: activeAppId }));
    }
    dispatch(updateValidationStatus({ hasError: false }));
  }, [selectedAppId, activeAppId]);

  const handleSelectApp = useCallback((appId) => {
    dispatch(selectApp({ appId }));
  }, [selectedAppId]);

  if (!selectedAppId || status === LOADING) {
    return (
      <Loading />
    );
  }

  if (status === LOADED && apps.length === 0) {
    return (
      <Container className="mt-5">
        <p>{intl.formatMessage(messages.noApps)}</p>
      </Container>
    );
  }

  return (
    <div className="m-1  my-sm-5" data-testid="appList">
      <h3 className="my-sm-5 my-4">
        {intl.formatMessage(messages.heading)}
      </h3>
      <CardGrid
        columnSizes={{
          xs: 12,
          sm: 6,
          lg: 4,
        }}
      >
        {apps.map(app => (
          <AppCard
            key={app.id}
            app={app}
            disabled={disabled}
            selected={app.id === selectedAppId}
            onClick={handleSelectApp}
            features={features}
          />
        ))}
      </CardGrid>
      <Responsive minWidth={breakpoints.small.minWidth}>
        <h3 className="my-sm-5 my-4">
          {intl.formatMessage(messages.supportedFeatures)}
        </h3>
        <div className="app-list-data-table">
          <FeaturesTable
            apps={apps}
            features={features}
          />
        </div>
      </Responsive>
    </div>
  );
}

AppList.propTypes = {
  disabled: PropTypes.bool,
  intl: intlShape.isRequired,
};

AppList.defaultProps = {
  disabled: false,
};

const IntlAppList = injectIntl(AppList);

IntlAppList.NextButton = AppListNextButton;

export default IntlAppList;
