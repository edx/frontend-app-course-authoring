import React from 'react';

import { queryByTestId, render } from '@testing-library/react';

import { IntlProvider } from '@edx/frontend-platform/i18n';

import FeaturesTable from './FeaturesTable';

describe('FeaturesTable', () => {
  let apps;
  let features;
  let container;

  beforeEach(() => {
    apps = [
      {
        externalLinks: {},
        featureIds: ['discussion-page', 'embedded-course-sections', 'wcag-2.1'],
        hasFullSupport: false,
        id: 'legacy',
      },
      {
        externalLinks: {},
        featureIds: ['discussion-page', 'lti'],
        hasFullSupport: false,
        id: 'piazza',
      }];

    features = [
      { id: 'lti' },
      { id: 'wcag-2.1' },
      { id: 'discussion-page' },
      { id: 'embedded-course-sections' },
    ];

    const wrapper = render(
      <IntlProvider locale="en">
        <FeaturesTable
          apps={apps}
          features={features}
        />
      </IntlProvider>,
    );
    container = wrapper.container;
  });

  test('displays a table, a thead, a tbody', () => {
    expect(container.querySelectorAll('table')).toHaveLength(1);
    expect(container.querySelectorAll('table > thead')).toHaveLength(1);
    expect(container.querySelectorAll('table > tbody')).toHaveLength(1);
  });

  test('displays a row for each available feature', () => {
    expect(container.querySelectorAll('tbody > tr')).toHaveLength(features.length);
  });

  test('apps columns receive a check for each feature they support', () => {
    features.forEach((feature) => {
      apps.forEach(app => {
        if (app.featureIds.includes(feature.id)) {
          const columnId = `${app.id}-${feature.id.replaceAll('.', '-')}`;
          const columnCell = queryByTestId(container, columnId);

          expect(columnCell.querySelector('#check-icon')).toBeInTheDocument();
        }
      });
    });
  });

  test('apps columns receive a dash for each unsupported feature', () => {
    features.forEach((feature) => {
      apps.forEach(app => {
        if (!app.featureIds.includes(feature.id)) {
          const columnId = `${app.id}-${feature.id.replaceAll('.', '-')}`;
          const columnCell = queryByTestId(container, columnId);

          expect(columnCell.querySelector('#remove-icon')).toBeInTheDocument();
        }
      });
    });
  });
});
