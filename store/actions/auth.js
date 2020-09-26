import { AsyncStorage } from "react-native";

import Env from "../../constants/Environment";
import auth from '@react-native-firebase/auth';

// export const SIGNUP = "SIGNUP";
// export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
let timer;

export const authenticate = (userId, token, mobileNumber, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token, mobileNumber });
  };
};

export const updateLogin = (userId, token, mobileNumber, expiresIn = 100000) => {
  return async dispatch => {
    dispatch(
      authenticate(
        userId,
        token,
        mobileNumber,
        parseInt(expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(expiresIn) * 1000
    );
    saveDataToStorage(token, userId, mobileNumber, expirationDate);
  }
}

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  auth().signOut().then(function () { 
    console.log('Signed Out'); 
  }, function (error) { 
    console.error('Sign Out Error', error); 
  });
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, mobileNumber, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      mobileNumber,
      expiryDate: expirationDate.toISOString()
    })
  );
};
