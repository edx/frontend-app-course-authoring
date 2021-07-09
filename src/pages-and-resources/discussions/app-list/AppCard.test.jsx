import React from 'react';

import { queryByLabelText, render } from '@testing-library/react';

import { IntlProvider } from '@edx/frontend-platform/i18n';

import AppCard from './AppCard';
import messages from './messages';

describe('AppCard', () => {
  let app;
  let selected;
  let wrapper;

  beforeEach(() => {
    selected = true;
    app = {
      id: 'legacy',
      hasFullSupport: true,
      featureIds: ['discussion-page', 'embedded-course-sections', 'wcag-2.1'],
    };

    wrapper = (data) => render(
      <IntlProvider locale="en">
        <AppCard
          app={data}
          onClick={() => jest.fn()}
          selected={selected}
          features={[]}
        />
      </IntlProvider>,
    );
  });

  test('checkbox input is checked when AppCard is selected', () => {
    const labelText = `Select ${messages[`appName-${app.id}`].defaultMessage}`;

    const { container } = wrapper(app);

    expect(container.querySelector('[role="radio"]')).toBeChecked();
    expect(queryByLabelText(container, labelText, { selector: 'input[type="checkbox"]' })).toBeChecked();
  });

  test.each([
    [true],
    [false],
  ])('title and text from the app are displayed with full support %s', (hasFullSupport) => {
    const appWithCustomSupport = { ...app, hasFullSupport };
    const title = messages[`appName-${appWithCustomSupport.id}`].defaultMessage;
    const text = messages[`appDescription-${appWithCustomSupport.id}`].defaultMessage;

    const { container } = wrapper(appWithCustomSupport);

    expect(container.querySelector('.card-title')).toHaveTextContent(title);
    expect(container.querySelector('.card-text')).toHaveTextContent(text);
  });

  test('full support subtitle shown when hasFullSupport is true', () => {
    const subtitle = messages.appFullSupport.defaultMessage;

    const { container } = wrapper(app);

    expect(container.querySelector('.card-subtitle')).toHaveTextContent(subtitle);
  });

  test('partial support subtitle shown when hasFullSupport is false', () => {
    const appWithPartialSupport = { ...app, hasFullSupport: false };
    const subtitle = messages.appPartialSupport.defaultMessage;

    const { container } = wrapper(appWithPartialSupport);

    expect(container.querySelector('.card-subtitle')).toHaveTextContent(subtitle);
  });
});
