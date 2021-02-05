import { UPDATE_STATE } from "./actions";

const initialState = {
  lables: [],
  date: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_STATE:
      return {
        lables: action.payload.lables,
        data: action.payload.data,
      };
    default:
      return state;
  }
}
