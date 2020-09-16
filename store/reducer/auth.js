import { AUTHENTICATE, LOGOUT } from '../actions/auth';

const initialState = {
  token: '',
  userId: '',
};

export default (state = initialState, actions) => {
  switch (actions.type) {
    case AUTHENTICATE:
      return {
        token: actions.token,
        userId: actions.userId,
      };
    case LOGOUT:
      return {
        state,
      };
    // case SIGNUP:
    //   return {
    //     token: actions.token,
    //     userId: actions.userId,
    //   };
    default:
      return state;
  }
};
