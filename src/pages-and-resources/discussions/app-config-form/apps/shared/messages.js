import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  // Division by cohort fields
  divisionByGroup: {
    id: 'authoring.discussions.builtIn.divisionByGroup',
    defaultMessage: 'Cohorts',
  },
  divideByCohortsLabel: {
    id: 'authoring.discussions.builtIn.divideByCohorts.label',
    defaultMessage: 'Divide discussions by cohorts',
    description: 'Label for a switch that enables dividing discussions by cohorts.  allowDivisionByUnit, divideCourseWideTopics, divideGeneralTopic, and divideQuestionsForTAs are only used if this setting is true.',
  },
  divideByCohortsHelp: {
    id: 'authoring.discussions.builtIn.divideByCohorts.help',
    defaultMessage: 'Learners will only be able to view and respond to discussions posted by members of their cohort.',
    description: 'Help text for a switch that enables dividing discussions by cohorts.',
  },
  divideCourseTopicsByCohortsLabel: {
    id: 'authoring.discussions.builtIn.divideCourseTopicsByCohorts.label',
    defaultMessage: 'Divide course-wide discussion topics',
    description: 'Label for a switch that enables dividing course wide topics by cohorts.',
  },
  divideCourseTopicsByCohortsHelp: {
    id: 'authoring.discussions.builtIn.divideCourseTopicsByCohorts.help',
    defaultMessage: 'Choose which of your general course-wide discussion topics you would like to divide.',
    description: 'Help text asking the user to pick course-wide topics that should be divided by cohort.',
  },
  divideGeneralTopic: {
    id: 'authoring.discussions.builtIn.divideGeneralTopic.label',
    defaultMessage: 'General',
    description: 'Label for a checkbox allowing a user to divide the General course wide topic by cohorts.',
  },
  divideQuestionsForTAsTopic: {
    id: 'authoring.discussions.builtIn.divideQuestionsForTAsTopic.label',
    defaultMessage: 'Questions for the TAs',
    description: 'Label for a checkbox allowing a user to divide the Questions for the TAs (TA stands for "teaching assistant") course wide topic by cohorts.',
  },

  // In-context discussion fields
  visibilityInContext: {
    id: 'authoring.discussions.builtIn.visibilityInContext',
    defaultMessage: 'Visibility of in-context discussions',
  },
  inContextDiscussionLabel: {
    id: 'authoring.discussions.builtIn.inContextDiscussion.label',
    defaultMessage: 'In-context discussion',
  },
  inContextDiscussionHelp: {
    id: 'authoring.discussions.builtIn.inContextDiscussion.help',
    defaultMessage: 'Learners will be able to view or hide a discussion side panel to engage with discussion on the course unit page.',
  },
  gradedUnitPagesLabel: {
    id: 'authoring.discussions.builtIn.gradedUnitPages.label',
    defaultMessage: 'Graded unit pages',
  },
  gradedUnitPagesHelp: {
    id: 'authoring.discussions.builtIn.gradedUnitPages.help',
    defaultMessage: 'Allow learners to engage with discussion on all graded unit pages except timed exams.',
  },
  groupInContextSubsectionLabel: {
    id: 'authoring.discussions.builtIn.groupInContextSubsection.label',
    defaultMessage: 'Group in context discussion at the subsection level',
  },
  groupInContextSubsectionHelp: {
    id: 'authoring.discussions.builtIn.groupInContextSubsection.help',
    defaultMessage: 'Learners will be able to view any post in the sub-section no matter which unit page they are viewing. While this is not recommended, if your course has short learning sequences or low enrollment grouping may increase engagement.',
  },
  allowUnitLevelVisibilityLabel: {
    id: 'authoring.discussions.builtIn.allowUnitLevelVisibility.label',
    defaultMessage: 'Allow visibility configuration for each course unit',
  },
  allowUnitLevelVisibilityHelp: {
    id: 'authoring.discussions.builtIn.allowUnitLevelVisibility.help',
    defaultMessage: 'With this advanced setting enabled you will be able to override the global visibility setting and turn discussions on or off for each unit from the course outline view..',
  },

  // Anonymous posting fields
  anonymousPosting: {
    id: 'authoring.discussions.builtIn.anonymousPosting',
    defaultMessage: 'Anonymous posting',
  },
  allowAnonymousPostsLabel: {
    id: 'authoring.discussions.builtIn.allowAnonymous.label',
    defaultMessage: 'Allow anonymous discussion posts',
  },
  allowAnonymousPostsHelp: {
    id: 'authoring.discussions.builtIn.allowAnonymous.help',
    defaultMessage: 'If enabled, learners can create posts that are anonymous to all users.',
  },
  allowAnonymousPostsPeersLabel: {
    id: 'authoring.discussions.builtIn.allowAnonymousPeers.label',
    defaultMessage: 'Allow anonymous discussion posts to peers',
  },
  allowAnonymousPostsPeersHelp: {
    id: 'authoring.discussions.builtIn.allowAnonymousPeers.help',
    defaultMessage: 'Learners will be able to post anonymously to other peers but all posts will be visible to course staff.',
  },

  // Discussion Topics
  discussionTopics: {
    id: 'authoring.discussions.discussionTopics',
    defaultMessage: 'Discussion topics',
  },
  discussionTopicsLabel: {
    id: 'authoring.discussions.discussionTopics.label',
    defaultMessage: 'General discussion topics',
    description: 'Label for a discussion topic section allowing a user to add new topic.',
  },
  discussionTopicsHelp: {
    id: 'authoring.discussions.discussionTopics.help',
    defaultMessage: 'Discussions can include general topics not contained to the course structure. All courses have a general topic by default.',
    description: 'Help text for adding new discussion topics that in general discussion topic section.',
  },
  discussionTopicRequired: {
    id: 'authoring.discussions.discussionTopic.required',
    defaultMessage: 'Topic name is a required field',
    description: 'Tells the user that the discussion topic field is required and must have a value.',
  },
  discussionTopicNameAlreadyExist: {
    id: 'authoring.discussions.discussionTopic.alreadyExistError',
    defaultMessage: 'It looks like this name is already in use',
    description: 'Tells the user that the discussion topic name already in use and must have a unique name.',
  },
  addTopicButton: {
    id: 'authoring.discussions.addTopicButton',
    defaultMessage: 'Add topic',
    description: 'Button label when Add a new discussion topic.',
  },
  deleteButton: {
    id: 'authoring.discussions.deleteButton',
    defaultMessage: 'Delete',
    description: 'Button label when delete discussion topic from conformation card.',
  },
  cancelButton: {
    id: 'authoring.discussions.cancelButton',
    defaultMessage: 'Cancel',
    description: 'Button label when cancel discussion topic deletion conformation.',
  },
  discussionTopicDeletionHelp: {
    id: 'authoring.discussions.discussionTopicDeletion.help',
    defaultMessage: 'edX recommends that you do not delete discussion topics once your course is running.',
    description: 'Help text for delete a discussion topic from discussion topic section.',
  },
  discussionTopicDeletionLabel: {
    id: 'authoring.discussions.discussionTopicDeletion.label',
    defaultMessage: 'Delete this topic?',
    description: 'Label for discussion topic delete popup allowing a user to delete a topic.',
  },
  renameGeneralTopic: {
    id: 'authoring.discussions.builtIn.renameGeneralTopic.label',
    defaultMessage: 'Rename general topic',
    description: 'Label for default topic allowing user to rename default general topic',
  },
  generalTopicHelp: {
    id: 'authoring.discussions.generalTopicHelp.help',
    defaultMessage: 'This is the default discussion topic for your course.',
    description: 'Help text for general discussion topic collapsible card.',
  },
  configureAdditionalTopic: {
    id: 'authoring.discussions.builtIn.configureAdditionalTopic.label',
    defaultMessage: 'Configure topic',
    description: 'Label for Additional topic allowing user to configure additional topic name',
  },
  addTopicHelpText: {
    id: 'authoring.discussions.addTopicHelpText',
    defaultMessage: 'Choose a unique name for your topic',
    description: 'Help text for input field in adding a discussion topic',
  },
  // Blackout dates
  blackoutDates: {
    id: 'authoring.discussions.blackoutDates',
    defaultMessage: 'Discussion blackout dates',

  },
  blackoutDatesLabel: {
    id: 'authoring.discussions.builtIn.blackoutDates.label',
    defaultMessage: 'Blackout dates',
  },
  blackoutDatesHelp: {
    id: 'authoring.discussions.builtIn.blackoutDates.help',
    defaultMessage:
      `Enter pairs of dates between which students cannot post to discussion forums. Inside the provided
      brackets, enter an additional set of square brackets surrounding each pair of dates you add.
      Format each pair of dates as ["YYYY-MM-DD", "YYYY-MM-DD"]. To specify times as well as dates,
      format each pair as ["YYYY-MM-DDTHH:MM", "YYYY-MM-DDTHH:MM"]. Be sure to include the "T" between
      the date and time. For example, an entry defining two blackout periods looks like this, including
      the outer pair of square brackets: [["2015-09-15", "2015-09-21"], ["2015-10-01", "2015-10-08"]]`,
  },
  blackoutDatesFormattingError: {
    id: 'authoring.discussions.builtIn.blackoutDates.formattingError',
    defaultMessage: "There's a formatting error in your blackout dates.",
  },
  deleteAltText: {
    id: 'authoring.topics.delete',
    defaultMessage: 'Delete Topic',
  },
  expandAltText: {
    id: 'authoring.topics.expand',
    defaultMessage: 'Expand',
  },
  collapseAltText: {
    id: 'authoring.topics.collapse',
    defaultMessage: 'Collapse',
  },
});

export default messages;
