import { AccessKeys } from "@/sdk/enums/AccessKeys";
import { User } from "../../entities/core/User";
import { Person } from "../../models/Person";
import { isNullOrWhitespace } from "../stringUtils";
import { isUsable } from "../usabilityUtils";

export function getFullName(person: Person | undefined | null): string {
  if (isUsable(person) === false) return "";
  let name = person.PreferredName.First;
  if (isNullOrWhitespace(person.PreferredName.Last) === false) {
    name += " " + person.PreferredName.Last;
  }
  if (isNullOrWhitespace(person.PreferredName.First)) {
    name = person.LegalName.First + " " + name;
  } else if (isNullOrWhitespace(person.PreferredName.Last)) {
    name = name + " " + person.LegalName.Last;
  }

  return name;
}

export function getFirstName(person: Person | undefined | null): string {
  if (isUsable(person) === false) return "";
  let name = person.PreferredName.First;
  if (isNullOrWhitespace(name)) {
    name = person.LegalName.First;
  }

  return name;
}

export function getLastName(person: Person | undefined | null): string {
  if (isUsable(person) === false) return "";
  let name = person.PreferredName.Last;
  if (isNullOrWhitespace(name)) {
    name = person.LegalName.Last;
  }

  return name;
}
