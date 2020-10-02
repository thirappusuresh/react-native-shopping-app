import React, { useState, useEffect } from "react";
import {
  FlatList,
  Button,
  Platform,
  Alert,
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import RoundButton from '../../components/Base/RoundButton';
import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/Colors";
import * as productsActions from "../../store/actions/products";
import * as ordersActions from "../../store/actions/orders";
import CategoryList from "../shop/CategoryList";
import OrderItem from "../../components/shop/OrderItem";

const UserProductsScreen = props => {
  const userProducts = useSelector(state => state.products.userProducts);
  const pendingOrders = useSelector(state => state.orders.pendingOrders);
  const deliveredOrders = useSelector(state => state.orders.deliveredOrders);
  const dispatch = useDispatch();
  const [selectedCategory, setCategory] = useState("products");
  const [isLoading, setIsLoading] = useState(false);

  const editProductHandler = id => {
    props.navigation.navigate("EditProduct", { productId: id });
  };

  useEffect(() => {
    props.navigation.addListener('didFocus', () => updateCategory(selectedCategory));
  }, [dispatch]);

  const deleteHandler = id => {
    Alert.alert("Are you sure?", "Do you really want to delete this product?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(productsActions.deleteProduct(id));
        }
      }
    ]);
  };

  if (userProducts.length === 0) {
    return (
      <View style={styles.screen}>
        <Text>No products found, maybe start creating some?</Text>
      </View>
    );
  }

  const OrdersList = ({ orders }) => {
    if (isLoading) {
      return (
        <View style={styles.screen}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    if (!orders || orders.length === 0) {
      return (
        <View style={styles.screen}>
          <Text>No orders found</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={orders}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <OrderItem
            amount={itemData.item.totalAmount}
            date={itemData.item.readableDate}
            item={itemData.item.items}
            address={itemData.item.address}
            isAdmin={true}
            id={itemData.item.id}
            status={itemData.item.status}
          />
        )}
      />
    );
  }

  const categoryMap = {
    products: <FlatList
      data={userProducts}
      keyExtractor={item => item.id}
      columnWrapperStyle={styles.row}
      numColumns={2}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
        >
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "85%"
          }}>
            <RoundButton
              color={Colors.primary}
              label="Edit"
              onPress={() => {
                editProductHandler(itemData.item.id);
              }}
            />
            <RoundButton
              color={Colors.primary}
              label="Delete"
              onPress={() => {
                deleteHandler(itemData.item.id);
              }}
            />
          </View>
        </ProductItem>
      )}
    />,
    pending_orders: <OrdersList orders={pendingOrders} />,
    delivered_orders: <OrdersList orders={deliveredOrders} />
  }

  const updateCategory = (category) => {
    setCategory(category);
    if (category === 'pending_orders' || category === 'delivered_orders') {
      setIsLoading(true);
      dispatch(ordersActions.fetchOrders(category)).then(() => {
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <CategoryList setCategory={(category) => updateCategory(category)} selectedCategory={selectedCategory} categories={[{ label: "Products", value: "products" }, { label: "Pending Orders", value: "pending_orders" }, { label: "Delivered Orders", value: "delivered_orders" }]} />
      {categoryMap[selectedCategory]}
    </View>
  );
};

UserProductsScreen.navigationOptions = navData => {
  return {
    headerTitle: "Admin",
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
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
          onPress={() => {
            navData.navigation.navigate("EditProduct");
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flex: 1,
    justifyContent: "space-evenly"
  }
});

export default UserProductsScreen;
