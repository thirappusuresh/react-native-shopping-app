import React, { useState } from "react";
import {
  FlatList, StyleSheet,
  Text,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BagItem from '../../components/Base/BagItem';
import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/cart";
import * as ordersActions from "../../store/actions/orders";
import ThemedText from '../../components/UI/ThemedText';

const CartScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const categories = useSelector(state => state.categories.availableCategories);
  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
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
  const dispatch = useDispatch();

  const sendOrderHandler = async () => {
    setIsLoading(true);
    await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      {/* <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>
            &#8377; {Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
            <Button
              color={Colors.accent}
              title="Order now"
              disabled={cartItems.length === 0}
              onPress={sendOrderHandler}
            />
          )}
      </Card> */}
      <FlatList
        data={cartItems}
        keyExtractor={item => item.productId}
        renderItem={itemData => (
          <BagItem item={itemData.item} categories={categories} onRemove={() => {
            dispatch(cartActions.removeFromCart(itemData.item.productId));
          }} />
        )}
        contentContainerStyle={{ flexGrow: 1 }}
        ListFooterComponentStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        ListFooterComponent={<View style={styles.continueBtn}>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between' }}>
            <ThemedText styleKey="highlightTextColor" style={styles.btnText}>Total: &#8377; {Math.round(cartTotalAmount.toFixed(2) * 100) / 100}</ThemedText>
            <ThemedText styleKey="highlightTextColor" style={styles.btnText}>Continue &#62;</ThemedText>
          </View>
        </View>}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: "My Cart"
};

const styles = StyleSheet.create({
  continueBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  btnText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  screen: {
    flex: 1
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18
  },
  amount: {
    color: Colors.primary
  }
});

export default CartScreen;
