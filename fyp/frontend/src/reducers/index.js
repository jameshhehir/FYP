import { combineReducers } from "../../../../../../Library/Caches/typescript/2.9/node_modules/redux";
import details from "./details";
import errors from "./errors";
import messages from "./messages";
import auth from "./auth";

export default combineReducers({
  details,
  errors,
  messages,
  auth
});
