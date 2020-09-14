import React, { useCallback, useEffect, useReducer, useState, useRef } from "react";
import {
  Alert,
  ActivityIndicator, StatusBar, Text, TextInput,
  ImageBackground, ScrollView, StyleSheet, Platform, TouchableOpacity, View
} from "react-native";
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from "react-redux";
import RoundButton from '../../components/Base/RoundButton';
import Input from "../../components/UI/Input";
import ThemedText from '../../components/UI/ThemedText';
import useConstants from '../../hooks/useConstants';
import useLanguage from '../../hooks/useLanguage';
import useTheme from '../../hooks/useTheme';
import * as authActions from "../../store/actions/auth";
import { firebase } from "../../firebase";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
const ImagePath = require("../../images/Recraftsoppify_aap_bg_effect.png");
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const AuthScreen = props => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const constants = useConstants();
  const theme = useTheme();
  const language = useLanguage();


  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: ""
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Ok" }]);
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate("Shop");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const updateLoginDetails = async (userId, token) => {
    dispatch(authActions.updateLogin(userId, token));
    props.navigation.navigate("Shop");
  }

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  const recaptchaVerifier = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState();
  const [verificationId, setVerificationId] = useState();
  const [verificationCode, setVerificationCode] = useState();
  const [isVerifyCode, setVerifyCode] = useState(false);
  const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
  const [message, showMessage] = useState((!firebaseConfig || Platform.OS === 'web')
    ? { text: "To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device." }
    : undefined);

  return (
    <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <ImageBackground source={ImagePath} style={{ width: '100%', height: '100%' }} >
        <TouchableOpacity onPress={() => { }}>
          <MaterialIcon name="arrow-left" size={30} color={theme.textColor} style={styles.backIcon} />
        </TouchableOpacity>
        <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always'>
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <ThemedText styleKey="appColor" style={styles.title}>{isSignup ? "Sign Up" : "Login"}</ThemedText>
            </View>
            {!isVerifyCode ? <><FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={firebaseConfig}
            />
              <View style={styles.formControl}>
                <View style={styles.childContainer}>
                  <ThemedText style={styles.inputLabel} styleKey="inputColor">Enter Phone Number</ThemedText>
                </View>
                <TextInput
                  value={formState.inputValues.email}
                  onChangeText={(val) => inputChangeHandler("email", val, true)}
                  placeholderTextColor={theme.lightTextColor}
                  placeholder={"Phone Number"}
                  style={[styles.inputContainer, { borderBottomColor: theme.inputBorderColor, color: theme.textColor }]}
                />
              </View>
              {isLoading ? (
                <ActivityIndicator size="small" color={theme.appColor} />
              ) : (
                  <RoundButton label={"Send Verification Code"} buttonStyle={{ opacity: formState.inputValues.email ? 1 : 0.5 }} onPress={async () => {
                    // The FirebaseRecaptchaVerifierModal ref implements the
                    // FirebaseAuthApplicationVerifier interface and can be
                    // passed directly to `verifyPhoneNumber`.
                    if (formState.inputValues.email) {
                      setIsLoading(true);
                      try {
                        const phoneProvider = new firebase.auth.PhoneAuthProvider();
                        const verificationId = await phoneProvider.verifyPhoneNumber(
                          "+91" + formState.inputValues.email,
                          recaptchaVerifier.current
                        );
                        setVerificationId(verificationId);
                        setVerifyCode(true);
                        inputChangeHandler("password", "", true);
                        setIsLoading(false);
                      } catch (err) {
                        showMessage({ text: `Error: ${err.message}`, color: "red" });
                        setIsLoading(false);
                      }
                    }
                  }} />)}
            </>
              :
              <>
                <Text style={{ color: theme.appColor, paddingBottom: 20 }} onPress={() => setVerifyCode(false)}>Verification code has been sent to your phone number: {formState.inputValues.email}. Click here to change the number</Text>
                <View style={styles.formControl}>
                  <View style={styles.childContainer}>
                    <ThemedText style={styles.inputLabel} styleKey="inputColor">Enter Verification Code</ThemedText>
                  </View>
                  <TextInput
                    value={formState.inputValues.password}
                    onChangeText={(val) => inputChangeHandler("password", val, true)}
                    placeholderTextColor={theme.lightTextColor}
                    placeholder={"Verification Code"}
                    style={[styles.inputContainer, { borderBottomColor: theme.inputBorderColor, color: theme.textColor }]}
                  />
                </View>
                {isLoading ? (
                  <ActivityIndicator size="small" color={theme.appColor} />
                ) : (
                    <RoundButton label={"Confirm Verification Code"}
                      buttonStyle={{ opacity: formState.inputValues.password.length > 5 ? 1 : 0.5 }}
                      onPress={async () => {
                        if (formState.inputValues.password.length > 5) {
                          setIsLoading(true);
                          try {
                            const credential = firebase.auth.PhoneAuthProvider.credential(
                              verificationId,
                              formState.inputValues.password
                            );
                            let res = await firebase.auth().signInWithCredential(credential);
                            setIsLoading(false);
                            let accessToken = await res.user.getIdToken();
                            updateLoginDetails(res.user.uid, accessToken);
                          } catch (err) {
                            showMessage({ text: `Error: ${err.message}`, color: "red" });
                            setIsLoading(false);
                          }
                        }
                      }} />
                  )}
              </>
            }
          </View>
          {message ? (
            <TouchableOpacity
              style={[StyleSheet.absoluteFill, { backgroundColor: 0xffffffee, justifyContent: "center" }]}
              onPress={() => showMessage(undefined)}>
              <Text style={{ color: message.color || "blue", fontSize: 17, textAlign: "center", margin: 20, }}>
                {message.text}
              </Text>
            </TouchableOpacity>
          ) : undefined}
        </ScrollView>
      </ImageBackground >
    </View>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: "Authenticate"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  formControl: {
    width: "100%"
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1
  },
  inputLabel: {
    width: "100%",
    fontSize: 13
  },
  childContainer: {
    flexDirection: 'row',
    justifyContent: "center",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  buttonContainer: {
    marginTop: 10
  },
  container: {
    flex: 1,
    paddingLeft: 35,
    paddingRight: 35,
    fontSize: 16,
    backgroundColor: 'transparent',
    justifyContent: "center",
    alignItems: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 80,
    marginBottom: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 30,
    paddingBottom: 30,
  },
  inputLabel: {
    width: "100%",
    fontSize: 13
  },
  childContainer: {
    flexDirection: 'row',
    justifyContent: "center",
  },
  forgotPassword: {
    marginTop: 20,
    marginBottom: 15,
    fontSize: 16,
  },
  inputContainer: {
    height: 40,
    marginTop: 10,
    width: "100%",
    marginBottom: 15,
    borderBottomWidth: 2,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
  },
  iconContainer: {
    borderRadius: 6,
    margin: 12,
    minWidth: 50,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    elevation: 6,
  },
  Icon: {
    fontSize: 25,
    padding: 15,
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 25,
    paddingTop: 20,
    paddingLeft: 25,
  }
});

export default AuthScreen;
