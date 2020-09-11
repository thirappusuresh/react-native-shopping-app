import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import RoundButton from '../../components/Base/RoundButton';
import useConstants from '../../hooks/useConstants';
import useTheme from "../../hooks/useTheme";
const typeList = ["Woman", "Man", "Kids"]

const CategoryList = () => {
    const constants= useConstants();
    const theme = useTheme();

    return (
        <View style={style.container}>
            <Text>hello</Text>
            <ScrollView style={style.typeList} horizontal={true} showsHorizontalScrollIndicator={false}>
            <Text>helloo</Text>
                {typeList.map((res, index) => {
                    return <RoundButton key={index} buttonStyle={[style.typeListTab, { backgroundColor: theme.appColor, borderColor: theme.appColor }]} labelStyle={{ fontSize: 17, color: theme.highlightTextColor }} label={res} onPress={() => {alert(res)}} />
                })}
            </ScrollView>
        </View>
    )
};

const style = StyleSheet.create({
    container: {
        flex: 1.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
    },
    typeList: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    typeListTab: {
        minWidth: 120,
        marginRight: 20,
    }
});

export default CategoryList;