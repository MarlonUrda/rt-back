import { isValidObjectId } from "mongoose";

export function getSearchField(id: string): [string, boolean] {
  if (isValidObjectId(id)) {
    return ["_id", false];
  }
  if (!isNaN(Number(id))) {
    return ["external_id", true];
  }
  return ["slug", false];
}