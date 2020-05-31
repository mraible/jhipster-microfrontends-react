import { IPost } from 'app/shared/model/blog/post.model';

export interface ITag {
  id?: number;
  name?: string;
  posts?: IPost[];
}

export const defaultValue: Readonly<ITag> = {};
