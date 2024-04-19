import { inject, injectable } from "inversify";
import { AuthService, LocalStorageService } from "..";
import { Entity } from "../contracts/Entity";
import { ObjectSyncedResponse } from "../models/ObjectSyncedResponse";
import { PagedResponse } from "../models/PagedResponse";
import { AnyRequestResponse, RequestResponse } from "../models/RequestResponse";
import { SdkOptions } from "../models/SdkOptions";
import { isUsable } from "../utils/usabilityUtils";
import { AnyEntityService } from "./AnyEntityService";
import { HttpRequestHandler } from "./Http/HttpRequestHandler";
import { getEntityRoute } from "./Http/getEntityRoute";
import { StateHandler } from "./StateHandler";
import { getService } from "./serviceProvider";
import { aB } from "vitest/dist/reporters-1evA5lom.js";
import { delay } from "../utils/asyncUtils";

@injectable()
export class EntityService<T extends Entity> extends AnyEntityService {
  private _httpRequestHandler: HttpRequestHandler;
  private _stateHandler: StateHandler;

  constructor(
    @inject(HttpRequestHandler) httpRequestHandler: HttpRequestHandler,
    @inject(StateHandler) stateHandler: StateHandler,
  ) {
    super();
    this._httpRequestHandler = httpRequestHandler;
    this._stateHandler = stateHandler;
  }

  _baseRoute: string = "";

  async setBasePath<T>(entityType: new (...args: any[]) => T) {
    this._baseRoute = getEntityRoute(entityType);
  }

  async createRoute(relativePath: string): Promise<string> {
    const serverPath = getService(SdkOptions).ServerPath;
    const fullPath = `${serverPath}${this._baseRoute}${relativePath}`;
    let url = new URL(fullPath);

    const auth = getService(AuthService).Auth;
    const atid = getService(LocalStorageService).getItem<string>("atid");
    let params = new URLSearchParams(url.searchParams);
    params.append("key", await auth.getIdToken());
    params.append("oid", atid);

    url.search = params.toString();
    return url.toString();
  }

  async getFirstWhereAsync(query: string): Promise<RequestResponse<T>> {
    query = query + " OFFSET 0 LIMIT 1";

    const route = this._baseRoute + "where";

    const response = await this._httpRequestHandler.postAsync<T[]>(route, JSON.stringify(query));

    var singleResultResponse = new RequestResponse<T>();
    singleResultResponse.setFromResponse(response);
    if (response.isSuccess()) {
      singleResultResponse.data = response.data[0];
    }

    if (singleResultResponse.data === undefined) {
      singleResultResponse.data = null;
    }

    return singleResultResponse;
  }

  async customGetAsync<T>(url: string, abortController?: AbortController): Promise<RequestResponse<T>> {
    let route = this._baseRoute + url;
    return await this._httpRequestHandler.getAsync<T>(route, abortController);
  }

  async customPostAsync<T, TData>(
    url: string,
    data: TData,
    abortController?: AbortController,
  ): Promise<RequestResponse<T>> {
    let route = this._baseRoute + url;
    return await this._httpRequestHandler.postAsync<T>(route, data, abortController);
  }

  async uploadAsync(entity: T, file: File, abortController?: AbortController): Promise<RequestResponse> {
    if ("AttachmentMetadata" in entity === false) {
      throw new Error("Entity must be an AttachmentEntity");
    }
    const formData = new FormData();
    formData.append("file", file);
    let route = this._baseRoute + `upload/form?id=${entity.id}`;
    return await this._httpRequestHandler.postAsync<T>(route, formData, abortController);
  }

  private pendingBatchIds = new Set<string>();
  private batchPromise: Promise<RequestResponse<T[]>> | null = null;
  private batchTimeout: NodeJS.Timeout | null = null;

  async getAsync(id: string, abortController?: AbortController): Promise<RequestResponse<T>> {
    this.pendingBatchIds.add(id);

    if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(async () => {
        if (this.pendingBatchIds.size > 0) {
          try {
            this.batchPromise = this.getWhereAsync(
              `WHERE c.id IN ['${Array.from(this.pendingBatchIds).join("','")}']`,
              undefined,
              abortController,
            );
            this.pendingBatchIds.clear();
          } catch (error) {
            // Handle error scenario
            console.error("Batch request failed", error);
          }
        }
        this.batchTimeout = null;
      }, 10);
    }
    await delay(10);

    const response = new RequestResponse();
    try {
      const batchResults = await this.batchPromise;
      console.log(batchResults);
      if (batchResults.error) {
        response.error = batchResults.error;
      } else {
        const individualResult = batchResults.data.find((x) => x.id == id);
        response.data = individualResult;
      }
    } catch (error) {
      response.error = error;
    }
    if (response.data === undefined) response.data = null;
    return response;
  }

  async getWhereAsync(
    query: string,
    queryParams?: Map<string, string>,
    abortController?: AbortController,
  ): Promise<RequestResponse<T[]>> {
    let route = this._baseRoute + "where";

    console.log("getting where");
    const response = await this._httpRequestHandler.postAsync<T[]>(route, JSON.stringify(query), abortController);

    if (response.isSuccess()) {
      if (isUsable(response.data) === false) {
        response.data = Array.of();
      }
    }

    return response;
  }

  async getPagedWhereAsync(
    query: string,
    queryParams?: Map<string, string>,
    abortController?: AbortController,
  ): Promise<RequestResponse<PagedResponse<T>>> {
    const result = this.getWhereAsync(query, queryParams, abortController);
    return result as unknown as RequestResponse<PagedResponse<T>>;
  }

  async insertAsync(
    entity: T,
    abortController?: AbortController | undefined,
  ): Promise<RequestResponse<ObjectSyncedResponse>> {
    const path = this._baseRoute;
    const insertResponse = await this._httpRequestHandler.postAsync<ObjectSyncedResponse>(
      path,
      entity,
      abortController,
    );
    if (insertResponse.isSuccess()) {
      await this.updateStateAsync(entity, insertResponse.data);
    }

    return insertResponse;
  }

  private async updateStateAsync(entity: T, response: ObjectSyncedResponse): Promise<void> {
    entity.id = response.Id;
    entity._etag = response.SyncToken;
    await this._stateHandler.updateStateAsync(response.StateChanges);
  }

  async upsertAsync(
    entity: T,
    abortController?: AbortController | undefined,
  ): Promise<RequestResponse<ObjectSyncedResponse>> {
    const path = this._baseRoute + entity.id;
    const updateResponse = await this._httpRequestHandler.putAsync<ObjectSyncedResponse>(path, entity, abortController);

    if (updateResponse.isSuccess()) {
      await this.updateStateAsync(entity, updateResponse.data);
    }

    return updateResponse;
  }
  async deleteAsync(entity: T): Promise<AnyRequestResponse> {
    const path = this._baseRoute + entity.id;
    const updateResponse = await this._httpRequestHandler.deleteAsync(path);

    return updateResponse;
  }
}
