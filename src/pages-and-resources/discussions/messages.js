import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  settings: {
    id: 'authoring.discussions.settings',
    defaultMessage: 'Settings',
    description: 'A label for the second step of the app configuration stepper.',
  },
  configure: {
    id: 'authoring.discussions.configure',
    defaultMessage: 'Configure discussions',
  },
  configureApp: {
    id: 'authoring.discussions.configure.app',
    defaultMessage: 'Configure {name}',
  },
  backButton: {
    id: 'authoring.discussions.backButton',
    defaultMessage: 'Back',
    description: 'Button allowing the user to return to discussion app selection.',
  },
  applyButton: {
    id: 'authoring.discussions.applyButton',
    defaultMessage: 'Apply',
    description: 'Button allowing the user to submit their discussion configuration.',
  },
  applyingButton: {
    id: 'authoring.discussions.applyingButton',
    defaultMessage: 'Applying',
    description: 'Button label when the discussion configuration is being submitted.',
  },
  appliedButton: {
    id: 'authoring.discussions.appliedButton',
    defaultMessage: 'Applied',
    description: 'Button label when the discussion configuration has been successfully submitted.',
  },
  noProviderSwitchAfterCourseStarted: {
    id: 'authoring.discussions.noProviderSwitchAfterCourseStarted',
    defaultMessage: "Discussion provider can't be changed after course has started, please reach out to partner support.",
    description: "Informs the user that the provider can't be changed after the course has started.",
  },
  providerSelection: {
    id: 'authoring.discussions.providerSelection',
    defaultMessage: 'Provider selection',
    description: 'A label for the first step of a wizard where the user chooses a discussion tool to configure.',
  },
  Incomplete: {
    id: 'authoring.discussions.Incomplete',
    defaultMessage: 'Incomplete',
    description: 'A description for the second step of the app configuration stepper.',
  },
});

export default messages;
