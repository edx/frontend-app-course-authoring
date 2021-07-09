import React from 'react';

import {
  getByRole,
  queryAllByText, queryByText, render,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { IntlProvider } from '@edx/frontend-platform/i18n';

import FeaturesList from './FeaturesList';
import messages from './messages';

describe('FeaturesList', () => {
  const app = {
    externalLinks: {},
    featureIds: ['discussion-page', 'embedded-course-sections', 'wcag-2.1'],
    hasFullSupport: false,
    id: 'legacy',
  };
  const features = [
    { id: 'lti' },
    { id: 'wcag-2.1' },
    { id: 'discussion-page' },
    { id: 'embedded-course-sections' },
  ];
  let container;

  beforeEach(() => {
    const wrapper = render(
      <IntlProvider locale="en">
        <FeaturesList
          app={app}
          features={features}
        />
      </IntlProvider>,
    );
    container = wrapper.container;
  });

  test('displays show app features message', () => {
    expect(queryByText(container, messages['supportedFeatureList-mobile-show'].defaultMessage)).toBeInTheDocument();
  });

  test('displays hide available feature message on expand', () => {
    const button = getByRole(container, 'button');
    userEvent.click(button);
    expect(queryByText(container, messages['supportedFeatureList-mobile-hide'].defaultMessage)).toBeInTheDocument();
  });

  test('displays a row for each available feature', () => {
    const button = getByRole(container, 'button');
    userEvent.click(button);
    features.forEach((feature) => {
      const featureNodes = queryAllByText(
        container, messages[`featureName-${feature.id}`].defaultMessage,
      );
      expect(featureNodes.map(node => node.closest('div'))).toHaveLength(1);
    });
  });

  test('A check icon is shown with each supported feature', () => {
    const button = getByRole(container, 'button');
    userEvent.click(button);
    features.forEach((feature) => {
      const featureElement = queryByText(container, messages[`featureName-${feature.id}`].defaultMessage);
      if (app.featureIds.includes(feature.id)) {
        expect(featureElement.querySelector('svg')).toHaveAttribute('id', 'check-icon');
      }
    });
  });

  test('A dash icon is shown with each unsupported feature', () => {
    const button = getByRole(container, 'button');
    userEvent.click(button);
    features.forEach((feature) => {
      const featureElement = queryByText(container, messages[`featureName-${feature.id}`].defaultMessage);
      if (!app.featureIds.includes(feature.id)) {
        expect(featureElement.querySelector('svg')).toHaveAttribute('id', 'remove-icon');
      }
    });
  });
});
