import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import RoundButton from '../../components/Base/RoundButton';
import useConstants from '../../hooks/useConstants';
import useTheme from "../../hooks/useTheme";
const typeList = [{ label: "All" }, { label: "Groceries", value: "groceries" }, { label: "Dairy Products", value: "dairy_products" }]
import Colors from "../../constants/Colors";

const CategoryList = ({ setCategory, selectedCategory }) => {
    const constants = useConstants();
    const theme = useTheme();

    return (
        <View style={style.container}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {typeList.map((res, index) => {
                    let isHighlightTab = selectedCategory ? res.value === selectedCategory : index === 0;
                    return <Text key={index} style={[style.categoryItem, isHighlightTab ? {
                        borderBottomColor: Colors.primary,
                        borderBottomWidth: 2,
                    } : {}]} onPress={() => { setCategory(res.value) }} >{res.label}</Text>
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