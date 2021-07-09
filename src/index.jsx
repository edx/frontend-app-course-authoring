import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';

import { Route, Switch } from 'react-router-dom';

import { messages as footerMessages } from '@edx/frontend-component-footer';
import {
  APP_INIT_ERROR, APP_READY, initialize, mergeConfig,
  subscribe,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';

import CourseAuthoringRoutes from './CourseAuthoringRoutes';
import appMessages from './i18n';
import initializeStore from './store';

import './index.scss';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={initializeStore()}>
      <Switch>
        <Route
          path="/course/:courseId"
          render={({ match }) => {
            const { params: { courseId } } = match;
            return (
              <CourseAuthoringRoutes courseId={courseId} />
            );
          }}
        />
      </Switch>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  handlers: {
    config: () => {
      mergeConfig({
        SUPPORT_URL: process.env.SUPPORT_URL || null,
        CALCULATOR_HELP_URL: process.env.CALCULATOR_HELP_URL || null,
      }, 'CourseAuthoringConfig');
    },
  },
  messages: [
    appMessages,
    footerMessages,
  ],
  requireAuthenticatedUser: true,
});
