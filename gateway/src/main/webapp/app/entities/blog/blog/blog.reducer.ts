import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IBlog, defaultValue } from 'app/shared/model/blog/blog.model';

export const ACTION_TYPES = {
  FETCH_BLOG_LIST: 'blog/FETCH_BLOG_LIST',
  FETCH_BLOG: 'blog/FETCH_BLOG',
  CREATE_BLOG: 'blog/CREATE_BLOG',
  UPDATE_BLOG: 'blog/UPDATE_BLOG',
  DELETE_BLOG: 'blog/DELETE_BLOG',
  RESET: 'blog/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IBlog>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type BlogState = Readonly<typeof initialState>;

// Reducer

export default (state: BlogState = initialState, action): BlogState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_BLOG_LIST):
    case REQUEST(ACTION_TYPES.FETCH_BLOG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_BLOG):
    case REQUEST(ACTION_TYPES.UPDATE_BLOG):
    case REQUEST(ACTION_TYPES.DELETE_BLOG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_BLOG_LIST):
    case FAILURE(ACTION_TYPES.FETCH_BLOG):
    case FAILURE(ACTION_TYPES.CREATE_BLOG):
    case FAILURE(ACTION_TYPES.UPDATE_BLOG):
    case FAILURE(ACTION_TYPES.DELETE_BLOG):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_BLOG_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_BLOG):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_BLOG):
    case SUCCESS(ACTION_TYPES.UPDATE_BLOG):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_BLOG):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'services/blog/api/blogs';

// Actions

export const getEntities: ICrudGetAllAction<IBlog> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_BLOG_LIST,
  payload: axios.get<IBlog>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IBlog> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_BLOG,
    payload: axios.get<IBlog>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IBlog> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_BLOG,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IBlog> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_BLOG,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IBlog> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_BLOG,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
