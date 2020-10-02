import { AntDesign } from '@expo/vector-icons';
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, Linking, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import BagItem from '../../components/Base/BagItem';
import Colors from "../../constants/Colors";
import Card from "../UI/Card";
import * as ordersActions from "../../store/actions/orders";

const OrderItem = props => {
  const [showDetails, setShowDetails] = useState(false);
  const categories = useSelector(state => state.categories.availableCategories);
  const { address, isAdmin } = props;
  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>&#8377; {props.amount && props.amount.toFixed(2)}</Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>
      <View style={styles.summary} >
        <TouchableOpacity onPress={() => {
          setShowDetails(prevState => !prevState);
        }} style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
          <AntDesign
            name={showDetails ? "caretdown" : "caretright"}
            size={20}
            color={Colors.primary}
          />
          <Text
            style={{ marginLeft: 5, color: Colors.primary }}
          >{showDetails ? "Hide details" : "Show details"}</Text>
        </TouchableOpacity>
        {isAdmin && <TouchableOpacity onPress={() => alert('order delivered')}>
          <Text style={{ color: Colors.primary }}>Mark as delivered</Text>
        </TouchableOpacity>}
      </View>
      {showDetails && (
        <View style={styles.detailItems}>
          <View style={[styles.summary, { marginTop: 20 }]}>
            <Text style={styles.totalAmount}>Address</Text>
            <View style={styles.address}>
              <Text style={styles.date}>{`${address.name}, ${address.doorNo}, ${address.addressLine1}, ${address.addressLine2}, `}{isAdmin ? '' : address.mobileNumber}</Text>
              {isAdmin && <TouchableOpacity onPress={() => Linking.openURL(`tel:${address.mobileNumber}`)}>
                <Text style={{ color: Colors.primary, marginTop: 10 }}>{address.mobileNumber}</Text>
              </TouchableOpacity>}
            </View>
          </View>
          <FlatList
            data={props.item}
            keyExtractor={item => item.productId}
            renderItem={itemData => (
              <BagItem item={itemData.item} categories={categories} isHideRemove={true} />
            )}
          />
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: "flex-start"
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 15
  },
  totalAmount: {
    fontFamily: "open-sans-bold",
    fontSize: 16
  },
  date: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: "#888",
  },
  address: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: "flex-start",
    marginLeft: 20
  },
  detailItems: {
    width: "100%"
  }
});

export default OrderItem;
