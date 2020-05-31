import { Moment } from 'moment';
import { IBlog } from 'app/shared/model/blog/blog.model';
import { ITag } from 'app/shared/model/blog/tag.model';

export interface IPost {
  id?: number;
  title?: string;
  content?: any;
  date?: string;
  blog?: IBlog;
  tags?: ITag[];
}

export const defaultValue: Readonly<IPost> = {};
