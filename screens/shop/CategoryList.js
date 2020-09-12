import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import RoundButton from '../../components/Base/RoundButton';
import useConstants from '../../hooks/useConstants';
import useTheme from "../../hooks/useTheme";
const typeList = ["All", "Milk", "Dairy products", "Daily needs", "Ready to cook", "Snacks & Sweets"]
import Colors from "../../constants/Colors";

const CategoryList = () => {
    const constants = useConstants();
    const theme = useTheme();

    return (
        <View style={style.container}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {typeList.map((res, index) => {
                    return <Text key={index} style={[style.categoryItem, index === 0 ? {
                        borderBottomColor: Colors.primary,
                        borderBottomWidth: 2,
                    } : {}]} onPress={() => { alert(res) }} >{res}</Text>
                })}
            </ScrollView>
        </View>
    )
};

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20,
        shadowColor: "black",
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
        backgroundColor: "white"
    },
    categoryItem: {
        color: Colors.primary,
        fontWeight: "bold",
        padding: 10,
        fontSize: 16
    },
    typeListTab: {
        minWidth: 120,
        marginRight: 20,
    }
});

export default CategoryList;