import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from "react-native";

import Card from "../UI/Card";

const ProductItem = props => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: props.image }} />
            </View>
            <View style={styles.details}>
              <Text style={styles.title} numberOfLines={1}>{props.title}</Text>
              <Text style={styles.price}>&#8377; {props.price.toFixed(2)}</Text>
            </View>
            <View style={styles.actions}>{props.children}</View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    height: 320,
    flex: 0.5,
    flexDirection: 'column',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    borderRadius: 10,
    overflow: "hidden"
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  details: {
    alignItems: "center",
    height: "17%",
    padding: 10
  },
  title: {
    fontSize: 18,
    fontFamily: "open-sans-bold",
    marginVertical: 2
  },
  price: {
    fontSize: 14,
    fontFamily: "open-sans",
    color: "#888"
  },
  actions: {
    alignItems: "center",
    width: "100%",
    height: "23%",
    paddingHorizontal: 20,
    paddingVertical: 5
  }
});

export default ProductItem;
