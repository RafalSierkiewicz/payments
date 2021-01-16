import { IActionHandlers, IAuthStore } from "models";
import { createReducer } from "utils/redux-helpers";

const defaultAuthState: IAuthStore = {};

const actionHandlers: IActionHandlers<IAuthStore> = {};

export const authReducer = createReducer(defaultAuthState, actionHandlers);
export { defaultAuthState };
