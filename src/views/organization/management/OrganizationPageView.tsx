import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolHeading from "@/components/polComponents/PolHeading";
import PolInput from "@/components/polComponents/PolInput";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/customHooks/auth";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import { Tenant } from "@/sdk/entities/auth/Tenant";
import { TenantUserAccess } from "@/sdk/entities/auth/TenantUserAccess";
import { User } from "@/sdk/entities/core/User";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useState } from "react";

export default function OrganizationPageView() {
  const { activeTenant } = useAuth();
  const tenantRequest = useDbQueryFirst(Tenant, `WHERE c.id = '${activeTenant.id}'`, {
    enabled: isUsable(activeTenant),
  });
  const userAccessRequest = useDbQuery(TenantUserAccess, `WHERE c.TenantId = '${activeTenant.id}'`, {
    enabled: isUsable(activeTenant),
  });
  const { query, searchText, setSearchText } = useSearchParamQueryTemplate(
    "WHERE c.Person.Name CONTAINS '{0}' OR c.Person.Emails CONTAINS '{0}'",
  );
  const [currentUser, setCurrentUser] = useState<User>(null);
  const saveuserAccess = useDbUpsert(TenantUserAccess);
  const users = useDbQuery(User, query);
  const usersRequest = useDbQuery(
    User,
    `WHERE c.id IN ["${userAccessRequest.data?.map((i) => i.UserId).join(`", "`)}"]`,
  );

  function addUser() {
    const userAccess = new TenantUserAccess();
    userAccess.UserId = currentUser.id;
    userAccess.TenantId = activeTenant.id;
    userAccess.Access.push("user");
    return saveuserAccess.mutateAsync(userAccess).then(() => userAccessRequest.refetch());
  }

  function addAccess(userAccess: TenantUserAccess, access: string) {
    const newAccess = { ...userAccess, Access: [...userAccess.Access, access] };

    return saveuserAccess.mutateAsync(newAccess);
  }

  function removeAccess(userAccess: TenantUserAccess, access: string) {
    const newAccess = { ...userAccess, Access: userAccess.Access.filter((x) => x != access) };
    return saveuserAccess.mutateAsync(newAccess);
  }
  return (
    <div>
      <PolRequestPresenter
        request={[usersRequest, userAccessRequest, tenantRequest]}
        onSuccess={() => (
          <div className="grid grid-flow-row">
            <PolHeading className="m-2">{tenantRequest.data.Name}</PolHeading>
            <div className="m-5">
              <div className="m-2 grid grid-flow-col border bg-background-100 p-2">
                <PolHeading className="my-auto" size={3}>
                  Users
                </PolHeading>
                <div className=" ml-auto grid w-1/2 grid-flow-col grid-cols-[1fr_auto]">
                  <PolEntityDropdown<User>
                    value={currentUser}
                    optionsRequest={users}
                    text={searchText}
                    onTextChanged={setSearchText}
                    onValueChanged={(user) => {
                      setCurrentUser(user);
                      setSearchText(getFullName(user?.Person));
                    }}
                    itemTemplate={(x) => (
                      <div className="grid grid-flow-row">
                        <PolText>{getFullName(x.Person)}</PolText>
                        <PolText type="muted">{x.Person.Emails[0]}</PolText>
                      </div>
                    )}
                    nameGetter={(x) => getFullName(x.Person) + " - " + x.Person.Emails[0]}
                  ></PolEntityDropdown>
                  <PolButton variant="ghost" onClick={addUser}>
                    +
                  </PolButton>
                </div>
              </div>
              <div className="flex flex-row flex-wrap">
                {userAccessRequest.data.map((i) => {
                  const user = usersRequest.data.find((x) => x.id == i.UserId);
                  return (
                    <Card className="m-3 min-w-48 p-2">
                      <CardHeader>{getFullName(user?.Person) + " - " + user.Person.Emails[0]}</CardHeader>
                      <CardContent>
                        {i.Access.map((x) => (
                          <div className="grid grid-flow-col grid-cols-[1fr_auto] border-b p-2">
                            <PolText className="my-auto">{x}</PolText>
                            <PolButton variant="ghost" className="h-8 p-1" onClick={() => removeAccess(i, x)}>
                              <PolIcon name="X" size="20" />
                            </PolButton>
                          </div>
                        ))}

                        <InputBox onAdd={(value) => addAccess(i, value)} />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      ></PolRequestPresenter>
    </div>
  );
}

function InputBox({ onAdd }) {
  const [value, setValue] = useState("");

  async function add() {
    if (onAdd) {
      await onAdd(value);
      setValue("");
    }
  }
  return (
    <div className="m-2 grid h-8 grid-flow-col space-x-2">
      <PolInput className="h-8" value={value} onValueChanged={setValue}></PolInput>
      <PolButton onClick={add} className="h-8 p-0">
        <PolIcon name="Plus" stroke="var(--text-100)" className="m-2" />
      </PolButton>
    </div>
  );
}
