import React from "react";
import { Platform, SafeAreaView, Button, View, Linking, StyleSheet, TouchableNativeFeedback, Text } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import {
  createDrawerNavigator,
  DrawerNavigatorItems
} from "react-navigation-drawer";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

import Colors from "../constants/Colors";
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import AddressScreen from "../screens/shop/AddressScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import AuthScreen from "../screens/user/AuthScreen";
import StartupScreen from "../screens/StartupScreen";
import * as authActions from "../store/actions/auth";
import { store } from "../store";
const { userId } = store.getState().auth;

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : ""
  },
  headerTitleStyle: { fontFamily: "open-sans-bold" },
  headerBackTitleStyle: { fontFamily: "open-sans" },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary
};

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen,
    Address: AddressScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === "android" ? "md-home" : "ios-home"}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const OrdersNavigator = createStackNavigator(
  { Orders: OrdersScreen },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === "android" ? "md-list" : "ios-list"}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const AdminNavigator = createStackNavigator(
  { UserProducts: UserProductsScreen, EditProduct: EditProductScreen },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === "android" ? "md-create" : "ios-create"}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const nativationOptions = {
  Home: ProductsNavigator,
  Orders: OrdersNavigator
};

//if (userId === "UReAmchbz7bKY6O9e1rANRJstG42") {
nativationOptions.Admin = AdminNavigator
//}

const DrawerNavigatorItem = ({ onPress, icon, title }) => {
  return <TouchableNativeFeedback
    onPress={onPress}
    style={null}
    background={TouchableNativeFeedback.Ripple(
      'rgba(0, 0, 0, .32)',
      false
    )}
  >
    <SafeAreaView
      style={[styles.item]}
    >
      <View
        style={[
          styles.icon,
          styles.inactiveIcon
        ]}
      >
        {icon}
      </View>
      <Text
        style={[
          styles.label
        ]}
      >
        {title}
    </Text>
    </SafeAreaView>
  </TouchableNativeFeedback>
}

const ShopNavigator = createDrawerNavigator(
  nativationOptions,
  {
    contentOptions: { activeTintColor: Colors.primary },
    contentComponent: props => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <DrawerNavigatorItems {...props} />
            <DrawerNavigatorItem icon={<Ionicons
              name={Platform.OS === "android" ? "md-call" : "ios-call"}
              size={23} />}
              onPress={() => Linking.openURL(`tel:8185081363`)}
              title="Call Helpline" />
            <DrawerNavigatorItem icon={<Ionicons
              name={Platform.OS === "android" ? "md-log-out" : "ioss-log-out"}
              size={23} />}
              onPress={() => dispatch(authActions.logout())}
              title="Logout" />
          </SafeAreaView>
        </View>
      );
    }
  }
);

const AuthNavigator = createStackNavigator(
  { Auth: AuthScreen },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator
});

export default createAppContainer(MainNavigator);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center',
  },
  inactiveIcon: {
    /*
     * Icons have 0.54 opacity according to guidelines
     * 100/87 * 54 ~= 62
     */
    opacity: 0.62,
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
  },
});
