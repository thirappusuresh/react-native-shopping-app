import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  ActivityIndicator, Alert,
  Platform, StatusBar,
  ImageBackground, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import OTPTextView from 'react-native-otp-textinput';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from "react-redux";
import RoundButton from '../../components/Base/RoundButton';
import ThemedText from '../../components/UI/ThemedText';
import useTheme from '../../hooks/useTheme';
import * as authActions from "../../store/actions/auth";
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

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
let otpInput;
const AuthScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const theme = useTheme();
  const allowedAdminMobileNumbers = useSelector(state => state.auth.allowedAdminMobileNumbers);
  const [confirm, setConfirm] = useState(null);
  const [verification, setVerificationId] = useState();
  const [timer, setTimer] = useState(100);
  const [resend, setResend] = useState(false);
  let unsubscribe;
  let interval;
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
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [error]);

  const verifyOtp = async (code, verifyId) => {
    setOtpError(false);
    let otp = code ? code : formState.inputValues.password;
    let verificationId = verifyId ? verifyId : verification;
    if (otp.length > 5) {
      setIsLoading(true);
      try {
        const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, otp);
        console.log("creds: " + credential);
        let res = await auth().signInWithCredential(credential);
        console.log("res: " + res);
        let accessToken = await res.user.getIdToken();
        dispatch(authActions.updateLogin(res.user.uid, accessToken, formState.inputValues.email));
        if (allowedAdminMobileNumbers.includes(formState.inputValues.email)) {
          props.navigation.navigate("AdminShop");
        } else {
          props.navigation.navigate("Shop");
        }
        setIsLoading(false);
      } catch (err) {
        setOtpError(true);
        setIsLoading(false);
      }
    }
  }

  const verifyPhoneNumberListener = (phoneNumber) => {
    auth()
      .verifyPhoneNumber(phoneNumber)
      .on('state_changed', (phoneAuthSnapshot) => {
        // How you handle these state events is entirely up to your ui flow and whether
        // you need to support both ios and android. In short: not all of them need to
        // be handled - it's entirely up to you, your ui and supported platforms.

        // E.g you could handle android specific events only here, and let the rest fall back
        // to the optionalErrorCb or optionalCompleteCb functions
        switch (phoneAuthSnapshot.state) {
          // ------------------------
          //  IOS AND ANDROID EVENTS
          // ------------------------
          case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
            console.log('code sent');
            setIsLoading(false)
            setResend(false);
            setVerificationId(phoneAuthSnapshot.verificationId);
            let count = 100;
            setTimer(count);
            interval = setInterval(
              () => {
                if (count > 0) {
                  setTimer(prevTimer => {
                    count = prevTimer - 1;
                    return count;
                  });
                } else {
                  clearInterval(interval);
                  setResend(true);
                }
              },
              1000
            );
            // on ios this is the final phone auth state event you'd receive
            // so you'd then ask for user input of the code and build a credential from it
            // as demonstrated in the `signInWithPhoneNumber` example above
            break;
          case firebase.auth.PhoneAuthState.ERROR: // or 'error'
            console.log('verification error');
            console.log(phoneAuthSnapshot.error);
            break;

          // ---------------------
          // ANDROID ONLY EVENTS
          // ---------------------
          case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
            console.log('auto verify on android timed out');
            // proceed with your manual code input flow, same as you would do in
            // CODE_SENT if you were on IOS
            break;
          case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
            // auto verified means the code has also been automatically confirmed as correct/received
            // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
            console.log('auto verified on android');
            console.log(phoneAuthSnapshot);
            clearInterval(interval);
            setTimer(0);
            // Example usage if handling here and not in optionalCompleteCb:
            const { verificationId, code } = phoneAuthSnapshot;
            setVerificationId(verificationId);
            otpInput.setValue(code)
            verifyOtp(code, verificationId);

            // const credential = auth().PhoneAuthProvider.credential(verificationId, code);

            // Do something with your new credential, e.g.:
            // firebase.auth().signInWithCredential(credential);
            // firebase.auth().currentUser.linkWithCredential(credential);
            // etc ...
            break;
        }
      }, (error) => {
        // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
        // the ERROR case in the above observer then there's no need to handle it here
        console.log(error);
        setError(error && error.message);
        setIsLoading(false);
        // verificationId is attached to error if required
        console.log(error.verificationId);
      }, (phoneAuthSnapshot) => {
        // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
        // depending on the platform. If you've already handled those cases in the observer then
        // there's absolutely no need to handle it here.

        // Platform specific logic:
        // - if this is on IOS then phoneAuthSnapshot.code will always be null
        // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
        //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
        // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
        //   continue with user input logic.
        console.log(phoneAuthSnapshot);
      });
    // optionally also supports .then & .catch instead of optionalErrorCb &
    // optionalCompleteCb (with the same resulting args)
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

  const [otpError, setOtpError] = useState(false);
  const [isVerifyCode, setVerifyCode] = useState(false);
  return (
    <View>
      <ImageBackground source={ImagePath} style={{ width: '100%', height: '100%' }} >
        <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always'>
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <ThemedText styleKey="appColor" style={styles.title}>{verification ? "Verify Your Phone" : "Login"}</ThemedText>
            </View>
            {!verification ? <>
              <View style={styles.formControl}>
                <View style={styles.childContainer}>
                  <ThemedText style={styles.inputLabel} styleKey="inputColor">Enter Mobile Number</ThemedText>
                </View>
                <TextInput
                  value={formState.inputValues.email}
                  onChangeText={(val) => inputChangeHandler("email", val, true)}
                  placeholderTextColor={theme.lightTextColor}
                  placeholder={"Mobile Number"}
                  style={[styles.inputContainer, { borderBottomColor: theme.inputBorderColor, color: theme.textColor }]}
                  keyboardType='numeric'
                  maxLength={10}
                />
              </View>
              {error ? <Text style={{ color: theme.appColor, marginTop: 20 }}>{error}</Text> : undefined}
              {isLoading ? (<View>
                <Text style={{ color: theme.appColor, paddingBottom: 20 }}>Waiting for OTP from server</Text>
                <ActivityIndicator size="small" color={theme.appColor} />
              </View>
              ) : (
                  <RoundButton label={"SEND OTP"} buttonStyle={{ opacity: formState.inputValues.email.length === 10 ? 1 : 0.5 }} onPress={async () => {
                    if (formState.inputValues.email.length === 10) {
                      setIsLoading(true);
                      verifyPhoneNumberListener("+91" + formState.inputValues.email);
                      setOtpError(false);
                      setError("");
                    }
                  }} />)}
            </>
              :
              <>
                <Text style={{ color: theme.appColor }}>Enter the OTP sent to your number</Text>
                <View style={{
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: "black"
                  }}>{formState.inputValues.email}</Text>
                  <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setVerificationId("")}>
                    <MaterialIcon name="pencil" size={20} color={theme.appColor} />
                  </TouchableOpacity>
                </View>
                {timer > 0 ? <View>
                  <Text>
                    <Text style={{ color: theme.appColor }}>{"00:" + timer + " "}</Text>waiting for OTP..</Text>
                </View> : <></>}
                {resend ? <TouchableOpacity onPress={() => {
                  setResend(false);
                  verifyPhoneNumberListener("+91" + formState.inputValues.email);
                }}>
                  <Text style={{ color: theme.appColor }}>Resend OTP</Text>
                </TouchableOpacity> : <></>}
                <View style={styles.formControl}>
                  <OTPTextView
                    ref={e => (otpInput = e)}
                    handleTextChange={(text) => inputChangeHandler("password", text, true)}
                    inputCount={6}
                    keyboardType="numeric"
                    tintColor={theme.appColor}
                  />
                </View>
                {isLoading ? (
                  <View>
                    <Text style={{ color: theme.appColor, paddingBottom: 20, marginTop: 20 }}>Verifying OTP...</Text>
                    <ActivityIndicator size="small" color={theme.appColor} />
                  </View>
                ) : (
                    <View>
                      {otpError ? <Text style={{ color: theme.appColor, marginTop: 20 }}>Wrong OTP</Text> : undefined}
                      <RoundButton label={"VERIFY"}
                        buttonStyle={{ marginTop: 20, opacity: formState.inputValues.password.length > 5 ? 1 : 0.5 }}
                        onPress={() => verifyOtp()} />
                    </View>
                  )}
              </>
            }
          </View>
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
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    fontFamily: "open-sans",
    fontSize: 13,
    color: "red"
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
