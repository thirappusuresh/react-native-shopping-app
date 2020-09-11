import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  Alert,
  ActivityIndicator, StatusBar,
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
            <View style={styles.childContainer}>
              <Input
                id="email"
                label="E-mail"
                keyboardType="email-address"
                required
                email
                autoCapitalize="none"
                errorText="Please enter a valid email address"
                onInputChange={inputChangeHandler}
                initialValue=""
                style={[styles.inputContainer, { borderBottomColor: theme.inputBorderColor, color: theme.textColor }]}
                placeholderTextColor={theme.lightTextColor}
                placeholder={language.userPlaceholder}
              />
            </View>
            <View style={styles.childContainer}>
              <Input
                id="password"
                label="Password"
                keyboardType="default"
                secureTextEntry
                required
                minLength={5}
                autoCapitalize="none"
                errorText="Please enter a valid password"
                onInputChange={inputChangeHandler}
                initialValue=""
                style={[styles.inputContainer, { borderBottomColor: theme.inputBorderColor, color: theme.textColor }]}
                placeholderTextColor={theme.lightTextColor}
                placeholder={language.passPlaceholder}
                secureTextEntry={true}
              />
            </View>
            <View style={styles.childContainer}>
              <ThemedText style={styles.forgotPassword} styleKey="textColor" onPress={() => { alert("ji") }}>{language.labelForget}</ThemedText>
            </View>
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.appColor} />
            ) : (
                <RoundButton label={isSignup ? "Sign Up" : "Login"} buttonStyle={{ minWidth: 230 }} onPress={authHandler} />
              )}
          </View>
          <RoundButton label={`Switch to ${isSignup ? "Login" : "Sign Up"}`} buttonStyle={{ minWidth: 230 }} onPress={() => {
            setIsSignup(prevState => !prevState);
          }} />
        </ScrollView>
      </ImageBackground >
    </View>
    //   <KeyboardAvoidingView
    //     behavior="padding"
    //     keyboardVerticalOffset={50}
    //     style={styles.screen}
    //   >
    //     <LinearGradient colors={["#012D4D", "#027FD9"]} style={styles.gradient}>
    //       <Card style={styles.authContainer}>
    //         <ScrollView>
    //           <Input
    //             id="email"
    //             label="E-mail"
    //             keyboardType="email-address"
    //             required
    //             email
    //             autoCapitalize="none"
    //             errorText="Please enter a valid email address"
    //             onInputChange={inputChangeHandler}
    //             initialValue=""
    //           />
    //           <Input
    //             id="password"
    //             label="Password"
    //             keyboardType="default"
    //             secureTextEntry
    //             required
    //             minLength={5}
    //             autoCapitalize="none"
    //             errorText="Please enter a valid password"
    //             onInputChange={inputChangeHandler}
    //             initialValue=""
    //           />
    //           <View style={styles.buttonContainer}>
    //             {isLoading ? (
    //               <ActivityIndicator size="small" color={Colors.primary} />
    //             ) : (
    //               <Button
    //                 title={isSignup ? "Sign Up" : "Login"}
    //                 color={Colors.accent}
    //                 onPress={authHandler}
    //               />
    //             )}
    //           </View>
    //           <View style={styles.buttonContainer}>
    //             <Button
    //               title={`Switch to ${isSignup ? "Login" : "Sign Up"}`}
    //               color={Colors.primary}
    //               onPress={() => {
    //                 setIsSignup(prevState => !prevState);
    //               }}
    //             />
    //           </View>
    //         </ScrollView>
    //       </Card>
    //     </LinearGradient>
    //   </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: "Authenticate"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
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
