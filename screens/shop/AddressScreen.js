import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  ActivityIndicator, Alert, Platform, ScrollView,
  StyleSheet, View, TouchableOpacity
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/UI/Input";
import ThemedText from '../../components/UI/ThemedText';
import Colors from "../../constants/Colors";
import useTheme from '../../hooks/useTheme';
import * as ordersActions from "../../store/actions/orders";
import * as cartActions from "../../store/actions/cart";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

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

const AddressScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const theme = useTheme();
  const mobileNumber = useSelector(state => state.auth.mobileNumber);
  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
  const address = useSelector(state => state.cart.address);
  const cartItems = useSelector(state => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
        productImage: state.cart.items[key].productImage,
        productCategory: state.cart.items[key].productCategory
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValidities: {
      name: false,
      doorNo: false,
      addressLine1: false,
      addressLine2: false,
      pincode: true,
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred", error, [{ text: "OK" }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form.", [
        { text: "OK" }
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const address = formState.inputValues;
      address.pincode = "516227";
      address.mobileNumber = mobileNumber;
      await dispatch(cartActions.addAddress(address));
      await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount, address));
      props.navigation.navigate("Confirm");
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, formState]);

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

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <View style={styles.form}>
          <Input
            label="Name*"
            id="name"
            errorText="Please enter your name"
            keyboardType="default"
            autoCapitalize="sentences"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={address ? address.name : ""}
            initiallyValid={!!address}
            required
          />
          <Input
            label="Door No / Office / Company*"
            id="doorNo"
            errorText="Please fill the mandatory field"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={address ? address.doorNo : ""}
            initiallyValid={!!address}
            required
          />
          <Input
            label="Address Line 1 / Street Name*"
            id="addressLine1"
            errorText="Please fill the mandatory field"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={address ? address.addressLine1 : ""}
            initiallyValid={!!address}
            required
          />
          <Input
            label="Address Line 2 / Landmark*"
            id="addressLine2"
            errorText="Please fill the mandatory field"
            keyboardType="default"
            autoCapitalize="sentences"
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={address ? address.addressLine2 : ""}
            initiallyValid={!!address}
            required
          />
          <Input
            label="Pincode"
            id="pincode"
            editable={false}
            errorText="Please enter a valid description!"
            keyboardType="decimal-pad"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={"516227"}
            initiallyValid={true}
            required
            minLength={5}
          />
          <ThemedText styleKey="appColor">Currently the service is available only in Badvel!!</ThemedText>
        </View>
      </ScrollView>
      <View style={styles.bottomView} >
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (<TouchableOpacity onPress={submitHandler} style={{width: "100%", alignItems: "center"}}>
          <ThemedText styleKey="highlightTextColor" style={styles.btnText}>Place Order</ThemedText>
        </TouchableOpacity>)}
      </View>
    </View>
  );
};

AddressScreen.navigationOptions = navData => {
  return {
    headerTitle: "Shipping Address",
  };
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  form: {
    margin: 20
  },
  inputContainer: {
    height: 40,
    marginTop: 10,
    width: "100%",
    marginBottom: 15,
    borderBottomWidth: 2,
    fontSize: 16,
  },
  inputLabel: {
    width: "100%",
    fontSize: 13
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: (Platform.OS === 'ios') ? 20 : 0
  },
  bottomView: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0
  },
  btnText: {
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default AddressScreen;
