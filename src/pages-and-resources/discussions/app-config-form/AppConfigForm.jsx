import _ from 'lodash';
import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  ActionRow,
  Button,
  Container,
  ModalDialog,
} from '@edx/paragon';

import { useModel, useModels } from '../../../generic/model-store';
import { PagesAndResourcesContext } from '../../PagesAndResourcesProvider';
import {
  DENIED,
  FAILED, LOADED, LOADING, selectApp,
} from '../data/slice';
import { saveAppConfig } from '../data/thunks';

import messages from './messages';
import AppConfigFormProvider, { AppConfigFormContext } from './AppConfigFormProvider';
import AppConfigFormSaveButton from './AppConfigFormSaveButton';
import LegacyConfigForm from './apps/legacy';
import LtiConfigForm from './apps/lti';
import Loading from '../../../generic/Loading';
import SaveFormConnectionErrorAlert from '../../../generic/SaveFormConnectionErrorAlert';
import PermissionDeniedAlert from '../../../generic/PermissionDeniedAlert';

function AppConfigForm({
  courseId, intl,
}) {
  const dispatch = useDispatch();
  const { formRef } = useContext(AppConfigFormContext);
  const { path: pagesAndResourcesPath } = useContext(PagesAndResourcesContext);
  const { params: { appId: routeAppId } } = useRouteMatch();
  const {
    activeAppId, discussionTopicIds, divideDiscussionIds, selectedAppId, status, saveStatus,
  } = useSelector(state => state.discussions);
  const app = useModel('apps', selectedAppId);
  // appConfigs have no ID of their own, so we use the active app ID to reference them.
  // This appConfig may come back as null if the selectedAppId is not the activeAppId, i.e.,
  // if we're configuring a new app.
  const appConfigObj = useModel('appConfigs', selectedAppId);
  const discussionTopics = useModels('discussionTopics', discussionTopicIds);
  const appConfig = { ...appConfigObj, discussionTopics, divideDiscussionIds };

  const [confirmationDialogVisible, setConfirmationDialogVisible] = useState(false);

  useEffect(() => {
    if (status === LOADED) {
      if (routeAppId !== selectedAppId) {
        dispatch(selectApp({ appId: routeAppId }));
      }
    }
  }, [selectedAppId, routeAppId, status]);

  // This is a callback that gets called after the form has been submitted successfully.
  const handleSubmit = useCallback((values) => {
    const needsConfirmation = (activeAppId !== selectedAppId || !_.isEqual(values, appConfig));
    if (needsConfirmation && !confirmationDialogVisible) {
      setConfirmationDialogVisible(true);
    } else {
      setConfirmationDialogVisible(false);
      // Note that when this action succeeds, we redirect to pagesAndResurcesPath in the thunk.
      dispatch(saveAppConfig(courseId, selectedAppId, values, pagesAndResourcesPath));
    }
  }, [activeAppId, confirmationDialogVisible, courseId, selectedAppId]);

  if (!selectedAppId || status === LOADING) {
    return (
      <Loading />
    );
  }

  let alert = null;
  if (saveStatus === FAILED) {
    alert = (
      <SaveFormConnectionErrorAlert />
    );
  }
  if (saveStatus === DENIED) {
    alert = <PermissionDeniedAlert />;
  }

  let form = null;
  if (app.id === 'legacy') {
    form = (
      <LegacyConfigForm
        formRef={formRef}
        appConfig={appConfig}
        onSubmit={handleSubmit}
        title={intl.formatMessage(messages[`appName-${app.id}`])}
      />
    );
  } else {
    form = (
      <LtiConfigForm
        formRef={formRef}
        app={app}
        appConfig={appConfig}
        onSubmit={handleSubmit}
        title={intl.formatMessage(messages[`appName-${app.id}`])}
      />
    );
  }
  return (
    <Container size="sm" className="px-sm-0 py-sm-5 p-0" data-testid="appConfigForm">
      {alert}
      {form}
      <ModalDialog
        hasCloseButton={false}
        isOpen={confirmationDialogVisible}
        onClose={() => setConfirmationDialogVisible(false)}
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            {intl.formatMessage(messages.confirmConfigurationChange)}
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          {intl.formatMessage(messages.configurationChangeConsequence)}
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ActionRow>
            <Button
              onClick={() => setConfirmationDialogVisible(false)}
            >
              {intl.formatMessage(messages.backButton)}
            </Button>
            <AppConfigFormSaveButton />
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </Container>
  );
}

AppConfigForm.propTypes = {
  courseId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

const IntlAppConfigForm = injectIntl(AppConfigForm);

IntlAppConfigForm.Provider = AppConfigFormProvider;
IntlAppConfigForm.SaveButton = AppConfigFormSaveButton;

export default IntlAppConfigForm;
