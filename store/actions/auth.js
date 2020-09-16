import AsyncStorage from '@react-native-community/async-storage';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
let timer;

export const authenticate = (token, userId, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, token: token, userId: userId });
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDZCoEnMWb_hrbgPnYgYVVTJ3Dii8Z5clw`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      const errorId = errorResponse.error.message;
      let message = 'Something went wrong';
      if (errorId === 'EMAIL_EXISTS') {
        message = 'This email exists already.';
      } else if (errorId === 'USER_DISABLED') {
        message = 'This user has been disabled';
      }
      console.log(errorResponse);
      throw new Error(message);
    }

    console.log('=============================== SIGNING UP =======================================');
    console.log(email, password);

    const responseData = await response.json();
    console.log(responseData);

    dispatch(authenticate(responseData.idToken, responseData.localId, parseInt(responseData.expiresIn * 1000)));

    // Calculate expiration time
    const expirationDate = new Date().getTime() + parseInt(responseData.expiresIn) * 1000;
    // Store data in drive
    saveDataToStorage(responseData.idToken, responseData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDZCoEnMWb_hrbgPnYgYVVTJ3Dii8Z5clw`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      const errorId = errorResponse.error.message;
      let message = 'Something went wrong';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'Email could not be found.';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'The password you provided is invalid';
      }
      console.log(errorResponse);
      throw new Error(message);
    }

    console.log('=============================== LOGGING IN =======================================');
    console.log(email, password);

    const responseData = await response.json();
    console.log(responseData);

    dispatch(authenticate(responseData.idToken, responseData.localId, parseInt(responseData.expiresIn * 1000)));

    // Calculate expiration time
    const expirationDate = new Date(new Date().getTime() + parseInt(responseData.expiresIn) * 1000);
    // Store data in drive
    saveDataToStorage(responseData.idToken, responseData.localId, expirationDate);
  };
};

const setLogoutTimer = (expirationTime) => {
  return async (dispatch) => {
    timer = setTimeout(() => dispatch(logout()), expirationTime );
  };
};

const clearLogoutTimer = (timer) => {
  if (timer) {
    clearTimeout(timer);
  }
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return async (dispatch) => {
    dispatch({ type: LOGOUT });
  };
};
