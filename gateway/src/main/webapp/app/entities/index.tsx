import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Blog from './blog/blog';
import Post from './blog/post';
import Tag from './blog/tag';
import Product from './store/product';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}blog`} component={Blog} />
      <ErrorBoundaryRoute path={`${match.url}post`} component={Post} />
      <ErrorBoundaryRoute path={`${match.url}tag`} component={Tag} />
      <ErrorBoundaryRoute path={`${match.url}product`} component={Product} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
