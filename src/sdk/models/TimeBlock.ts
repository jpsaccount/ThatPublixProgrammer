import { TimeActivity } from "../entities/billing/TimeActivity";

export class TimeBlock {
  Sunday: TimeActivity;
  Monday: TimeActivity;
  Tuesday: TimeActivity;
  Wednesday: TimeActivity;
  Thursday: TimeActivity;
  Friday: TimeActivity;
  Saturday: TimeActivity;
  Ref: TimeActivity = new TimeActivity();
}
