import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Form, Hyperlink, ModalDialog, Spinner, TransitionReplace,
  StatefulButton, Badge, ActionRow,
} from '@edx/paragon';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useMediaQuery } from 'react-responsive/src';
import { RequestStatus } from '../../data/constants';
import FormSwitchGroup from '../../generic/FormSwitchGroup';
import { useModel } from '../../generic/model-store';
import { getLoadingStatus, getSavingStatus } from '../data/selectors';
import { updateAppStatus } from '../data/thunks';
import { updateSavingStatus } from '../data/slice';
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
  const updateSettingsRequestStatus = useSelector(getSavingStatus);
  const appInfo = useModel('courseApps', appId);
  const dispatch = useDispatch();
  const submitButtonState = updateSettingsRequestStatus === RequestStatus.IN_PROGRESS ? 'pending' : 'default';
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const modalVariant = isTabletOrMobile ? 'dark' : 'default';

  useEffect(() => {
    if (updateSettingsRequestStatus === RequestStatus.SUCCESSFUL) {
      dispatch(updateSavingStatus({ status: '' }));
      onClose();
    }
  }, [updateSettingsRequestStatus]);

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
      className="text-primary-500"
      destination={learnMoreURL}
      target="_blank"
      rel="noreferrer noopener"
    >
      {learnMoreText}
    </Hyperlink>
  );

  return (
    <ModalDialog
      isOpen
      closeText={intl.formatMessage(messages.cancel)}
      dialogClassName="modal-dialog-centered modal-lg"
      hasCloseButton={isTabletOrMobile}
      onClose={onClose}
      variant={modalVariant}
      isFullscreenOnMobile
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
          >
            {(formikProps) => (
              <Form onSubmit={formikProps.handleSubmit}>
                <ModalDialog.Header>
                  <ModalDialog.Title>
                    {title}
                  </ModalDialog.Title>
                </ModalDialog.Header>
                <ModalDialog.Body>
                  <FormSwitchGroup
                    id={`enable-${appId}-toggle`}
                    name="enabled"
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    checked={formikProps.values.enabled}
                    label={(
                      <>
                        {enableAppLabel}&nbsp;
                        {
                          formikProps.values.enabled && (
                            <Badge className="py-1" variant="success">
                              {intl.formatMessage(messages.enabled)}
                            </Badge>
                          )
                        }
                      </>
                    )}
                    helpText={(<p>{enableAppHelp}<br /> <span className="pt-3">{learnMoreLink}</span></p>)}
                  />
                  <AppSettingsForm formikProps={formikProps}>
                    {children}
                  </AppSettingsForm>
                </ModalDialog.Body>

                {formikProps.values.enabled && children
                  && <AppConfigFormDivider marginAdj={{ default: 3, sm: null }} />}

                <ModalDialog.Footer style={{ position: 'absolute', width: '100%' }}>
                  <ActionRow>
                    <ModalDialog.CloseButton variant="tertiary">
                      {intl.formatMessage(messages.cancel)}
                    </ModalDialog.CloseButton>
                    <StatefulButton
                      labels={{
                        default: intl.formatMessage(messages.apply),
                        pending: intl.formatMessage(messages.applying),
                        complete: intl.formatMessage(messages.applied),
                      }}
                      state={submitButtonState}
                      onClick={formikProps.handleSubmit}
                    />
                  </ActionRow>
                </ModalDialog.Footer>
              </Form>
            )}
          </Formik>
        )
      }
      {loadingStatus === RequestStatus.IN_PROGRESS && (
        <Spinner animation="border" variant="primary" className="align-self-center" />
      )}
    </ModalDialog>
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
