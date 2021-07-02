import React, { Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import { Switch, useRouteMatch } from 'react-router';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { PageRoute } from '@edx/frontend-platform/react';

import { useModels } from '../generic/model-store';
import { fetchCourseApps } from './data/thunks';
import PageGrid from './pages/PageGrid';
import ResourceList from './resources/ResourcesList';
import DiscussionsSettings from './discussions';
import messages from './messages';
import PagesAndResourcesProvider from './PagesAndResourcesProvider';

function PagesAndResources({ courseId, intl }) {
  const { path, url } = useRouteMatch();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCourseApps(courseId));
  }, [courseId]);

  const courseAppIds = useSelector(state => state.pagesAndResources.courseAppIds);
  // Each page here is driven by a course app
  const pages = useModels('courseApps', courseAppIds);

  return (
    <PagesAndResourcesProvider courseId={courseId}>
      <main className="container container-mw-md">
        <h3 className="mt-5 mb-5">{intl.formatMessage(messages.heading)}</h3>
        <PageGrid pages={pages} />
        <ResourceList />
        <Switch>
          <PageRoute
            path={[
              `${path}/discussion/configure/:appId`,
              `${path}/discussion`,
            ]}
          >
            <DiscussionsSettings courseId={courseId} />
          </PageRoute>
          <PageRoute path={`${path}/:appId/settings`}>
            {
              ({ match, history }) => {
                const SettingsComponent = React.lazy(async () => {
                  try {
                    // There seems to be a bug in babel-eslint that causes the checker to crash with the following error
                    // if we use a template string here:
                    //     TypeError: Cannot read property 'range' of null with using template strings here.
                    // Ref: https://github.com/babel/babel-eslint/issues/530
                    return await import('./' + match.params.appId + '/Settings.jsx'); // eslint-disable-line
                  } catch (error) {
                    console.trace(error); // eslint-disable-line no-console
                    return null;
                  }
                });
                return (
                  <Suspense fallback="...">
                    <SettingsComponent onClose={() => history.push(url)} />
                  </Suspense>
                );
              }
            }
          </PageRoute>
        </Switch>
      </main>
    </PagesAndResourcesProvider>
  );
}

PagesAndResources.propTypes = {
  courseId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(PagesAndResources);
