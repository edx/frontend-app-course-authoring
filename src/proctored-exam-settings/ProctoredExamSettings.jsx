import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import EmailValidator from 'email-validator';
import moment from 'moment';
import {
  Alert, Button, Form, Spinner,
} from '@edx/paragon';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import StudioApiService from '../data/services/StudioApiService';

function ExamSettings(props) {
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [loadingConnectionError, setLoadingConnectionError] = useState(false);
  const [loadingPermissionError, setLoadingPermissionError] = useState(false);
  const [enableProctoredExams, setEnableProctoredExams] = useState(true);
  const [allowOptingOut, setAllowOptingOut] = useState(false);
  const [proctoringProvider, setProctoringProvider] = useState('');
  const [availableProctoringProviders, setAvailableProctoringProviders] = useState([]);
  // TODO: we'll probably want to hide this field when proctortrack is not selected; currently,
  // this causes some errors in the browser console
  const [proctortrackEscalationEmail, setProctortrackEscalationEmail] = useState('');
  const [createZendeskTickets, setCreateZendeskTickets] = useState(false);
  const [proctortrackEscalationEmailError, setProctortrackEscalationEmailError] = useState('');
  const [courseStartDate, setCourseStartDate] = useState('');

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
    } else if (provider === 'software_secure') {
      setCreateZendeskTickets(true);
    }
  }

  function onProctortrackEscalationEmailChange(event) {
    setProctortrackEscalationEmail(event.target.value);
  }

  function onButtonClick() {
    if (proctoringProvider === 'proctortrack' && !EmailValidator.validate(proctortrackEscalationEmail)) {
      setProctortrackEscalationEmailError('A valid escalation email must be provided if '
        + 'Proctortrack is the selected provider.');
    } else {
      setProctortrackEscalationEmailError('');
      // TODO: implement POST
    }
  }

  function cannotEditProctoringProvider() {
    const currentDate = moment(moment()).format('YYYY-MM-DD[T]hh:mm:ss[Z]');
    const isAfterCourseStart = currentDate > courseStartDate;

    const isAdmin = getAuthenticatedUser().administrator;

    // if the user is  not an administrator and it is after the course start date, user cannot edit proctoring provider
    return !isAdmin && isAfterCourseStart;
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
        data-test-id={provider}
      >
        {provider}
      </option>
    ));
  }

  function renderContent() {
    return (
      <Form>
        {proctortrackEscalationEmailError
          && (
            // tabIndex="-1" to make non-focusable element focusable
            <Alert
              id="proctortrackEscalationEmailError"
              variant="danger"
              tabIndex="-1"
              data-test-id="proctortrackEscalationEmailError"
            >
              {proctortrackEscalationEmailError}
            </Alert>
          )}
        {/* ENABLE PROCTORED EXAMS */}
        <Form.Group controlId="formEnableProctoredExam">
          <Form.Check
            type="checkbox"
            id="enableProctoredExams"
            label="Enable Proctored Exams"
            aria-describedby="enableProctoredExamsHelpText"
            onChange={onEnableProctoredExamsChange}
            checked={enableProctoredExams}
          />
          <Form.Text id="enableProctoredExamsHelpText">
            If checked, proctored exams are enabled in your course.
          </Form.Text>
        </Form.Group>

        {/* ALLOW OPTING OUT OF PROCTORED EXAMS */}
        <fieldset aria-describedby="allowOptingOutHelpText">
          <Form.Group controlId="formAllowingOptingOut">
            <Form.Label as="legend">Allow Opting Out of Proctored Exams</Form.Label>
            <Form.Check
              type="radio"
              id="allowOptingOutYes"
              name="allowOptingOut"
              label="Yes"
              inline
              checked={allowOptingOut}
              onChange={() => onAllowOptingOutChange(true)}
            />
            <Form.Check
              type="radio"
              id="allowOptingOutNo"
              name="allowOptingOut"
              label="No"
              inline
              checked={!allowOptingOut}
              onChange={() => onAllowOptingOutChange(false)}
            />
            <Form.Text id="allowOptingOutHelpText">
              If this value is &quot;Yes&quot;, learners can choose to take proctored exams without proctoring.
              If this value is &quot;No&quot;, all learners must take the exam with proctoring.
              This setting only applies if proctored exams are enabled for the course.
            </Form.Text>
          </Form.Group>
        </fieldset>

        {/* PROCTORING PROVIDER */}
        <Form.Group controlId="formProctoringProvider">
          <Form.Label>Proctoring Provider</Form.Label>
          <Form.Control
            as="select"
            value={proctoringProvider}
            onChange={onProctoringProviderChange}
          >
            {getProctoringProviderOptions(availableProctoringProviders)}
          </Form.Control>
          <Form.Text>{cannotEditProctoringProvider() ? ('Proctoring provider cannot be modified after course start date.') : ('Select the proctoring provider you want to use for this course run.')}</Form.Text>
        </Form.Group>

        {/* PROCTORTRACK ESCALATION EMAIL */}
        <Form.Group controlId="formProctortrackEscalationEmail">
          <Form.Label>Proctortrack Escalation Email</Form.Label>
          <Form.Control
            type="email"
            data-test-id="escalationEmail"
            onChange={onProctortrackEscalationEmailChange}
            value={proctortrackEscalationEmail}
            isInvalid={!!proctortrackEscalationEmailError}
          />
          <Form.Control.Feedback type="invalid">{proctortrackEscalationEmailError}</Form.Control.Feedback>
          <Form.Text>
            Required if &quot;proctortrack&quot; is selected as your proctoring provider.
            Enter an email address to be contacted by the support team whenever there are escalations
            (e.g. appeals, delayed reviews, etc.).
          </Form.Text>
        </Form.Group>

        {/* CREATE ZENDESK TICKETS */}
        <fieldset aria-describedby="allowOptingOutHelpText">
          <Form.Group controlId="formCreateZendeskTickets">
            <Form.Label as="legend">Create Zendesk Tickets for Suspicious Proctored Exam Attempts</Form.Label>
            <Form.Check
              type="radio"
              id="createZendeskTicketsYes"
              label="Yes"
              inline
              name="createZendeskTickets"
              checked={createZendeskTickets}
              onChange={() => onCreateZendeskTicketsChange(true)}
              data-test-id="createZendeskTicketsYes"
            />
            <Form.Check
              type="radio"
              id="createZendeskTicketsNo"
              label="No"
              inline
              name="createZendeskTickets"
              checked={!createZendeskTickets}
              onChange={() => onCreateZendeskTicketsChange(false)}
              data-test-id="createZendeskTicketsNo"
            />
            <Form.Text id="createZendeskTicketsText">
              If this value is &quot;Yes&quot;, a Zendesk ticket will be created for suspicious proctored exam attempts.
            </Form.Text>
          </Form.Group>
        </fieldset>
        <Button
          className="btn-primary mb-3"
          data-test-id="submissionButton"
          onClick={onButtonClick}
        >
          Submit
        </Button>
      </Form>
    );
  }

  function renderLoading() {
    return (
      <div
        className="d-flex justify-content-center align-items-center flex-column"
        style={{
          height: '50vh',
        }}
        data-test-id="spinnerContainer"
      >
        <Spinner className animation="border" role="status" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  function renderConnectionError() {
    return (
      <Alert variant="danger" data-test-id="connectionError">
        We encountered a technical error when loading this page.
        This might be a temporary issue, so please try again in a few minutes.
        If the problem persists, please go to <a href="https://support.edx.org/hc/en-us">edX Support Page</a> for help.
      </Alert>
    );
  }

  function renderPermissionError() {
    return (
      <Alert variant="danger" data-test-id="permissionError">
        You are not authorized to view this page. If you feel you should have access,
        please reach out to your course team admin to be given access.
      </Alert>
    );
  }

  useEffect(
    () => {
      StudioApiService.getProctoredExamSettingsData(props.courseId)
        .then(
          response => {
            const proctoredExamSettings = response.data.proctored_exam_settings;
            setLoaded(true);
            setLoading(false);
            setCourseStartDate(response.data.course_start_date);
            setEnableProctoredExams(proctoredExamSettings.enable_proctored_exams);
            setAllowOptingOut(proctoredExamSettings.allow_proctoring_opt_out);
            setProctoringProvider(proctoredExamSettings.proctoring_provider);
            setAvailableProctoringProviders(response.data.available_proctoring_providers);
            setProctortrackEscalationEmail(proctoredExamSettings.proctoring_escalation_email);
            setCreateZendeskTickets(proctoredExamSettings.create_zendesk_tickets);
          },
        ).catch(
          errorDetails => {
            if (errorDetails.customAttributes.httpErrorStatus === 403) {
              setLoadingPermissionError(true);
            } else {
              setLoadingConnectionError(true);
            }
            setLoading(false);
            setLoaded(false);
          },
        );
    }, [],
  );

  return (
    <div className="container">
      <h2 className="mb-1">
        Proctored Exam Settings
      </h2>
      <div>
        {loading ? renderLoading() : null}
        {loaded ? renderContent() : null}
        {loadingConnectionError ? renderConnectionError() : null}
        {loadingPermissionError ? renderPermissionError() : null}
      </div>
    </div>
  );
}

ExamSettings.propTypes = {
  courseId: PropTypes.string.isRequired,
};

ExamSettings.defaultProps = {};

export default ExamSettings;
