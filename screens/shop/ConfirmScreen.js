import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Button
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Counter from "react-native-counters";
import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/cart";
import useTheme from '../../hooks/useTheme';
import RoundButton from '../../components/Base/RoundButton';
import ThemedText from '../../components/UI/ThemedText';

const ConfirmScreen = props => {
  const theme = useTheme();

  return (
    <ScrollView>
      <View style={{ alignItems: 'center', padding: 20 }}>
        <ThemedText styleKey="appColor" style={{ fontSize: 30, fontWeight: 'bold' }}>Thank You!!</ThemedText>
        <ThemedText styleKey="textColor" style={{ fontSize: 18, marginTop: 20 }}>Your order has been placed successfully</ThemedText>
        <ThemedText styleKey="textColor" style={{ fontSize: 18, textAlign: 'center', marginTop: 20, marginBottom: 40 }}>Now sit back and relax while we deliver your order to your doorstep</ThemedText>
        <RoundButton
          color={theme.appColor}
          label="View Orders"
          onPress={() => {
            props.navigation.navigate("Orders");
          }}
        />
        <RoundButton
          color={theme.appColor}
          label="Continue Shopping"
          onPress={() => {
            props.navigation.navigate("Shop");
          }}
        />
      </View>
    </ScrollView>
  );
};

ConfirmScreen.navigationOptions = navData => {
  return {
    headerTitle: "Order Confirmation"
  };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300
  },
  actions: {
    marginVertical: 10,
    alignItems: "center"
  },
  price: {
    fontSize: 20,
    fontFamily: "open-sans-bold",
    color: "#888",
    textAlign: "center",
    marginVertical: 20
  },
  description: {
    fontSize: 14,
    fontFamily: "open-sans",
    textAlign: "center",
    marginHorizontal: 20
  }
});

export default ConfirmScreen;
