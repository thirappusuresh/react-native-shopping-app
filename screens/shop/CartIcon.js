import React from "react";
import { Platform, Text, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector } from "react-redux";
import HeaderButton from "../../components/UI/HeaderButton";
import { Ionicons } from "@expo/vector-icons";
import IconBadge from 'react-native-icon-badge';

const CartIcon = ({ props }) => {
  const { navigation } = props
  const cartCount = useSelector(state => state.cart.items);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: 20 }} onPress={() => {
      navigation.navigate("Cart");
    }}>
      <IconBadge
        MainElement={
          <View onPress={() => {
            navigation.navigate("Cart");
          }}>
            <Ionicons
              onPress={() => {
                navigation.navigate("Cart");
              }}
              name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
              size={33}
              color={'#FFFFFF'}
            />
          </View>
        }
        BadgeElement={
          <Text onPress={() => {
            navigation.navigate("Cart");
          }} style={{ color: '#FFFFFF' }}>{Object.keys(cartCount).length}</Text>
        }
        IconBadgeStyle={
          {
            top: -5,
            right: -5,
            backgroundColor: '#000000'
          }
        }
      />
    </View>
  )
}

export default CartIcon;