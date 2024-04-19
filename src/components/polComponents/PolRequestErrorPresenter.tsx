import { AnyRequestResponse } from "@sdk/./models/RequestResponse";

interface Props {
  Response: AnyRequestResponse;
}

export function PolRequestErrorPresenter({ Response }: Props) {
  return <>{Response.isSuccess() ? <></> : <h3>{Response.message}</h3>}</>;
}
