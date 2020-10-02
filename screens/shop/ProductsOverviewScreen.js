import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Platform,
  Button,
  ActivityIndicator,
  StyleSheet,
  Text
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import RoundButton from '../../components/Base/RoundButton';
import Colors from "../../constants/Colors";
import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/products";
import HeaderButton from "../../components/UI/HeaderButton";
import CategoryList from "./CategoryList";
import CartIcon from './CartIcon';
import Counter from "react-native-counters";
import useTheme from '../../hooks/useTheme';

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector(state => state.products.availableProducts);
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [selectedCategory, setCategory] = useState();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  // init
  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);
  // reload
  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProducts
    );
    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Loading..</Text>
      </View>
    );
  }
  return (
    <View style={styles.productsView}>
      <CategoryList setCategory={(category) => setCategory(category)} selectedCategory={selectedCategory} />
      <FlatList
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={selectedCategory ? products && products.filter(product => product.category === selectedCategory) : products}
        columnWrapperStyle={styles.row}
        numColumns={2}
        keyExtractor={item => item.id}
        extraData={cartItems}
        renderItem={itemData => (
          <ProductItem
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          >
            {cartItems[itemData.item.id] && cartItems[itemData.item.id].quantity
              ?
              <View style={{ paddingTop: 10 }}><Counter max={100} countTextStyle={{ color: theme.appColor }} buttonTextStyle={{ color: theme.appColor }} buttonStyle={{ borderColor: theme.appColor }} start={cartItems[itemData.item.id].quantity} onChange={(number, type) => {
                if (type === "+") {
                  dispatch(cartActions.addToCart(itemData.item));
                } else {
                  dispatch(cartActions.removeFromCart(itemData.item.id));
                }
              }} /></View>
              :
              <RoundButton
                color={Colors.primary}
                label="Add to Cart"
                onPress={() => {
                  dispatch(cartActions.addToCart(itemData.item));
                }}
              />}
          </ProductItem>
        )}
      />
    </View>
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: "Products",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <CartIcon props={navData} />
    )
  };
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  productsView: {
    flex: 1
  },
  row: {
    flex: 1,
    justifyContent: "space-evenly"
  }
});

export default ProductsOverviewScreen;
