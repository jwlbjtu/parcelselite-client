export interface UpdateData {
  id: string;
  [key: string]: any;
}

export interface ResponseError<D = any> extends Error {
  name: string;
  data: D;
  response: Response & { data: any };
  request: {
    url: string;
    options: RequestOptionsInit;
  };
  type: string;
}
