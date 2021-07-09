import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import EmailValidator from 'email-validator';
import moment from 'moment';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import {
  Alert, Button, Form, Spinner,
} from '@edx/paragon';

import StudioApiService from '../data/services/StudioApiService';
import ConnectionErrorAlert from '../generic/ConnectionErrorAlert';
import Loading from '../generic/Loading';
import PermissionDeniedAlert from '../generic/PermissionDeniedAlert';
import messages from './ProctoredExamSettings.messages';

function ProctoredExamSettings({ courseId, intl }) {
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [loadingConnectionError, setLoadingConnectionError] = useState(false);
  const [loadingPermissionError, setLoadingPermissionError] = useState(false);
  const [enableProctoredExams, setEnableProctoredExams] = useState(true);
  const [allowOptingOut, setAllowOptingOut] = useState(false);
  const [proctoringProvider, setProctoringProvider] = useState('');
  const [availableProctoringProviders, setAvailableProctoringProviders] = useState([]);
  const [proctortrackEscalationEmail, setProctortrackEscalationEmail] = useState('');
  const [createZendeskTickets, setCreateZendeskTickets] = useState(false);
  const [courseStartDate, setCourseStartDate] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  const [showProctortrackEscalationEmail, setShowProctortrackEscalationEmail] = useState(false);
  const isEdxStaff = getAuthenticatedUser().administrator;
  const [formStatus, setFormStatus] = useState({
    isValid: true,
    errors: {},
  });

  const alertRef = React.createRef();
  const saveStatusAlertRef = React.createRef();
  const proctoringEscalationEmailInputRef = useRef(null);

  function onEnableProctoredExamsChange(event) {
    setEnableProctoredExams(event.target.checked);
  }

  function onAllowOptingOutChange(value) {
    setAllowOptingOut(value);
  }

  function onCreateZendeskTicketsChange(value) {
    setCreateZendeskTickets(value);
  }

  function onProctoringProviderChange(event) {
    const provider = event.target.value;
    setProctoringProvider(provider);

    if (provider === 'proctortrack') {
      setCreateZendeskTickets(false);
      setShowProctortrackEscalationEmail(true);
    } else {
      if (provider === 'software_secure') {
        setCreateZendeskTickets(true);
      }
      setShowProctortrackEscalationEmail(false);
    }
  }

  function onProctortrackEscalationEmailChange(event) {
    setProctortrackEscalationEmail(event.target.value);
  }

  function setFocusToProctortrackEscalationEmailInput() {
    if (proctoringEscalationEmailInputRef && proctoringEscalationEmailInputRef.current) {
      proctoringEscalationEmailInputRef.current.focus();
    }
  }

  function postSettingsBackToServer() {
    const dataToPostBack = {
      proctored_exam_settings: {
        enable_proctored_exams: enableProctoredExams,
        proctoring_provider: proctoringProvider,
        create_zendesk_tickets: createZendeskTickets,
      },
    };
    if (isEdxStaff) {
      dataToPostBack.proctored_exam_settings.allow_proctoring_opt_out = allowOptingOut;
    }

    if (proctoringProvider === 'proctortrack') {
      dataToPostBack.proctored_exam_settings.proctoring_escalation_email = proctortrackEscalationEmail === '' ? null : proctortrackEscalationEmail;
    }

    setSubmissionInProgress(true);
    StudioApiService.saveProctoredExamSettingsData(courseId, dataToPostBack).then(() => {
      setSaveSuccess(true);
      setSaveError(false);
      setSubmissionInProgress(false);
    }).catch(() => {
      setSaveSuccess(false);
      setSaveError(true);
      setSubmissionInProgress(false);
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (proctoringProvider === 'proctortrack' && !EmailValidator.validate(proctortrackEscalationEmail) && !(proctortrackEscalationEmail === '' && !enableProctoredExams)) {
      if (proctortrackEscalationEmail === '') {
        const errorMessage = intl.formatMessage(messages['authoring.examsettings.escalationemail.error.blank']);

        setFormStatus({
          isValid: false,
          errors: {
            formProctortrackEscalationEmail: {
              dialogErrorMessage: (<Alert.Link onClick={setFocusToProctortrackEscalationEmailInput} href="#formProctortrackEscalationEmail" data-testid="proctorTrackEscalationEmailErrorLink">{errorMessage}</Alert.Link>),
              inputErrorMessage: errorMessage,
            },
          },
        });
      } else {
        const errorMessage = intl.formatMessage(messages['authoring.examsettings.escalationemail.error.invalid']);

        setFormStatus({
          isValid: false,
          errors: {
            formProctortrackEscalationEmail: {
              dialogErrorMessage: (<Alert.Link onClick={setFocusToProctortrackEscalationEmailInput} href="#formProctortrackEscalationEmail" data-testid="proctorTrackEscalationEmailErrorLink">{errorMessage}</Alert.Link>),
              inputErrorMessage: errorMessage,
            },
          },
        });
      }
    } else {
      postSettingsBackToServer();
      const errors = { ...formStatus.errors };
      delete errors.formProctortrackEscalationEmail;
      setFormStatus({
        isValid: true,
        errors,
      });
    }
  }

  function cannotEditProctoringProvider() {
    const currentDate = moment(moment()).format('YYYY-MM-DD[T]hh:mm:ss[Z]');
    const isAfterCourseStart = currentDate > courseStartDate;

    // if the user is not edX staff and it is after the course start date, user cannot edit proctoring provider
    return !isEdxStaff && isAfterCourseStart;
  }

  function isDisabledOption(provider) {
    let markDisabled = false;
    if (cannotEditProctoringProvider()) {
      markDisabled = provider !== proctoringProvider;
    }
    return markDisabled;
  }

  function getProctoringProviderOptions(providers) {
    return providers.map(provider => (
      <option
        key={provider}
        value={provider}
        disabled={isDisabledOption(provider)}
        data-testid={provider}
      >
        {provider}
      </option>
    ));
  }

  function getFormErrorMessage() {
    const numOfErrors = Object.keys(formStatus.errors).length;
    const errors = Object.entries(formStatus.errors).map(([id, error]) => <li key={id}>{error.dialogErrorMessage}</li>);
    const messageId = numOfErrors > 1 ? 'authoring.examsettings.error.multiple' : 'authoring.examsettings.error.single';

    return (
      <>
        <div>{intl.formatMessage(messages[messageId], { numOfErrors })}</div>
        <ul>
          {errors}
        </ul>
      </>
    );
  }

  function renderContent() {
    return (
      <Form onSubmit={handleSubmit} data-testid="proctoringForm">
        {!formStatus.isValid && formStatus.errors.formProctortrackEscalationEmail
          && (
            // tabIndex="-1" to make non-focusable element focusable
            <Alert
              id="proctortrackEscalationEmailError"
              variant="danger"
              tabIndex="-1"
              data-testid="proctortrackEscalationEmailError"
              ref={alertRef}
            >
              {getFormErrorMessage()}
            </Alert>
          )}
        {/* ENABLE PROCTORED EXAMS */}
        <Form.Group controlId="formEnableProctoredExam">
          <Form.Check
            type="checkbox"
            id="enableProctoredExams"
            label={intl.formatMessage(messages['authoring.examsettings.enableproctoredexams.label'])}
            aria-describedby="enableProctoredExamsHelpText"
            onChange={onEnableProctoredExamsChange}
            checked={enableProctoredExams}
            inline
          />
          <Form.Text id="enableProctoredExamsHelpText">
            <FormattedMessage
              id="authoring.examsettings.enableproctoredexams.help"
              defaultMessage="If checked, proctored exams are enabled in your course."
              description="Help text for checkbox to enable proctored exams."
            />
          </Form.Text>
        </Form.Group>

        {/* ALLOW OPTING OUT OF PROCTORED EXAMS */}
        { isEdxStaff && enableProctoredExams && (
          <fieldset aria-describedby="allowOptingOutHelpText">
            <Form.Group controlId="formAllowingOptingOut">
              <Form.Label as="legend">
                <FormattedMessage
                  id="authoring.examsettings.allowoptout.label"
                  defaultMessage="Allow Opting Out of Proctored Exams"
                  description="Label for radio selection allowing proctored exam opt out"
                />
              </Form.Label>
              <Form.Check
                type="radio"
                id="allowOptingOutYes"
                name="allowOptingOut"
                label={intl.formatMessage(messages['authoring.examsettings.allowoptout.yes'])}
                inline
                checked={allowOptingOut}
                onChange={() => onAllowOptingOutChange(true)}
                data-testid="allowOptingOutYes"
              />
              <Form.Check
                type="radio"
                id="allowOptingOutNo"
                name="allowOptingOut"
                label={intl.formatMessage(messages['authoring.examsettings.allowoptout.no'])}
                inline
                checked={!allowOptingOut}
                onChange={() => onAllowOptingOutChange(false)}
                data-testid="allowOptingOutNo"
              />
              <Form.Text id="allowOptingOutHelpText">
                <FormattedMessage
                  id="authoring.examsettings.allowoptout.help"
                  defaultMessage={`
                    If this value is "Yes", learners can choose to take proctored exams without proctoring.
                    If this value is "No", all learners must take the exam with proctoring.
                  `}
                  description="Help text for proctored exam opt out radio selection"
                />
              </Form.Text>
            </Form.Group>
          </fieldset>
        )}

        {/* PROCTORING PROVIDER */}
        { enableProctoredExams && (
        <Form.Group controlId="formProctoringProvider">
          <Form.Label as="legend">
            <FormattedMessage
              id="authoring.examsettings.provider.label"
              defaultMessage="Proctoring Provider"
              description="Label for proctoring provider dropdown selection"
            />
          </Form.Label>
          <Form.Control
            as="select"
            value={proctoringProvider}
            onChange={onProctoringProviderChange}
            aria-describedby="proctoringProviderHelpText"
          >
            {getProctoringProviderOptions(availableProctoringProviders)}
          </Form.Control>
          <Form.Text id="proctoringProviderHelpText">
            {cannotEditProctoringProvider() ? intl.formatMessage(messages['authoring.examsettings.provider.help.aftercoursestart']) : intl.formatMessage(messages['authoring.examsettings.provider.help'])}
          </Form.Text>
        </Form.Group>
        )}

        {/* PROCTORTRACK ESCALATION EMAIL */}
        {showProctortrackEscalationEmail && enableProctoredExams && (
          <Form.Group controlId="formProctortrackEscalationEmail">
            <Form.Label>
              <FormattedMessage
                id="authoring.examsettings.escalationemail.label"
                defaultMessage="Proctortrack Escalation Email"
                description="Label for escalation email text field"
              />
            </Form.Label>
            <Form.Control
              ref={proctoringEscalationEmailInputRef}
              type="email"
              data-testid="escalationEmail"
              onChange={onProctortrackEscalationEmailChange}
              value={proctortrackEscalationEmail}
              isInvalid={Object.prototype.hasOwnProperty.call(formStatus.errors, 'formProctortrackEscalationEmail')}
              aria-describedby="proctortrackEscalationEmailHelpText"
            />
            <Form.Control.Feedback type="invalid">{formStatus.errors.formProctortrackEscalationEmail && formStatus.errors.formProctortrackEscalationEmail.inputErrorMessage} </Form.Control.Feedback>
            <Form.Text id="proctortrackEscalationEmailHelpText">
              <FormattedMessage
                id="authoring.examsettings.escalationemail.help"
                defaultMessage={`
                  Required if "proctortrack" is selected as your proctoring provider. Enter an email address to be
                  contacted by the support team whenever there are escalations (e.g. appeals, delayed reviews, etc.).
                `}
                description="Help text explaining escalation email field."
              />
            </Form.Text>
          </Form.Group>
        )}
        {/* CREATE ZENDESK TICKETS */}
        { isEdxStaff && enableProctoredExams && (
          <fieldset aria-describedby="createZendeskTicketsText">
            <Form.Group controlId="formCreateZendeskTickets">
              <Form.Label as="legend">
                <FormattedMessage
                  id="authoring.examsettings.createzendesk.label"
                  defaultMessage="Create Zendesk Tickets for Suspicious Proctored Exam Attempts"
                  description="Label for Zendesk ticket creation radio select."
                />
              </Form.Label>
              <Form.Check
                type="radio"
                id="createZendeskTicketsYes"
                label={intl.formatMessage(messages['authoring.examsettings.createzendesk.yes'])}
                inline
                name="createZendeskTickets"
                checked={createZendeskTickets}
                onChange={() => onCreateZendeskTicketsChange(true)}
                data-testid="createZendeskTicketsYes"
              />
              <Form.Check
                type="radio"
                id="createZendeskTicketsNo"
                label={intl.formatMessage(messages['authoring.examsettings.createzendesk.no'])}
                inline
                name="createZendeskTickets"
                checked={!createZendeskTickets}
                onChange={() => onCreateZendeskTicketsChange(false)}
                data-testid="createZendeskTicketsNo"
              />
              <Form.Text id="createZendeskTicketsText">
                <FormattedMessage
                  id="authoring.examsettings.createzendesk.help"
                  defaultMessage="If this value is &quot;Yes&quot;, a Zendesk ticket will be created for suspicious proctored exam attempts."
                  description="Help text for Zendesk ticket creation radio select"
                />
              </Form.Text>
            </Form.Group>
          </fieldset>
        )}
        <Button
          variant="primary"
          className="mb-3"
          data-testid="submissionButton"
          type="submit"
          disabled={submissionInProgress}
        >
          <FormattedMessage
            id="authoring.examsettings.submit"
            defaultMessage="Submit"
            description="Form submit button"
          />
        </Button> {' '}
        {submissionInProgress && <Spinner animation="border" variant="primary" data-testid="saveInProgress" aria-label="Save in progress" />}
      </Form>
    );
  }

  function renderLoading() {
    return (
      <Loading />
    );
  }

  function renderConnectionError() {
    return (
      <ConnectionErrorAlert />
    );
  }

  function renderPermissionError() {
    return (
      <PermissionDeniedAlert />
    );
  }

  function renderSaveSuccess() {
    const studioCourseRunURL = StudioApiService.getStudioCourseRunUrl(courseId);
    return (
      <Alert
        variant="success"
        dismissible
        data-testid="saveSuccess"
        tabIndex="-1"
        ref={saveStatusAlertRef}
        onClose={() => setSaveSuccess(false)}
      >
        <FormattedMessage
          id="authoring.examsettings.alert.success"
          defaultMessage={`
            Proctored exam settings saved successfully.
            You can go back to your course in Studio {studioCourseRunURL}.
          `}
          values={{ studioCourseRunURL: <Alert.Link href={studioCourseRunURL}>here</Alert.Link> }}
        />
      </Alert>
    );
  }

  function renderSaveError() {
    return (
      <Alert
        variant="danger"
        dismissible
        data-testid="saveError"
        tabIndex="-1"
        ref={saveStatusAlertRef}
        onClose={() => setSaveError(false)}
      >
        <FormattedMessage
          id="authoring.examsettings.alert.error"
          defaultMessage={`
            We encountered a technical error while trying to save proctored exam settings.
            This might be a temporary issue, so please try again in a few minutes.
            If the problem persists,
            please go to the {support_link} for help.
          `}
          values={{
            support_link: (
              <Alert.Link href={getConfig().SUPPORT_URL}>
                {intl.formatMessage(messages['authoring.examsettings.support.text'])}
              </Alert.Link>
            ),
          }}
        />
      </Alert>
    );
  }

  useEffect(
    () => {
      StudioApiService.getProctoredExamSettingsData(courseId)
        .then(
          response => {
            const proctoredExamSettings = response.data.proctored_exam_settings;
            setLoaded(true);
            setLoading(false);
            setSubmissionInProgress(false);
            setCourseStartDate(response.data.course_start_date);
            setEnableProctoredExams(proctoredExamSettings.enable_proctored_exams);
            setAllowOptingOut(proctoredExamSettings.allow_proctoring_opt_out);
            setProctoringProvider(proctoredExamSettings.proctoring_provider);
            const isProctortrack = proctoredExamSettings.proctoring_provider === 'proctortrack';
            setShowProctortrackEscalationEmail(isProctortrack);
            setAvailableProctoringProviders(response.data.available_proctoring_providers);

            // The backend API may return null for the proctoringEscalationEmail value, which is the default.
            // In order to keep our email input component controlled, we use the empty string as the default
            // and perform this conversion during GETs and POSTs.
            const proctoringEscalationEmail = proctoredExamSettings.proctoring_escalation_email;
            setProctortrackEscalationEmail(proctoringEscalationEmail === null ? '' : proctoringEscalationEmail);

            setCreateZendeskTickets(proctoredExamSettings.create_zendesk_tickets);
          },
        ).catch(
          error => {
            if (error.response.status === 403) {
              setLoadingPermissionError(true);
            } else {
              setLoadingConnectionError(true);
            }
            setLoading(false);
            setLoaded(false);
            setSubmissionInProgress(false);
          },
        );
    }, [],
  );

  useEffect(() => {
    if ((saveSuccess || saveError) && !!saveStatusAlertRef.current) {
      saveStatusAlertRef.current.focus();
    }
    if (!formStatus.isValid && !!alertRef.current) {
      alertRef.current.focus();
    }
  }, [formStatus, saveSuccess, saveError]);

  return (
    <div className="container">
      <h2 className="mt-3 mb-2">
        Proctored Exam Settings
      </h2>
      <div>
        {loading ? renderLoading() : null}
        {saveSuccess ? renderSaveSuccess() : null}
        {saveError ? renderSaveError() : null}
        {loaded ? renderContent() : null}
        {loadingConnectionError ? renderConnectionError() : null}
        {loadingPermissionError ? renderPermissionError() : null}
      </div>
    </div>
  );
}

ProctoredExamSettings.propTypes = {
  courseId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

ProctoredExamSettings.defaultProps = {};

export default injectIntl(ProctoredExamSettings);
