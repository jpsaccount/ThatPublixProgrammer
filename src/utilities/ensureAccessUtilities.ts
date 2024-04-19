import { AccessKeys } from "@/sdk/enums/AccessKeys";
import { delay } from "@/sdk/utils/asyncUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { AuthContext } from "@/sdkSetup/AuthContext";
import {
  AnyContext,
  AnyRoute,
  BuildLocationFn,
  NavigateFn,
  ParsedLocation,
  RouteConstraints,
  RouteContext,
  redirect,
} from "@tanstack/react-router";
export type IsAny<TValue, TYesResult, TNoResult = TValue> = 1 extends 0 & TValue ? TYesResult : TNoResult;

type BeforeLoadFn<
  TFullSearchSchema,
  TParentRoute extends AnyRoute,
  TAllParams,
  TRouteContextReturn extends RouteContext,
  TRouterContext extends RouteConstraints["TRouterContext"] = AnyContext,
  TContext = IsAny<TParentRoute["types"]["allContext"], TRouterContext>,
> = (opts: {
  search: TFullSearchSchema;
  abortController: AbortController;
  preload: boolean;
  params: TAllParams;
  context: TContext;
  location: ParsedLocation;
  navigate: NavigateFn;
  buildLocation: BuildLocationFn<TParentRoute>;
  cause: "preload" | "enter" | "stay";
}) => Promise<TRouteContextReturn> | TRouteContextReturn | void;

export function ensureAccess<TFullSearchSchema, TParentRoute extends AnyRoute, TAllParams, TRouteContextReturn>(
  access: (typeof AccessKeys)[keyof typeof AccessKeys],
): BeforeLoadFn<TFullSearchSchema, TParentRoute, TAllParams, TRouteContextReturn, AuthContext> {
  return (async ({ location, context }) => {
    console.log("log", context.auth);

    while (context.auth.isLoading) {
      await delay(10);
      console.log("log", context.auth);
    }

    if (isUsable(context.auth.identity) === false) {
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: location.href,
        },
      });
    }
    if (context.auth.hasAccess(access) === false) {
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: location.href,
        },
      });
    }
  }) as BeforeLoadFn<TFullSearchSchema, TParentRoute, TAllParams, TRouteContextReturn, AuthContext>;
}
