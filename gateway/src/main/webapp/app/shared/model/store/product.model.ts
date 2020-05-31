export interface IProduct {
  id?: number;
  title?: string;
  price?: number;
  imageContentType?: string;
  image?: any;
}

export const defaultValue: Readonly<IProduct> = {};
