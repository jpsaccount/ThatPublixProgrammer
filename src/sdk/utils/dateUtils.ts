import moment, { Moment } from "moment";
import { isUsable } from "./usabilityUtils";

export function getUtcDate(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
    ),
  );
}

export function toUtcDate(date: Date | undefined | null): Date | null {
  if (isUsable(date) === false) return null;
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    ),
  );
}

export function getUtcMoment(): Moment {
  return moment.utc(moment.now());
}

export function areDatesEqual(date1: Moment, date2: Moment) {
  return date1 === date2;
}

export function dateReviver(key: any, value: any): any {
  if (typeof value !== "string") return value;
  const isUtcOrLocalDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,7})?(Z)?$/.test(value);
  if (isUtcOrLocalDate) {
    return moment.utc(value);
  } else {
    const isTimeZoneDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,7})?[+-]\d{2}:\d{2}$/.test(value);
    if (isTimeZoneDate) {
      return moment(value);
    }
  }
  if (key === "StartDate") {
    debugger;
  }
  return value;
}

export function addDates(date1: Moment, date2: Moment): Moment {
  const duration = moment.duration(date2.diff(date1));

  return date1.add(duration);
}

export function addDays(date1: Moment, days: number): Moment {
  var newDate = date1.add(days, "days");
  return newDate;
}
