import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Button, Form, Hyperlink, ModalLayer, Spinner, TransitionReplace,
} from '@edx/paragon';

import { RequestStatus } from '../../data/constants';
import FormSwitchGroup from '../../generic/FormSwitchGroup';
import { useModel } from '../../generic/model-store';
import StatusBadge from '../../generic/status-badge/StatusBadge';
import { getLoadingStatus } from '../data/selectors';
import { updateAppStatus } from '../data/thunks';
import AppConfigFormDivider from '../discussions/app-config-form/apps/shared/AppConfigFormDivider';
import { PagesAndResourcesContext } from '../PagesAndResourcesProvider';
import messages from './messages';

function AppSettingsForm({ formikProps, children }) {
  return children && (
    <TransitionReplace>
      {formikProps.values.enabled
        ? (
          <React.Fragment key="app-enabled">
            {children(formikProps)}
          </React.Fragment>
        ) : (
          <React.Fragment key="app-disabled" />
        )}
    </TransitionReplace>
  );
}

AppSettingsForm.propTypes = {
  formikProps: PropTypes.shape({
    values: PropTypes.shape({ enabled: PropTypes.bool.isRequired }),
  }).isRequired,
  children: PropTypes.func,
};

AppSettingsForm.defaultProps = {
  children: null,
};

function AppSettingsModal({
  intl,
  appId,
  title,
  children,
  initialValues,
  validationSchema,
  onClose,
  onSettingsSave,
  enableAppLabel,
  enableAppHelp,
  learnMoreURL,
  learnMoreText,
}) {
  const { courseId } = useContext(PagesAndResourcesContext);
  const loadingStatus = useSelector(getLoadingStatus);
  const appInfo = useModel('courseApps', appId);
  const dispatch = useDispatch();
  const handleFormSubmit = (values) => {
    // If the app's enabled/disabled loadingStatus has changed, set that first.
    if (appInfo.enabled !== values.enabled) {
      dispatch(updateAppStatus(courseId, appInfo.id, values.enabled, true));
    }
    // Call the submit handler for the settings component to save its settings
    if (onSettingsSave) {
      onSettingsSave();
    }
  };
  const learnMoreLink = (
    <Hyperlink
      destination={learnMoreURL}
      target="_blank"
      rel="noreferrer noopener"
    >
      {learnMoreText}
    </Hyperlink>
  );

  return (
    <ModalLayer
      isOpen
      closeText={intl.formatMessage(messages.cancel)}
      dialogClassName="modal-dialog-centered modal-lg"
      onClose={onClose}
    >
      <div
        role="dialog"
        aria-label={title}
        className="bg-white d-flex flex-column mw-xs p-3"
      >
        {
          loadingStatus === RequestStatus.SUCCESSFUL && (
            <Formik
              initialValues={{
                enabled: !!appInfo?.enabled,
                ...initialValues,
              }}
              validationSchema={
                Yup.object()
                  .shape({
                    enabled: Yup.boolean(),
                    ...validationSchema,
                  })
              }
              onSubmit={handleFormSubmit}
            >{(formikProps) => (
              <Form onSubmit={formikProps.handleSubmit}>
                <h3>{title}</h3>
                <FormSwitchGroup
                  id={`enable-${appId}-toggle`}
                  name="enabled"
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  checked={formikProps.values.enabled}
                  label={(
                    <>
                      {enableAppLabel}&nbsp;
                      <StatusBadge status={formikProps.values.enabled} />
                    </>
                  )}
                  helpText={(<p>{enableAppHelp}<br />{learnMoreLink}</p>)}
                />
                <AppSettingsForm formikProps={formikProps}>
                  {children}
                </AppSettingsForm>
                {formikProps.values.enabled && children
                  && <AppConfigFormDivider marginAdj={{ default: 3, sm: null }} />}
                <div className="d-flex justify-content-end">
                  <Button variant="cancel" className="btn btn-link" onClick={onClose}>
                    {intl.formatMessage(messages.cancel)}
                  </Button>
                  <Button type="submit" variant="success" data-autofocus>
                    {intl.formatMessage(messages.apply)}
                  </Button>
                </div>
              </Form>
            )}
            </Formik>
          )
        }
        {loadingStatus === RequestStatus.IN_PROGRESS && (
          <Spinner animation="border" variant="primary" className="align-self-center" />
        )}
      </div>
    </ModalLayer>
  );
}

AppSettingsModal.propTypes = {
  intl: intlShape.isRequired,
  title: PropTypes.string.isRequired,
  appId: PropTypes.string.isRequired,
  children: PropTypes.func,
  onSettingsSave: PropTypes.func,
  initialValues: PropTypes.objectOf(PropTypes.any),
  validationSchema: PropTypes.objectOf(PropTypes.func),
  onClose: PropTypes.func.isRequired,
  enableAppLabel: PropTypes.string.isRequired,
  enableAppHelp: PropTypes.string.isRequired,
  learnMoreURL: PropTypes.string.isRequired,
  learnMoreText: PropTypes.string.isRequired,
};

AppSettingsModal.defaultProps = {
  children: null,
  onSettingsSave: null,
  initialValues: {},
  validationSchema: {},
};

export default injectIntl(AppSettingsModal);
