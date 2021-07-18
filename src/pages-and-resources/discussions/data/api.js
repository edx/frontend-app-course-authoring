import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

function normalizeLtiConfig(data) {
  if (!data || Object.keys(data).length < 1) {
    return {};
  }

  return {
    consumerKey: data.lti_1p1_client_key,
    consumerSecret: data.lti_1p1_client_secret,
    launchUrl: data.lti_1p1_launch_url,
  };
}

function normalizeDiscussionTopic(data) {
  return Object.entries(data).map(([key, value]) => (
    {
      name: key,
      id: value.id,
    }
  ));
}

function extractDiscussionTopicIds(data) {
  return Object.entries(
    data,
    // eslint-disable-next-line no-unused-vars
  ).map(([key, value]) => value.id);
}

function normalizePluginConfig(data) {
  if (!data || Object.keys(data).length < 1) {
    return {};
  }
  return {
    allowAnonymousPosts: data.allow_anonymous,
    allowAnonymousPostsPeers: data.allow_anonymous_to_peers,
    blackoutDates: JSON.stringify(data.discussion_blackouts),
    allowDivisionByUnit: false,
    divideByCohorts: data.divided_course_wide_discussions.length > 0,
    divideCourseTopicsByCohorts: false,
  };
}

function normalizeApps(data) {
  const apps = Object.entries(data.providers.available).map(([key, app]) => ({
    id: key,
    messages: app.messages || {},
    featureIds: app.features,
    // TODO: Fix this and get it from the backend!
    externalLinks: {
      learnMore: app.external_links.learn_more,
      configuration: app.external_links.configuration,
      general: app.external_links.general,
      accessibility: app.external_links.accessibility,
      contactEmail: app.external_links.contact_email,
    },
    hasFullSupport: app.features.length >= data.features.length,
  }));
  return {
    courseId: data.context_key,
    enabled: data.enabled,
    features: data.features.map(id => ({
      id,
    })),
    appConfig: {
      id: data.providers.active,
      ...normalizePluginConfig(data.plugin_configuration),
      ...normalizeLtiConfig(data.lti_configuration),
    },
    activeAppId: data.providers.active,
    apps,
    discussionTopicIds: data.plugin_configuration.discussion_topics
      ? extractDiscussionTopicIds(data.plugin_configuration.discussion_topics) : [],
    discussionTopics: data.plugin_configuration.discussion_topics
      ? normalizeDiscussionTopic(data.plugin_configuration.discussion_topics) : [],
    divideDiscussionIds: data.plugin_configuration.divided_course_wide_discussions,
  };
}

function denormalizeData(courseId, appId, data) {
  const pluginConfiguration = {};

  if (data.allowAnonymousPosts) {
    pluginConfiguration.allow_anonymous = data.allowAnonymousPosts;
  }
  if (data.allowAnonymousPostsPeers) {
    pluginConfiguration.allow_anonymous_to_peers = data.allowAnonymousPostsPeers;
  }
  if (data.blackoutDates) {
    pluginConfiguration.discussion_blackouts = JSON.parse(data.blackoutDates);
  }
  if (data.discussionTopics?.length) {
    pluginConfiguration.discussion_topics = data.discussionTopics.reduce((topics, currentTopic) => {
      const newTopics = { ...topics };
      newTopics[currentTopic.name] = { id: currentTopic.id };
      return newTopics;
    }, {});
  }
  if (data.divideDiscussionIds) {
    pluginConfiguration.divided_course_wide_discussions = data.divideDiscussionIds;
  }

  const ltiConfiguration = {};

  if (data.consumerKey) {
    ltiConfiguration.lti_1p1_client_key = data.consumerKey;
  }
  if (data.consumerSecret) {
    ltiConfiguration.lti_1p1_client_secret = data.consumerSecret;
  }
  if (data.launchUrl) {
    ltiConfiguration.lti_1p1_launch_url = data.launchUrl;
  }

  if (Object.keys(ltiConfiguration).length > 0) {
    // Only add this in if we're sending LTI fields.
    // TODO: Eventually support LTI v1.3 here.
    ltiConfiguration.version = 'lti_1p1';
  }

  return {
    context_key: courseId,
    enabled: true,
    lti_configuration: ltiConfiguration,
    plugin_configuration: pluginConfiguration,
    provider_type: appId,
  };
}

export function getAppsUrl(courseId) {
  return `${getConfig().LMS_BASE_URL}/discussions/api/v0/${courseId}`;
}

export async function getApps(courseId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(getAppsUrl(courseId));

  return normalizeApps(data);
}

export async function postAppConfig(courseId, appId, values) {
  const { data } = await getAuthenticatedHttpClient().post(
    getAppsUrl(courseId),
    denormalizeData(courseId, appId, values),
  );

  return normalizeApps(data);
}
