import { GenericAbortSignal } from "axios";
import { HttpMessage } from "../../models/HttpMessage";
import { injectable } from "inversify";

@injectable()
export class HttpMessageHandler {
  BuildMessage<T>(
    url: string,
    method: string,
    data?: T,
    params?: object,
    headers?: { [key: string]: string },
    signal?: GenericAbortSignal | undefined
  ): HttpMessage<T> {
    return {
      url,
      method,
      data,
      params,
      headers,
      signal,
    };
  }
}
