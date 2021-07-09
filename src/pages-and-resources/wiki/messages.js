import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  heading: {
    id: 'course-authoring.pages-resources.wiki.heading',
    defaultMessage: 'Configure wiki',
  },
  enableWikiLabel: {
    id: 'course-authoring.pages-resources.wiki.enable-wiki.label',
    defaultMessage: 'Wiki',
  },
  enableWikiHelp: {
    id: 'course-authoring.pages-resources.wiki.enable-wiki.help',
    defaultMessage: `The course wiki can be set up based on the needs of your
    course. Common uses might include sharing answers to course FAQs, sharing
    editable course information, or providing access to learner-created
    resources.`,
  },
  enableWikiLink: {
    id: 'course-authoring.pages-resources.wiki.enable-wiki.link',
    defaultMessage: 'Learn more about the wiki',
  },
  enablePublicWikiLabel: {
    id: 'course-authoring.pages-resources.wiki.enable-public-wiki.label',
    defaultMessage: 'Enable public wiki access',
  },
  enablePublicWikiHelp: {
    id: 'course-authoring.pages-resources.wiki.enable-public-wiki.help',
    defaultMessage: `If enabled, edX users can view the course wiki even when
    they're not enrolled in the course.`,
  },
});

export default messages;
