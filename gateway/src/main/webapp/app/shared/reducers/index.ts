import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale, { LocaleState } from './locale';
import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from './user-management';
// prettier-ignore
import blog, {
  BlogState
} from 'app/entities/blog/blog/blog.reducer';
// prettier-ignore
import post, {
  PostState
} from 'app/entities/blog/post/post.reducer';
// prettier-ignore
import tag, {
  TagState
} from 'app/entities/blog/tag/tag.reducer';
// prettier-ignore
import product, {
  ProductState
} from 'app/entities/store/product/product.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly blog: BlogState;
  readonly post: PostState;
  readonly tag: TagState;
  readonly product: ProductState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  locale,
  applicationProfile,
  administration,
  userManagement,
  blog,
  post,
  tag,
  product,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
});

export default rootReducer;
