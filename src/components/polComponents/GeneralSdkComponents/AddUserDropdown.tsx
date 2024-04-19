import React, { useState } from "react";
import PolEntityDropdown from "../PolEntityDropdown";
import useQueryTemplate from "@/customHooks/sdkHooks/useQueryTemplate";
import { User } from "@/sdk/entities/core/User";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { PolButton } from "../PolButton";
import PolText from "../PolText";
import PolIcon from "@/components/PolIcon";

interface Props {
  addUser: (user: User) => any;
  users: User[];
  "data-testid"?: string;
}

export default function AddUserDropdown({ addUser, users, ...props }: Props) {
  const { searchText, setSearchText, query } = useQueryTemplate(
    `WHERE (c.Person.LegalName.First CONTAINS '{0}' OR 
    c.Person.LegalName.Middle CONTAINS '{0}' OR 
    c.Person.LegalName.Last CONTAINS '{0}' OR 
    c.Person.Emails CONTAINS '{0}') AND
    c.id NOT IN ["${users?.map((x) => x.id).join(`","`)}"]  ORDER By c.Person.Emails[0] DESC OFFSET 0 LIMIT 10`,
    "OFFSET 0 LIMIT 0",
  );

  const usersRequest = useDbQuery(User, query);

  return (
    <PolEntityDropdown<User>
      data-testid={props["data-testid"]}
      placeHolder={"Search by name or email..."}
      noOptionsDropdownView={searchText.length > 0 ? "No one found" : "Type to start searching..."}
      optionsRequest={usersRequest}
      text={searchText}
      onTextChanged={setSearchText}
      onValueChanged={(user) => {
        user && addUser && addUser(user);
        setSearchText("");
      }}
      itemTemplate={(x) => (
        <div className="grid grid-flow-row">
          <PolText>{getFullName(x.Person)}</PolText>
          <PolText type="muted">{x.Person.Emails[0]}</PolText>
        </div>
      )}
      nameGetter={(x) => getFullName(x.Person) + " - " + x.Person.Emails[0]}
    ></PolEntityDropdown>
  );
}
