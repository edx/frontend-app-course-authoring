import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  heading: {
    id: 'course-authoring.pages-resources.notes.heading',
    defaultMessage: 'Configure notes',
  },
  enableNotesLabel: {
    id: 'course-authoring.pages-resources.notes.enable-notes.label',
    defaultMessage: 'Notes',
  },
  enableNotesHelp: {
    id: 'course-authoring.pages-resources.notes.enable-notes.help',
    defaultMessage: `Learners can access their notes either in the body of the
    course of on a notes page. On the notes page, a learner can see all the
    notes made during the course. The page also contains links to the location
    of the notes in the course body.`,
  },
  enableNotesLink: {
    id: 'course-authoring.pages-resources.notes.enable-notes.link',
    defaultMessage: 'Learn more about notes',
  },
});

export default messages;
