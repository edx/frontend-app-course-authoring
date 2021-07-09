import React from 'react';

import {
  act,
  cleanup, fireEvent, render, screen, waitFor, waitForElementToBeRemoved,
} from '@testing-library/react';
// import * as auth from '@edx/frontend-platform/auth';
import MockAdapter from 'axios-mock-adapter';

import { initializeMockApp } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';

import StudioApiService from '../data/services/StudioApiService';
import ProctoredExamSettings from './ProctoredExamSettings';

const defaultProps = {
  courseId: 'course-v1%3AedX%2BDemoX%2BDemo_Course',
};

const IntlProctoredExamSettings = injectIntl(ProctoredExamSettings);

const intlWrapper = children => (
  <IntlProvider locale="en">
    {children}
  </IntlProvider>
);
let axiosMock;

describe('ProctoredExamSettings', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Field dependencies', () => {
    beforeEach(async () => {
      initializeMockApp({
        authenticatedUser: {
          userId: 3,
          username: 'abc123',
          administrator: true,
          roles: [],
        },
      });

      axiosMock = new MockAdapter(getAuthenticatedHttpClient());

      axiosMock.onGet(
        StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId),
      ).reply(200, {
        proctored_exam_settings: {
          enable_proctored_exams: true,
          allow_proctoring_opt_out: false,
          proctoring_provider: 'mockproc',
          proctoring_escalation_email: 'test@example.com',
          create_zendesk_tickets: true,
        },
        available_proctoring_providers: ['software_secure', 'proctortrack', 'mockproc'],
        course_start_date: '2070-01-01T00:00:00Z',
      });

      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
    });

    it('Updates Zendesk ticket field if proctortrack is provider', async () => {
      await waitFor(() => {
        screen.getByDisplayValue('mockproc');
      });
      const selectElement = screen.getByDisplayValue('mockproc');
      await act(async () => {
        fireEvent.change(selectElement, { target: { value: 'proctortrack' } });
      });
      const zendeskTicketInput = screen.getByTestId('createZendeskTicketsNo');
      expect(zendeskTicketInput.checked).toEqual(true);
    });

    it('Updates Zendesk ticket field if software_secure is provider', async () => {
      await waitFor(() => {
        screen.getByDisplayValue('mockproc');
      });
      const selectElement = screen.getByDisplayValue('mockproc');
      await act(async () => {
        fireEvent.change(selectElement, { target: { value: 'software_secure' } });
      });
      const zendeskTicketInput = screen.getByTestId('createZendeskTicketsYes');
      expect(zendeskTicketInput.checked).toEqual(true);
    });

    it('Does not update zendesk ticket field for any other provider', async () => {
      await waitFor(() => {
        screen.getByDisplayValue('mockproc');
      });
      const selectElement = screen.getByDisplayValue('mockproc');
      await act(async () => {
        fireEvent.change(selectElement, { target: { value: 'mockproc' } });
      });
      const zendeskTicketInput = screen.getByTestId('createZendeskTicketsYes');
      expect(zendeskTicketInput.checked).toEqual(true);
    });

    it('Hides all other fields when enabledProctorExam is false when first loaded', async () => {
      cleanup();
      // Overrides the handler defined in beforeEach.
      axiosMock.onGet(
        StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId),
      ).reply(200, {
        proctored_exam_settings: {
          enable_proctored_exams: false,
          allow_proctoring_opt_out: false,
          proctoring_provider: 'mockproc',
          proctoring_escalation_email: 'test@example.com',
          create_zendesk_tickets: true,
        },
        available_proctoring_providers: ['software_secure', 'proctortrack', 'mockproc'],
        course_start_date: '2070-01-01T00:00:00Z',
      });

      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
      await waitFor(() => {
        screen.getByLabelText('Enable Proctored Exams');
      });
      const enabledProctoredExamCheck = screen.getByLabelText('Enable Proctored Exams');
      expect(enabledProctoredExamCheck.checked).toEqual(false);
      expect(screen.queryByText('Allow Opting Out of Proctored Exams')).toBeNull();
      expect(screen.queryByDisplayValue('mockproc')).toBeNull();
      expect(screen.queryByTestId('escalationEmail')).toBeNull();
      expect(screen.queryByTestId('createZendeskTicketsYes')).toBeNull();
      expect(screen.queryByTestId('createZendeskTicketsNo')).toBeNull();
    });

    it('Hides all other fields when enableProctoredExams toggled to false', async () => {
      await waitFor(() => {
        screen.getByLabelText('Enable Proctored Exams');
      });
      expect(screen.queryByText('Allow Opting Out of Proctored Exams')).toBeDefined();
      expect(screen.queryByDisplayValue('mockproc')).toBeDefined();
      expect(screen.queryByTestId('escalationEmail')).toBeDefined();
      expect(screen.queryByTestId('createZendeskTicketsYes')).toBeDefined();
      expect(screen.queryByTestId('createZendeskTicketsNo')).toBeDefined();

      let enabledProctorExamCheck = screen.getByLabelText('Enable Proctored Exams');
      expect(enabledProctorExamCheck.checked).toEqual(true);
      await act(async () => {
        fireEvent.click(enabledProctorExamCheck, { target: { value: false } });
      });
      enabledProctorExamCheck = screen.getByLabelText('Enable Proctored Exams');
      expect(enabledProctorExamCheck.checked).toEqual(false);
      expect(screen.queryByText('Allow Opting Out of Proctored Exams')).toBeNull();
      expect(screen.queryByDisplayValue('mockproc')).toBeNull();
      expect(screen.queryByTestId('escalationEmail')).toBeNull();
      expect(screen.queryByTestId('createZendeskTicketsYes')).toBeNull();
      expect(screen.queryByTestId('createZendeskTicketsNo')).toBeNull();
    });
  });

  describe('Validation with invalid escalation email', () => {
    beforeEach(async () => {
      initializeMockApp({
        authenticatedUser: {
          userId: 3,
          username: 'abc123',
          administrator: false,
          roles: [],
        },
      });

      axiosMock = new MockAdapter(getAuthenticatedHttpClient());

      axiosMock.onGet(
        StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId),
      ).reply(200, {
        proctored_exam_settings: {
          enable_proctored_exams: true,
          allow_proctoring_opt_out: false,
          proctoring_provider: 'proctortrack',
          proctoring_escalation_email: 'test@example.com',
          create_zendesk_tickets: true,
        },
        available_proctoring_providers: ['software_secure', 'proctortrack', 'mockproc'],
        course_start_date: '2070-01-01T00:00:00Z',
      });

      axiosMock.onPost(
        StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId),
      ).reply(200, {});

      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
    });

    it('Creates an alert when no proctoring escalation email is provided with proctortrack selected', async () => {
      await waitFor(() => {
        screen.getByDisplayValue('proctortrack');
      });
      const selectEscalationEmailElement = screen.getByDisplayValue('test@example.com');
      await act(async () => {
        fireEvent.change(selectEscalationEmailElement, { target: { value: '' } });
      });
      const selectButton = screen.getByTestId('submissionButton');
      await act(async () => {
        fireEvent.click(selectButton);
      });

      // verify alert content and focus management
      const escalationEmailError = screen.getByTestId('proctortrackEscalationEmailError');
      expect(escalationEmailError.textContent).not.toBeNull();
      expect(document.activeElement).toEqual(escalationEmailError);

      // verify alert link links to offending input
      const errorLink = screen.getByTestId('proctorTrackEscalationEmailErrorLink');
      await act(async () => {
        fireEvent.click(errorLink);
      });
      const escalationEmailInput = screen.getByTestId('escalationEmail');
      expect(document.activeElement).toEqual(escalationEmailInput);
    });

    it('Creates an alert when invalid proctoring escalation email is provided with proctortrack selected', async () => {
      await waitFor(() => {
        screen.getByDisplayValue('proctortrack');
      });
      const selectEscalationEmailElement = screen.getByDisplayValue('test@example.com');
      await act(async () => {
        fireEvent.change(selectEscalationEmailElement, { target: { value: 'foo.bar' } });
      });
      const selectButton = screen.getByTestId('submissionButton');
      await act(async () => {
        fireEvent.click(selectButton);
      });

      // verify alert content and focus management
      const escalationEmailError = screen.getByTestId('proctortrackEscalationEmailError');
      expect(document.activeElement).toEqual(escalationEmailError);
      expect(escalationEmailError.textContent).not.toBeNull();
      expect(document.activeElement).toEqual(escalationEmailError);

      // verify alert link links to offending input
      const errorLink = screen.getByTestId('proctorTrackEscalationEmailErrorLink');
      await act(async () => {
        fireEvent.click(errorLink);
      });
      const escalationEmailInput = screen.getByTestId('escalationEmail');
      expect(document.activeElement).toEqual(escalationEmailInput);
    });

    it('Creates an alert when invalid proctoring escalation email is provided with proctoring disabled', async () => {
      await waitFor(() => {
        screen.getByDisplayValue('proctortrack');
      });
      const selectEscalationEmailElement = screen.getByDisplayValue('test@example.com');
      await act(async () => {
        fireEvent.change(selectEscalationEmailElement, { target: { value: 'foo.bar' } });
      });
      const enableProctoringElement = screen.getByLabelText('Enable Proctored Exams');
      await act(async () => fireEvent.click(enableProctoringElement));
      const selectButton = screen.getByTestId('submissionButton');
      await act(async () => {
        fireEvent.click(selectButton);
      });

      // verify alert content and focus management
      const escalationEmailError = screen.getByTestId('proctortrackEscalationEmailError');
      expect(document.activeElement).toEqual(escalationEmailError);
      expect(escalationEmailError.textContent).not.toBeNull();
      expect(document.activeElement).toEqual(escalationEmailError);
    });

    it('Has no error when invalid proctoring escalation email is provided with proctoring disabled', async () => {
      await waitFor(() => {
        screen.getByDisplayValue('proctortrack');
      });
      const selectEscalationEmailElement = screen.getByDisplayValue('test@example.com');
      await act(async () => {
        fireEvent.change(selectEscalationEmailElement, { target: { value: '' } });
      });
      const enableProctoringElement = screen.getByLabelText('Enable Proctored Exams');
      await act(async () => fireEvent.click(enableProctoringElement));
      const selectButton = screen.getByTestId('submissionButton');
      await act(async () => {
        fireEvent.click(selectButton);
      });

      // verify there is no escalation email alert, and focus has been set on save success alert
      expect(screen.queryByTestId('proctortrackEscalationEmailError')).toBeNull();

      const errorAlert = screen.getByTestId('saveSuccess');
      expect(errorAlert.textContent).toEqual(
        expect.stringContaining('Proctored exam settings saved successfully.'),
      );
      expect(document.activeElement).toEqual(errorAlert);
    });

    it('Has no error when valid proctoring escalation email is provided with proctortrack selected', async () => {
      await waitFor(() => {
        screen.getByDisplayValue('proctortrack');
      });
      const selectEscalationEmailElement = screen.getByDisplayValue('test@example.com');
      await act(async () => {
        fireEvent.change(selectEscalationEmailElement, { target: { value: 'foo@bar.com' } });
      });
      const selectButton = screen.getByTestId('submissionButton');
      await act(async () => {
        fireEvent.click(selectButton);
      });

      // verify there is no escalation email alert, and focus has been set on save success alert
      expect(screen.queryByTestId('proctortrackEscalationEmailError')).toBeNull();

      const errorAlert = screen.getByTestId('saveSuccess');
      expect(errorAlert.textContent).toEqual(
        expect.stringContaining('Proctored exam settings saved successfully.'),
      );
      expect(document.activeElement).toEqual(errorAlert);
    });

    it('Escalation email field hidden when proctoring backend is not Proctortrack', async () => {
      await waitFor(() => {
        screen.getByDisplayValue('proctortrack');
      });
      const proctoringBackendSelect = screen.getByDisplayValue('proctortrack');
      const selectEscalationEmailElement = screen.getByTestId('escalationEmail');
      expect(selectEscalationEmailElement.value).toEqual('test@example.com');
      await act(async () => {
        fireEvent.change(proctoringBackendSelect, { target: { value: 'software_secure' } });
      });
      expect(screen.queryByTestId('escalationEmail')).toBeNull();
    });

    it('Escalation email Field Show when proctoring backend is switched back to Proctortrack', async () => {
      await waitFor(() => {
        screen.getByDisplayValue('proctortrack');
      });
      const proctoringBackendSelect = screen.getByDisplayValue('proctortrack');
      let selectEscalationEmailElement = screen.getByTestId('escalationEmail');
      await act(async () => {
        fireEvent.change(proctoringBackendSelect, { target: { value: 'software_secure' } });
      });
      expect(screen.queryByTestId('escalationEmail')).toBeNull();
      await act(async () => {
        fireEvent.change(proctoringBackendSelect, { target: { value: 'proctortrack' } });
      });
      expect(screen.queryByTestId('escalationEmail')).toBeDefined();
      selectEscalationEmailElement = screen.getByTestId('escalationEmail');
      expect(selectEscalationEmailElement.value).toEqual('test@example.com');
    });

    it('Submits form when "Enter" key is hit in the escalation email field', async () => {
      await waitFor(() => {
        screen.getByDisplayValue('proctortrack');
      });
      const selectEscalationEmailElement = screen.getByDisplayValue('test@example.com');
      await act(async () => {
        fireEvent.change(selectEscalationEmailElement, { target: { value: '' } });
      });
      await act(async () => {
        fireEvent.submit(selectEscalationEmailElement);
      });
      // if the error appears, the form has been submitted
      expect(screen.getByTestId('proctortrackEscalationEmailError')).toBeDefined();
    });
  });

  describe('Proctoring provider options', () => {
    const mockGetFutureCourseData = {
      proctored_exam_settings: {
        enable_proctored_exams: true,
        allow_proctoring_opt_out: false,
        proctoring_provider: 'mockproc',
        proctoring_escalation_email: 'test@example.com',
        create_zendesk_tickets: true,
      },
      available_proctoring_providers: ['software_secure', 'proctortrack', 'mockproc'],
      course_start_date: '2099-01-01T00:00:00Z',
    };

    const mockGetPastCourseData = {
      proctored_exam_settings: {
        enable_proctored_exams: true,
        allow_proctoring_opt_out: false,
        proctoring_provider: 'mockproc',
        proctoring_escalation_email: 'test@example.com',
        create_zendesk_tickets: true,
      },
      available_proctoring_providers: ['software_secure', 'proctortrack', 'mockproc'],
      course_start_date: '2013-01-01T00:00:00Z',
    };

    function setup(data, isAdmin) {
      initializeMockApp({
        authenticatedUser: {
          userId: 3,
          username: 'abc123',
          administrator: isAdmin,
          roles: [],
        },
      });

      axiosMock = new MockAdapter(getAuthenticatedHttpClient());
      axiosMock.onGet(StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId)).reply(200, data);
    }

    it('Disables irrelevant proctoring provider fields when user is not an administrator and it is after start date', async () => {
      setup(mockGetPastCourseData, false);
      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
      const providerOption = screen.getByTestId('proctortrack');
      expect(providerOption.hasAttribute('disabled')).toEqual(true);
    });

    it('Enables all proctoring provider options if user is not an administrator and it is before start date', async () => {
      setup(mockGetFutureCourseData, false);
      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
      const providerOption = screen.getByTestId('proctortrack');
      expect(providerOption.hasAttribute('disabled')).toEqual(false);
    });

    it('Enables all proctoring provider options if user administrator and it is after start date', async () => {
      setup(mockGetPastCourseData, true);
      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
      const providerOption = screen.getByTestId('proctortrack');
      expect(providerOption.hasAttribute('disabled')).toEqual(false);
    });

    it('Enables all proctoring provider options if user administrator and it is before start date', async () => {
      setup(mockGetFutureCourseData, true);
      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
      const providerOption = screen.getByTestId('proctortrack');
      expect(providerOption.hasAttribute('disabled')).toEqual(false);
    });
  });

  describe('Toggles field visibility based on user permissions', () => {
    function setup(isAdmin) {
      initializeMockApp({
        authenticatedUser: {
          userId: 3,
          username: 'abc123',
          administrator: isAdmin,
          roles: [],
        },
      });

      axiosMock = new MockAdapter(getAuthenticatedHttpClient());
      axiosMock.onGet(StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId)).reply(200, {
        proctored_exam_settings: {
          enable_proctored_exams: true,
          allow_proctoring_opt_out: false,
          proctoring_provider: 'mockproc',
          proctoring_escalation_email: 'test@example.com',
          create_zendesk_tickets: true,
        },
        available_proctoring_providers: ['software_secure', 'proctortrack', 'mockproc'],
        course_start_date: '2070-01-01T00:00:00Z',
      });
    }

    it('Hides opting out and zendesk tickets for non edX staff', async () => {
      setup(false);
      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
      expect(screen.queryByTestId('allowOptingOutYes')).toBeNull();
      expect(screen.queryByTestId('createZendeskTicketsYes')).toBeNull();
    });

    it('Shows opting out and zendesk tickets for edX staff', async () => {
      setup(true);
      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
      expect(screen.queryByTestId('allowOptingOutYes')).not.toBeNull();
      expect(screen.queryByTestId('createZendeskTicketsYes')).not.toBeNull();
    });
  });

  describe('Connection states', () => {
    beforeEach(() => {
      initializeMockApp({
        authenticatedUser: {
          userId: 3,
          username: 'abc123',
          administrator: true,
          roles: [],
        },
      });
      axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    });

    it('Shows the spinner before the connection is complete', async () => {
      await act(async () => {
        render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />));
        // This expectation is _inside_ the `act` intentionally, so that it executes immediately.
        const spinner = screen.getByRole('status');
        expect(spinner.textContent).toEqual('Loading...');
      });
    });

    it('Show connection error message when we suffer server side error', async () => {
      axiosMock.onGet(
        StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId),
      ).reply(500);

      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
      const connectionError = screen.getByTestId('connectionErrorAlert');
      expect(connectionError.textContent).toEqual(
        expect.stringContaining('We encountered a technical error when loading this page.'),
      );
    });

    it('Show permission error message when user do not have enough permission', async () => {
      axiosMock.onGet(
        StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId),
      ).reply(403);

      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
      const permissionError = screen.getByTestId('permissionDeniedAlert');
      expect(permissionError.textContent).toEqual(
        expect.stringContaining('You are not authorized to view this page'),
      );
    });
  });

  describe('Save settings', () => {
    beforeEach(() => {
      initializeMockApp({
        authenticatedUser: {
          userId: 3,
          username: 'abc123',
          administrator: true,
          roles: [],
        },
      });

      axiosMock = new MockAdapter(getAuthenticatedHttpClient(), { onNoMatch: 'throwException' });
      axiosMock.onGet(StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId)).reply(200, {
        proctored_exam_settings: {
          enable_proctored_exams: true,
          allow_proctoring_opt_out: false,
          proctoring_provider: 'mockproc',
          proctoring_escalation_email: 'test@example.com',
          create_zendesk_tickets: true,
        },
        available_proctoring_providers: ['software_secure', 'proctortrack', 'mockproc'],
      });
    });

    it('Show spinner while saving', async () => {
      axiosMock.onPost(
        StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId),
      ).reply(200, 'success');

      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
      const submitButton = screen.getByTestId('submissionButton');
      expect(screen.queryByTestId('saveInProgress')).toBeFalsy();
      act(() => {
        fireEvent.click(submitButton);
      });

      const submitSpinner = screen.getByTestId('saveInProgress');
      expect(submitSpinner).toBeDefined();

      await waitForElementToBeRemoved(submitSpinner);
      expect(axiosMock.history.get.length).toBe(1);
      expect(axiosMock.history.post.length).toBe(1);
      expect(screen.queryByTestId('saveInProgress')).toBeFalsy();
    });

    it('Makes API call successfully with proctoring_escalation_email if proctortrack', async () => {
      axiosMock.onPost(
        StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId),
      ).reply(200, 'success');

      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
      // Make a change to the provider to proctortrack and set the email
      const selectElement = screen.getByDisplayValue('mockproc');
      await act(async () => {
        fireEvent.change(selectElement, { target: { value: 'proctortrack' } });
      });
      const escalationEmail = screen.getByTestId('escalationEmail');
      expect(escalationEmail.value).toEqual('test@example.com');
      await act(async () => {
        fireEvent.change(escalationEmail, { target: { value: 'proctortrack@example.com' } });
      });
      expect(escalationEmail.value).toEqual('proctortrack@example.com');
      const submitButton = screen.getByTestId('submissionButton');
      await act(async () => {
        fireEvent.click(submitButton);
      });
      expect(axiosMock.history.post.length).toBe(1);
      expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({
        proctored_exam_settings: {
          enable_proctored_exams: true,
          allow_proctoring_opt_out: false,
          proctoring_provider: 'proctortrack',
          proctoring_escalation_email: 'proctortrack@example.com',
          create_zendesk_tickets: false,
        },
      });

      const errorAlert = screen.getByTestId('saveSuccess');
      expect(errorAlert.textContent).toEqual(
        expect.stringContaining('Proctored exam settings saved successfully.'),
      );
      expect(document.activeElement).toEqual(errorAlert);
    });

    it('Makes API call successfully without proctoring_escalation_email if not proctortrack', async () => {
      axiosMock.onPost(
        StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId),
      ).reply(200, 'success');

      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));

      // make sure we have not selected proctortrack as the proctoring provider
      expect(screen.getByDisplayValue('mockproc')).toBeDefined();

      const submitButton = screen.getByTestId('submissionButton');
      await act(async () => {
        fireEvent.click(submitButton);
      });
      expect(axiosMock.history.post.length).toBe(1);
      expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({
        proctored_exam_settings: {
          enable_proctored_exams: true,
          allow_proctoring_opt_out: false,
          proctoring_provider: 'mockproc',
          create_zendesk_tickets: true,
        },
      });

      const errorAlert = screen.getByTestId('saveSuccess');
      expect(errorAlert.textContent).toEqual(
        expect.stringContaining('Proctored exam settings saved successfully.'),
      );
      expect(document.activeElement).toEqual(errorAlert);
    });

    it('Makes API call generated error', async () => {
      axiosMock.onPost(
        StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId),
      ).reply(500);

      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
      const submitButton = screen.getByTestId('submissionButton');
      await act(async () => {
        fireEvent.click(submitButton);
      });
      expect(axiosMock.history.post.length).toBe(1);
      const errorAlert = screen.getByTestId('saveError');
      expect(errorAlert.textContent).toEqual(
        expect.stringContaining('We encountered a technical error while trying to save proctored exam settings'),
      );
      expect(document.activeElement).toEqual(errorAlert);
    });

    it('Manages focus correctly after different save statuses', async () => {
      // first make a call that will cause a save error
      axiosMock.onPost(
        StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId),
      ).replyOnce(500);

      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
      const submitButton = screen.getByTestId('submissionButton');
      await act(async () => {
        fireEvent.click(submitButton);
      });
      expect(axiosMock.history.post.length).toBe(1);
      const errorAlert = screen.getByTestId('saveError');
      expect(errorAlert.textContent).toEqual(
        expect.stringContaining('We encountered a technical error while trying to save proctored exam settings'),
      );
      expect(document.activeElement).toEqual(errorAlert);

      // now make a call that will allow for a successful save
      axiosMock.onPost(
        StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId),
      ).replyOnce(200, 'success');
      await act(async () => {
        fireEvent.click(submitButton);
      });

      expect(axiosMock.history.post.length).toBe(2);
      const successAlert = screen.getByTestId('saveSuccess');
      expect(successAlert.textContent).toEqual(
        expect.stringContaining('Proctored exam settings saved successfully.'),
      );
      expect(document.activeElement).toEqual(successAlert);
    });

    it('Include Zendesk ticket in post request if user is not an admin', async () => {
      // use non-admin user for test
      initializeMockApp({
        authenticatedUser: {
          userId: 4,
          username: 'abc1234',
          administrator: false,
          roles: [],
        },
      });
      axiosMock = new MockAdapter(getAuthenticatedHttpClient(), { onNoMatch: 'throwException' });
      axiosMock.onGet(StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId)).reply(200, {
        proctored_exam_settings: {
          enable_proctored_exams: true,
          allow_proctoring_opt_out: false,
          proctoring_provider: 'mockproc',
          proctoring_escalation_email: 'test@example.com',
          create_zendesk_tickets: true,
        },
        available_proctoring_providers: ['software_secure', 'proctortrack', 'mockproc'],
      });
      axiosMock.onPost(
        StudioApiService.getProctoredExamSettingsUrl(defaultProps.courseId),
      ).reply(200, 'success');

      await act(async () => render(intlWrapper(<IntlProctoredExamSettings {...defaultProps} />)));
      // Make a change to the proctoring provider
      const selectElement = screen.getByDisplayValue('mockproc');
      await act(async () => {
        fireEvent.change(selectElement, { target: { value: 'proctortrack' } });
      });
      const submitButton = screen.getByTestId('submissionButton');
      await act(async () => {
        fireEvent.click(submitButton);
      });
      expect(axiosMock.history.post.length).toBe(1);
      expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({
        proctored_exam_settings: {
          enable_proctored_exams: true,
          proctoring_provider: 'proctortrack',
          proctoring_escalation_email: 'test@example.com',
          create_zendesk_tickets: false,
        },
      });
    });
  });
});
