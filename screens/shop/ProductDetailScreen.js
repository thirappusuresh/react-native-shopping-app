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

const ProductDetailScreen = props => {
  const productId = props.navigation.getParam("productId");
  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  );
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const theme = useTheme();
  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        {cartItems[selectedProduct.id] && cartItems[selectedProduct.id].quantity
          ?
          <View style={{ paddingTop: 10 }}><Counter max={100} countTextStyle={{ color: theme.appColor }} buttonTextStyle={{ color: theme.appColor }} buttonStyle={{ borderColor: theme.appColor }} start={cartItems[selectedProduct.id].quantity} onChange={(number, type) => {
            if (type === "+") {
              dispatch(cartActions.addToCart(selectedProduct));
            } else {
              dispatch(cartActions.removeFromCart(selectedProduct.id));
            }
          }} /></View>
          :
          <RoundButton
            color={Colors.primary}
            label="Add to Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(selectedProduct));
            }}
          />}
      </View>
      <Text style={styles.price}>&#8377; {selectedProduct.price.toFixed && selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam("productTitle")
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

export default ProductDetailScreen;
