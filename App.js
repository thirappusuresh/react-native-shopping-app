import React, { useState } from "react";
import { Provider } from "react-redux";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { Platform, Text } from 'react-native';
import { store } from "./store";
import NavigationContainer from "./navigation/NavigationContainer";

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf")
  });
};

export function fixOppoTextCutOff() {
  if (Platform.OS !== 'android') {
    return
  }

  const oldRender = Text.render
  Text.render = function (...args) {
    const origin = oldRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [{ fontFamily: 'Roboto' }, origin.props.style]
    })
  }
}

fixOppoTextCutOff();

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
