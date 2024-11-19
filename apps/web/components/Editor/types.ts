export interface JsonData {
  _object?: JsonData;
  data?: JsonData;
  _key?: string;
  __v_isRef?: boolean;
  [key: string]: any;
}
