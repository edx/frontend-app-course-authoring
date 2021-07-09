import { configureStore } from '@reduxjs/toolkit';

import { reducer as courseDetailReducer } from './data/slice';
import { reducer as modelsReducer } from './generic/model-store';
import { reducer as pagesAndResourcesReducer } from './pages-and-resources/data/slice';
import { reducer as discussionsReducer } from './pages-and-resources/discussions';

export default function initializeStore() {
  return configureStore({
    reducer: {
      courseDetail: courseDetailReducer,
      discussions: discussionsReducer,
      pagesAndResources: pagesAndResourcesReducer,
      models: modelsReducer,
    },
  });
}
