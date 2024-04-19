export class AnyRequestResponse {
  status: number;
  message: string;
  headers: any;
  error: Error;
  isLoading: boolean = false;
  isLoadingMore: boolean = false;

  constructor() {}

  isSuccess(): boolean {
    return 200 <= this.status && this.status < 300;
  }
}

export class RequestResponse<T = any> extends AnyRequestResponse {
  data: T;

  constructor() {
    super();
  }

  setFromResponse(response: AnyRequestResponse) {
    this.status = response.status;
    this.message = response.message;
    this.headers = response.headers;
    this.error = response.error;
  }

  isSuccess(): boolean {
    return 200 <= this.status && this.status < 300;
  }
}
