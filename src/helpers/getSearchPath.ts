import { isValidObjectId } from "mongoose";

export function getSearchField(id: string): [string, boolean] {
  if (isValidObjectId(id)) {
    return ["_id", false];
  }
  // if is number, then is external_id, else is slug
  if (!isNaN(Number(id))) {
    return ["external_id", true];
  }
  return ["slug", false];
}