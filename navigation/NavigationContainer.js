import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavigationActions } from "react-navigation";
import { View, Platform } from 'react-native';
import ShopNavigator from "./ShopNavigator";

const NavigationContainer = props => {
  const navRef = useRef();
  const isAuth = useSelector(state => !!state.auth.token);
  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
      );
    }
  }, [isAuth]);
  return <View style={{ flex: 1 }}>
    <ShopNavigator ref={navRef} />
  </View>;
};

export default NavigationContainer;
