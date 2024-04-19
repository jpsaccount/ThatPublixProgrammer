import { AxiosRequestConfig } from "axios";

export interface HttpMessage<T> extends AxiosRequestConfig {
  data?: T;
  headers?: { [key: string]: string };
}
