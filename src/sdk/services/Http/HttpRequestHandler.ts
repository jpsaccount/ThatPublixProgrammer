import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { inject, injectable } from "inversify";
import { HttpMessage } from "../../models/HttpMessage";
import { HttpProblemDetails } from "../../models/HttpProblemDetails";
import { RequestResponse } from "../../models/RequestResponse";
import { SdkOptions } from "../../models/SdkOptions";
import { convertDateStringsToDate } from "./AxiosDateReviverInterceptor";
import { HttpMessageHandler } from "./HttpMessageHandler";

const onErrorCallbacks = new Set<(response: any) => Promise<boolean>>();
export function onSdkRequestErrors(shouldRetryCallback: (response: AxiosError) => Promise<boolean>) {
  if (onErrorCallbacks.has(shouldRetryCallback) === false) onErrorCallbacks.add(shouldRetryCallback);
}

@injectable()
export class HttpRequestHandler {
  axiosInstance: AxiosInstance;
  httpMessageHandler: HttpMessageHandler;

  constructor(
    @inject(HttpMessageHandler) httpMessageHandler: HttpMessageHandler,
    @inject(SdkOptions) sdkOptions: SdkOptions,
  ) {
    this.axiosInstance = axios.create({
      baseURL: sdkOptions.ServerPath,
      timeout: 30000,
    });
    this.axiosInstance.defaults.headers.common["X-Client-MacAddress"] = undefined;
    this.axiosInstance.defaults.headers.common["X-Client-Device-Identifier"] = undefined;
    this.axiosInstance.defaults.headers.common["X-Client-IP"] = undefined;
    this.axiosInstance.defaults.headers.common["X-Machine-Name"] = undefined;
    this.axiosInstance.defaults.headers.common["X-SignalR-Connection-Id"] = undefined;
    this.axiosInstance.interceptors.response.use((response) => {
      if (response.data && typeof response.data === "object") {
        convertDateStringsToDate(response.data);
      }
      return response;
    });
    this.httpMessageHandler = httpMessageHandler;
  }

  private MapResponse<T>(axiosResponse: AxiosResponse<T>): RequestResponse<T> {
    var requestResponse = new RequestResponse<T>();
    requestResponse.isLoading = false;
    requestResponse.data = axiosResponse.data;
    requestResponse.status = axiosResponse.status;
    requestResponse.message = axiosResponse.statusText;
    requestResponse.headers = axiosResponse.headers;
    return requestResponse;
  }

  async sendAsync<T>(message: HttpMessage<any>): Promise<RequestResponse<T>> {
    const limit = 3;
    let currentRun = 1;

    while (currentRun <= limit) {
      try {
        defaultHeaderValues.forEach((value, key) => {
          this.axiosInstance.defaults.headers.common[key] = value;
        });
        const response: AxiosResponse<T> = await this.axiosInstance<T>(message);
        return this.MapResponse(response);
      } catch (error) {
        console.error("Error:", error);

        const errorResponse = new RequestResponse<T>();
        errorResponse.status = 500;
        errorResponse.error = error;
        if (error instanceof AxiosError) {
          errorResponse.status = error.status;
          errorResponse.message = error.message;
          if (typeof error.response?.data.Detail === "string") {
            const problemDetails: HttpProblemDetails = { ...error.response.data };
            errorResponse.message = problemDetails.Title + ": " + problemDetails.Detail;
            error.message = problemDetails.Title + ": " + problemDetails.Detail;
          }
        }
        if (onErrorCallbacks.size > 0) {
          const calls = Array.from(onErrorCallbacks).map((callback) => callback(error));
          const results = await Promise.all(calls);
          const wantedToReturnError = results.every((x) => x === false);
          if (wantedToReturnError) {
            return errorResponse;
          }
        } else {
          return errorResponse;
        }

        if (currentRun++ === 3) {
          return errorResponse;
        }
      }
    }
  }

  getAsync<T>(path: string, abortController?: AbortController | undefined): Promise<RequestResponse<T>> {
    const url = path;
    const method = "get";
    const message = this.httpMessageHandler.BuildMessage(
      url,
      method,
      undefined,
      undefined,
      undefined,
      abortController?.signal,
    );

    return this.sendAsync(message);
  }

  async postAsync<T>(
    path: string,
    value: any,
    abortController?: AbortController | undefined,
  ): Promise<RequestResponse<T>> {
    const url = path;
    const method = "post";
    const message = this.httpMessageHandler.BuildMessage(
      url,
      method,
      value,
      abortController?.signal,
      typeof value === "string"
        ? {
            "Content-Type": "application/json",
          }
        : {},
    );

    return this.sendAsync<T>(message);
  }

  async putAsync<T>(
    path: string,
    value: any,
    abortController?: AbortController | undefined,
  ): Promise<RequestResponse<T>> {
    const url = path;
    const method = "put";
    const message = this.httpMessageHandler.BuildMessage(url, method, value, abortController?.signal);

    return this.sendAsync(message);
  }

  async deleteAsync<T>(path: string): Promise<RequestResponse<T>> {
    const url = path;
    const method = "delete";
    const message = this.httpMessageHandler.BuildMessage(url, method);

    return this.sendAsync(message);
  }
}

const defaultHeaderValues = new Map<string, string>();

export function addDefaultSdkHeader(headerName: string, value: string) {
  defaultHeaderValues.set(headerName, value);
}
