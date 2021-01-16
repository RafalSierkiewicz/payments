import { IActionHandlers } from "models";

function createReducer<T>(defaultState: T, actionHandlers: IActionHandlers<T>) {
  return function reducer(state = defaultState, action: any) {
    if (actionHandlers.hasOwnProperty(action.type)) {
      return actionHandlers[action.type](state, action);
    }

    return state;
  };
}

export { createReducer };
