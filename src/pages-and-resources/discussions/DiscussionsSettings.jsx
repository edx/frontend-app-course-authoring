import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import {
  useRouteMatch,
} from 'react-router';

import { history } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Button, FullscreenModal, Stepper,
} from '@edx/paragon';

import ConnectionErrorAlert from '../../generic/ConnectionErrorAlert';
import PermissionDeniedAlert from '../../generic/PermissionDeniedAlert';
import { PagesAndResourcesContext } from '../PagesAndResourcesProvider';
import { DENIED, FAILED } from './data/slice';
import { fetchApps } from './data/thunks';
import AppConfigForm from './app-config-form';
import AppList from './app-list';
import DiscussionsProvider from './DiscussionsProvider';
import messages from './messages';

const SELECTION_STEP = 'selection';
const SETTINGS_STEP = 'settings';

function DiscussionsSettings({ courseId, intl }) {
  const dispatch = useDispatch();
  const { path: pagesAndResourcesPath } = useContext(PagesAndResourcesContext);
  const { status, hasValidationError } = useSelector(state => state.discussions);

  useEffect(() => {
    dispatch(fetchApps(courseId));
  }, [courseId]);

  const discussionsPath = `${pagesAndResourcesPath}/discussion`;
  const { params: { appId } } = useRouteMatch();

  const startStep = appId ? SETTINGS_STEP : SELECTION_STEP;
  const [currentStep, setCurrentStep] = useState(startStep);

  useEffect(() => {
    setCurrentStep(appId ? SETTINGS_STEP : SELECTION_STEP);
  }, [appId]);

  const handleClose = useCallback(() => {
    history.push(pagesAndResourcesPath);
  }, [pagesAndResourcesPath]);

  const handleBack = useCallback(() => {
    history.push(discussionsPath);
  }, [discussionsPath]);

  if (status === FAILED) {
    return (
      <FullscreenModal
        className="bg-light-200"
        title={intl.formatMessage(messages.configure)}
        onClose={handleClose}
        isOpen
      >
        <ConnectionErrorAlert />
      </FullscreenModal>
    );
  }

  if (status === DENIED) {
    return (
      <FullscreenModal
        className="bg-light-200"
        title={intl.formatMessage(messages.configure)}
        onClose={handleClose}
        isOpen
      >
        <PermissionDeniedAlert />
      </FullscreenModal>
    );
  }

  return (
    <DiscussionsProvider path={discussionsPath}>
      <AppConfigForm.Provider>
        <Stepper activeKey={currentStep}>
          <FullscreenModal
            className="bg-light-200"
            modalBodyClassName="px-sm-4"
            title={intl.formatMessage(messages.configure)}
            onClose={handleClose}
            isOpen
            beforeBodyNode={<Stepper.Header className="border-bottom border-light" />}
            footerNode={(
              <>
                <Stepper.ActionRow eventKey={SELECTION_STEP}>
                  <AppList.NextButton />
                </Stepper.ActionRow>
                <Stepper.ActionRow eventKey={SETTINGS_STEP}>
                  <div className="d-flex w-100 justify-content-between">
                    <Button
                      variant="outline-primary"
                      onClick={handleBack}
                    >
                      {intl.formatMessage(messages.backButton)}
                    </Button>
                    <AppConfigForm.SaveButton />
                  </div>
                </Stepper.ActionRow>
              </>
            )}
          >
            <Stepper.Step
              eventKey={SELECTION_STEP}
              title={intl.formatMessage(messages.providerSelection)}
            >
              <AppList />
            </Stepper.Step>
            <Stepper.Step
              eventKey={SETTINGS_STEP}
              title={intl.formatMessage(messages.settings)}
              description={hasValidationError ? intl.formatMessage(messages.Incomplete) : ''}
              hasError={hasValidationError}
            >
              <AppConfigForm
                courseId={courseId}
              />
            </Stepper.Step>
          </FullscreenModal>
        </Stepper>
      </AppConfigForm.Provider>
    </DiscussionsProvider>
  );
}

DiscussionsSettings.propTypes = {
  courseId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(DiscussionsSettings);
